export const runtime = "nodejs";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";
import { Buffer } from "buffer";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: kkId } = await context.params;

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "File Excel tidak ditemukan" },
        { status: 400 }
      );
    }

    // File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // ambil sheet pertama
    const sheet = workbook.worksheets[0];
    if (!sheet) {
      return NextResponse.json(
        { message: "Sheet Excel tidak ditemukan" },
        { status: 400 }
      );
    }

    let inserted = 0;

    for (let i = 2; i <= sheet.rowCount; i++) {
      const row = sheet.getRow(i);

      const full_name = row.getCell(1).text;
      const pin = row.getCell(2).text;

      if (!full_name || !pin) continue;

      await db.query(
        `INSERT INTO familycard_detail
        (familycard_id, full_name, pin, gender, place_of_birth, date_of_birth,
         education, employment, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          kkId,
          full_name,
          pin,
          row.getCell(3).text,
          row.getCell(4).text,
          row.getCell(5).text,
          row.getCell(6).text,
          row.getCell(7).text,
          row.getCell(8).text,
        ]
      );

      inserted++;
    }

    return NextResponse.json({
      message: "Import anggota berhasil",
      total: inserted,
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Gagal import Excel", error: String(err) },
      { status: 500 }
    );
  }
}
