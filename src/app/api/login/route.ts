import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (!rows.length) {
    return NextResponse.json({ message: "Email salah" }, { status: 401 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return NextResponse.json({ message: "Password salah" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const res = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return res; // ⬅️ PENTING: JANGAN redirect
}
