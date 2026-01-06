import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request, context: any) {
  try {
    // Ambil parameter
    const { id: kkId, memberid: memberId } = await context.params;

    if (!kkId || !memberId) {
      return NextResponse.json(
        { message: "Parameter tidak lengkap (kkId/memberId hilang)" },
        { status: 400 }
      );
    }

    const body = await req.json();

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

    // Update data berdasarkan id member + id KK
    const [result]: any = await db.query(
      `
      UPDATE familycard_detail SET
        full_name = ?,
        pin = ?,
        gender = ?,
        place_of_birth = ?,
        date_of_birth = ?,
        education = ?,
        employment = ?,
        status = ?
      WHERE id = ? AND familycard_id = ?
      `,
      [
        full_name || null,
        pin || null,
        gender || null,
        place_of_birth || null,
        date_of_birth || null,
        education || null,
        employment || null,
        status || null,
        memberId,
        kkId,
      ]
    );

    return NextResponse.json({
      message: "Anggota berhasil diperbarui",
      affected_rows: result.affectedRows,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        sqlError: error?.sqlMessage,
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    // Ambil parameter
    const { id: kkId, memberid: memberId } = await context.params;

    if (!kkId || !memberId) {
      return NextResponse.json(
        { message: "Parameter tidak lengkap (kkId/memberId hilang)" },
        { status: 400 }
      );
    }

    // Hapus berdasarkan id member + id KK
    const [result]: any = await db.query(
      `DELETE FROM familycard_detail WHERE id = ? AND familycard_id = ?`,
      [memberId, kkId]
    );

    return NextResponse.json({
      message: "Anggota berhasil dihapus",
      affected_rows: result.affectedRows,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        sqlError: error?.sqlMessage,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
