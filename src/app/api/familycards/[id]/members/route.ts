import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, context: any) {
  try {
    const { id: kkId } = await context.params

    if (!kkId) {
      return NextResponse.json([], { status: 200 })
    }

    const [rows]: any = await db.query(
      `SELECT 
        id,
        full_name AS nama,
        status
       FROM familycard_detail
       WHERE familycard_id = ?`,
      [kkId]
    )

    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal ambil anggota", error: String(error) },
      { status: 500 }
    )
  }
}


export async function POST(req: Request, context: any) {
  try {
    // ⬇⬇ FIX PENTING — WAJIB await!
    const { id: kkId } = await context.params;

    if (!kkId) {
      return NextResponse.json(
        { message: "familycard_id tidak ditemukan" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("DATA MASUK KE API:", body);

    const {
      full_name,
      pin,
      gender,
      place_of_birth,
      date_of_birth,
      education,
      employment,
      status,
    } = body;

    if (!full_name) {
      return NextResponse.json(
        { message: "Nama anggota wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `INSERT INTO familycard_detail 
       (familycard_id, full_name, pin, gender, place_of_birth, date_of_birth, education, employment, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kkId,
        full_name,
        pin || null,
        gender || null,
        place_of_birth || null,
        date_of_birth || null,
        education || null,
        employment || null,
        status || null,
      ]
    );

    return NextResponse.json({
      message: "Anggota berhasil ditambahkan",
      inserted_id: result.insertId,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

