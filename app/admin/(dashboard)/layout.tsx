import type React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNavbar } from "../components/admin-navbar";

async function getAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNavbar admin={admin} />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </>
  );
}
