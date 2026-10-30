import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getSessionUser } from "@/lib/auth";
import { logger } from "@afreqa/core";

export const dynamic = "force-dynamic";

const uploadBaseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const tusDirectory = path.join(uploadBaseDir, "tus");

const TUS_HEADERS = {
  "Tus-Resumable": "1.0.0",
  "Tus-Version": "1.0.0",
  "Tus-Extension": "creation,termination,expiration",
  "Access-Control-Expose-Headers": "Location, Upload-Offset, Upload-Length, Tus-Resumable, Tus-Version",
};

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: TUS_HEADERS,
  });
}

export async function HEAD(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const filePath = path.join(tusDirectory, id);
  const infoPath = path.join(tusDirectory, `${id}.info`);

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
  const user = await getSessionUser();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized operator" }, { status: 403 });
  }

  const { id } = await params;
  const offsetHeader = req.headers.get("upload-offset");
  if (offsetHeader === null) {
    return new NextResponse("Missing Upload-Offset header", { status: 400 });
  }

  const clientOffset = parseInt(offsetHeader, 10);
  const filePath = path.join(tusDirectory, id);

  try {
    const stat = await fs.stat(filePath);
    if (stat.size !== clientOffset) {
      return new NextResponse(`Offset mismatch: expected ${stat.size}, got ${clientOffset}`, {
        status: 409,
        headers: {
          ...TUS_HEADERS,
          "Upload-Offset": String(stat.size),
        },
      });
    }

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

  const { id } = await params;
  const filePath = path.join(tusDirectory, id);
  const infoPath = path.join(tusDirectory, `${id}.info`);

  await fs.rm(filePath, { force: true }).catch(() => {});
  await fs.rm(infoPath, { force: true }).catch(() => {});

  return new NextResponse(null, {
    status: 204,
    headers: TUS_HEADERS,
  });
}

