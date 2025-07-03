import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { cookies } from "next/headers";

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return null;

  return { id: admin.id, username: admin.username, name: admin.name };
}

export async function verifySession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);

    // Verify the admin still exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: "ADMIN",
    };
  } catch (error) {
    return null;
  }
}
