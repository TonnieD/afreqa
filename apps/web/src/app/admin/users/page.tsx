import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { AdminsManager } from "@/components/admin/AdminsManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const currentUser = await requireAuth("users:manage");

  let users: Array<{
    id: string;
    name: string;
    email: string;
    role: any;
    mustChangePassword: boolean;
    totpEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      auditLogs: number;
      sessions: number;
    };
  }> = [];

  try {
    users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
        totpEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            auditLogs: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    // Fallback if DB unavailable
  }

  const serializedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }));

  return <AdminsManager currentUser={currentUser} initialUsers={serializedUsers} />;
}
