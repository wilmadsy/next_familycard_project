// app/api/familycards/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: any) {
  try {
    const id = params.id;
    const body = await req.json();

    const {
      no_kk,
      rt_rw,
      kecamatan,
      provinsi,
      alamat,
      kelurahan,
      kota,
    } = body;

    // Cek apakah KK ada
    const [data]: any = await db.query(
      "SELECT id FROM familycards WHERE id = ? LIMIT 1",
      [id]
    );

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "Data KK tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update
    await db.query(
      `UPDATE familycards 
       SET no_kk=?, rt_rw=?, kecamatan=?, provinsi=?, alamat=?, kelurahan=?, kota=? 
       WHERE id=?`,
      [no_kk, rt_rw, kecamatan, provinsi, alamat, kelurahan, kota, id]
    );

    return NextResponse.json(
      { message: "Data KK berhasil diperbarui" },
      { status: 200 }
    );
  } catch (err) {
    console.log("ERROR UPDATE KK:", err);
    return NextResponse.json(
      { message: "Gagal update KK", error: err },
      { status: 500 }
    );
  }
}
