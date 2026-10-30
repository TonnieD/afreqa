import { getSessionUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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

  return (
    <div className="min-h-screen bg-afreqa-midnight text-afreqa-chrome-high flex">
      <AdminSidebar user={user} />
      <main className="flex-1 min-w-0 overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

