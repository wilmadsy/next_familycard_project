export const runtime = "nodejs";

import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX PARAMS (WAJIB)
  const { id: kkId } = await context.params;

  // 1️⃣ Ambil KK
  const [[kk]]: any = await db.query(
    "SELECT * FROM familycards WHERE id = ?",
    [kkId]
  );

  if (!kk) {
    return NextResponse.json(
      { message: "KK tidak ditemukan" },
      { status: 404 }
    );
  }

  // 2️⃣ Ambil anggota
  const [members]: any = await db.query(
    "SELECT * FROM familycard_detail WHERE familycard_id = ?",
    [kkId]
  );

  // 3️⃣ Buat workbook
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kartu Keluarga");

  // ===== INFO KK =====
  sheet.addRow(["KARTU KELUARGA"]);
  sheet.addRow([]);
  sheet.addRow(["No KK", kk.fc_number]);
  sheet.addRow(["Alamat", kk.address]);
  sheet.addRow(["RT / RW", kk.rt_rw]);
  sheet.addRow(["Kelurahan", kk.ward]);
  sheet.addRow(["Kecamatan", kk.districk]);
  sheet.addRow(["Kab / Kota", kk.regency]);
  sheet.addRow(["Provinsi", kk.region]);

  sheet.addRow([]);
  sheet.addRow(["DAFTAR ANGGOTA KELUARGA"]);

  // ===== HEADER ANGGOTA =====
  sheet.addRow([
    "No",
    "Nama",
    "NIK",
    "Gender",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Pendidikan",
    "Pekerjaan",
    "Status",
  ]);

  // Styling header
  const headerRow = sheet.lastRow!;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });

  // ===== DATA ANGGOTA =====
  members.forEach((m: any, i: number) => {
    sheet.addRow([
      i + 1,
      m.full_name,
      m.pin,
      m.gender,
      m.place_of_birth,
      m.date_of_birth,
      m.education,
      m.employment,
      m.status,
    ]);
  });

  // Auto width
  sheet.columns.forEach((col) => {
    col.width = 18;
  });

  // 4️⃣ Convert ke buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // 5️⃣ Return file Excel
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=KK-${kk.fc_number}.xlsx`,
    },
  });
}
