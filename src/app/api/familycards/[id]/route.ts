import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; // ← WAJIB pakai await

  try {
    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    // --- Ambil data KK ---
    const [kk]: any = await db.query(
      "SELECT * FROM familycards WHERE id = ? LIMIT 1",
      [id]
    );

    if (!kk || kk.length === 0) {
      return NextResponse.json(
        { message: "Data KK tidak ditemukan" },
        { status: 404 }
      );
    }

    // --- Ambil anggota keluarga ---
    const [members]: any = await db.query(
      "SELECT * FROM familycard_detail WHERE familycard_id = ?",
      [id]
    );

    return NextResponse.json({
      kk: kk[0],
      members: members,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

// =============================
// PUT → Edit Data KK
// =============================
export async function PUT(req: Request, context: any) {
  try {
    const { id: kkId } = await context.params;

    if (!kkId) {
      return NextResponse.json(
        { message: "ID KK tidak ditemukan" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      fc_number,
      address,
      rt_rw,
      ward,
      districk,
      regency,
      region,
    } = body;

    if (
      !fc_number ||
      !address ||
      !rt_rw ||
      !ward ||
      !districk ||
      !regency ||
      !region
    ) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      `
      UPDATE familycards SET
        fc_number = ?,
        address = ?,
        rt_rw = ?,
        ward = ?,
        districk = ?,
        regency = ?,
        region = ?
      WHERE id = ?
      `,
      [
        fc_number,
        address,
        rt_rw,
        ward,
        districk,
        regency,
        region,
        kkId,
      ]
    );

    return NextResponse.json({
      message: "Data KK berhasil diperbarui",
      affected_rows: result.affectedRows,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        sqlError: error?.sqlMessage,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    // Ambil parameter KK
    const { id: kkId } = await context.params;

    if (!kkId) {
      return NextResponse.json(
        { message: "ID KK tidak ditemukan" },
        { status: 400 }
      );
    }

    // 1. Hapus semua anggota dalam KK (biar aman FK)
    await db.query(
      `DELETE FROM familycard_detail WHERE familycard_id = ?`,
      [kkId]
    );

    // 2. Hapus KK
    const [result]: any = await db.query(
      `DELETE FROM familycards WHERE id = ?`,
      [kkId]
    );

    return NextResponse.json({
      message: "Kartu Keluarga berhasil dihapus",
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
