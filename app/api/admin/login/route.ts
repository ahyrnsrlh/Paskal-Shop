import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const admin = await verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set admin session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin-session", JSON.stringify(admin), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
