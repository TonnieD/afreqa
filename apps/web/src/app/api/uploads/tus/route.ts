import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getSessionUser } from "@/lib/auth";
import { checkDiskSpaceForUpload, logger } from "@afreqa/core";

export const dynamic = "force-dynamic";

const uploadBaseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const tusDirectory = path.join(uploadBaseDir, "tus");

// Ensure tus directory exists
async function ensureTusDir() {
  await fs.mkdir(tusDirectory, { recursive: true }).catch(() => {});
}
ensureTusDir().catch(() => {});

// Common Tus headers
const TUS_HEADERS = {
  "Tus-Resumable": "1.0.0",
  "Tus-Version": "1.0.0",
  "Tus-Extension": "creation,termination,expiration",
  "Tus-Max-Size": "4294967296", // 4 GB max upload
  "Access-Control-Expose-Headers": "Location, Upload-Offset, Upload-Length, Tus-Resumable, Tus-Version",
};

interface RouteParams {
  params: Promise<{ file?: string[] }>;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: TUS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  // 1. Authenticate operator (strictly ADMIN or SUPER_ADMIN)
  const user = await getSessionUser();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized operator" }, { status: 403 });
  }

  // 2. Validate upload length & 3x disk-space check
  const uploadLengthStr = req.headers.get("upload-length");
  const uploadLength = uploadLengthStr ? parseInt(uploadLengthStr, 10) : 0;

  if (uploadLength > 0) {
    const spaceCheck = await checkDiskSpaceForUpload(uploadLength);
    if (!spaceCheck.allowed) {
      return new NextResponse("Insufficient storage: at least 3x file size required on disk.", {
        status: 507,
        headers: TUS_HEADERS,
      });
    }
  }

  // 3. Generate file id and initialize placeholder
  const uploadId = `vid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const metadata = req.headers.get("upload-metadata") || "";

  const filePath = path.join(tusDirectory, uploadId);
  const infoPath = path.join(tusDirectory, `${uploadId}.info`);

  await ensureTusDir();
  await fs.writeFile(filePath, Buffer.alloc(0));
  await fs.writeFile(
    infoPath,
    JSON.stringify({
      id: uploadId,
      size: uploadLength,
      offset: 0,
      metadata,
      createdAt: new Date().toISOString(),
    })
  );

  const origin = req.headers.get("origin") || "";
  const location = `/api/uploads/tus/${uploadId}`;

  return new NextResponse(null, {
    status: 201,
    headers: {
      ...TUS_HEADERS,
      Location: location,
      "Upload-Offset": "0",
    },
  });
}

export async function HEAD(req: NextRequest, { params }: RouteParams) {
  const { file } = await params;
  const uploadId = file?.[0];
  if (!uploadId) {
    return new NextResponse("Upload ID missing", { status: 400 });
  }

  const filePath = path.join(tusDirectory, uploadId);
  const infoPath = path.join(tusDirectory, `${uploadId}.info`);

  try {
    const stat = await fs.stat(filePath);
    let size = 0;
    try {
      const infoRaw = await fs.readFile(infoPath, "utf-8");
      const info = JSON.parse(infoRaw);
      size = info.size || 0;
    } catch {}

    return new NextResponse(null, {
      status: 200,
      headers: {
        ...TUS_HEADERS,
        "Upload-Offset": String(stat.size),
        "Upload-Length": String(size),
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  // 1. Authenticate operator
  const user = await getSessionUser();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized operator" }, { status: 403 });
  }

  const { file } = await params;
  const uploadId = file?.[0];
  if (!uploadId) {
    return new NextResponse("Upload ID missing", { status: 400 });
  }

  const offsetHeader = req.headers.get("upload-offset");
  if (offsetHeader === null) {
    return new NextResponse("Missing Upload-Offset header", { status: 400 });
  }

  const clientOffset = parseInt(offsetHeader, 10);
  const filePath = path.join(tusDirectory, uploadId);

  try {
    const stat = await fs.stat(filePath);
    if (stat.size !== clientOffset) {
      // Offset conflict
      return new NextResponse(`Offset mismatch: expected ${stat.size}, got ${clientOffset}`, {
        status: 409,
        headers: {
          ...TUS_HEADERS,
          "Upload-Offset": String(stat.size),
        },
      });
    }

    // Read chunk bytes from stream
    const chunkBuffer = Buffer.from(await req.arrayBuffer());
    await fs.appendFile(filePath, chunkBuffer);

    const newOffset = stat.size + chunkBuffer.length;

    return new NextResponse(null, {
      status: 204,
      headers: {
        ...TUS_HEADERS,
        "Upload-Offset": String(newOffset),
      },
    });
  } catch (err) {
    logger.error("Error in Tus PATCH chunk upload", err);
    return new NextResponse("Internal upload error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized operator" }, { status: 403 });
  }

  const { file } = await params;
  const uploadId = file?.[0];
  if (!uploadId) {
    return new NextResponse("Upload ID missing", { status: 400 });
  }

  const filePath = path.join(tusDirectory, uploadId);
  const infoPath = path.join(tusDirectory, `${uploadId}.info`);

  await fs.rm(filePath, { force: true }).catch(() => {});
  await fs.rm(infoPath, { force: true }).catch(() => {});

  return new NextResponse(null, {
    status: 204,
    headers: TUS_HEADERS,
  });
}

