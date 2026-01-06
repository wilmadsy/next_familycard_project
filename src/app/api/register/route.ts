import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // cek email
    const [check]: any = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (check.length > 0) {
      return NextResponse.json(
        { message: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, 'user', NOW())",
      [name, email, hashed]
    );

    return NextResponse.json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
