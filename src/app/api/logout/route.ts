// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: "Logout berhasil" 
  });

  // Hapus cookie dengan opsi lengkap
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Juga delete untuk memastikan
  response.cookies.delete("token");

  return response;
}