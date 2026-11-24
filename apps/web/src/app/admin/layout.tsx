import { getSessionUser } from "@/lib/auth";
import { db } from "@afreqa/core";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminInactivityTimeout } from "@/components/admin/AdminInactivityTimeout";

export const metadata = {
  title: "Afreqa Operations | Admin Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // If unauthenticated or in change-password flow without sidebar
  if (!user || user.mustChangePassword) {
    return <div className="min-h-screen bg-afreqa-shadow text-afreqa-chrome-high">{children}</div>;
  }

  let unreadCount = 0;
  try {
    unreadCount = await db.contactMessage.count({
      where: { isRead: false },
    });
  } catch {
    // If DB is offline
  }

  return (
    <div className="min-h-screen bg-afreqa-midnight text-afreqa-chrome-high flex">
      <AdminInactivityTimeout />
      <AdminSidebar user={user} initialUnreadCount={unreadCount} />
      <main className="flex-1 min-w-0 overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

