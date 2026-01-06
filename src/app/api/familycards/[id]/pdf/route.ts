export const runtime = "nodejs";

import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ FIX PARAMS
  const { id: kkId } = await context.params;

  // 1️⃣ Ambil data KK
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

  // 3️⃣ HTML KK (rapih + ringan)
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    padding: 20px;
  }
  h1 {
    text-align: center;
    margin-bottom: 16px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  th, td {
    border: 1px solid #000;
    padding: 6px;
    text-align: center;
  }
  .info td {
    border: none;
    text-align: left;
    padding: 2px 0;
  }
</style>
</head>
<body>

<h1>KARTU KELUARGA</h1>

<table class="info">
  <tr><td>No KK</td><td>: ${kk.fc_number}</td></tr>
  <tr><td>Alamat</td><td>: ${kk.address}</td></tr>
  <tr><td>RT / RW</td><td>: ${kk.rt_rw}</td></tr>
  <tr><td>Kelurahan</td><td>: ${kk.ward}</td></tr>
  <tr><td>Kecamatan</td><td>: ${kk.districk}</td></tr>
  <tr><td>Kab/Kota</td><td>: ${kk.regency}</td></tr>
  <tr><td>Provinsi</td><td>: ${kk.region}</td></tr>
</table>

<h3>DAFTAR ANGGOTA KELUARGA</h3>

<table>
  <thead>
    <tr>
      <th>No</th>
      <th>Nama</th>
      <th>NIK</th>
      <th>JK</th>
      <th>Tempat Lahir</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    ${members
      .map(
        (m: any, i: number) => `
      <tr>
        <td>${i + 1}</td>
        <td>${m.full_name}</td>
        <td>${m.pin}</td>
        <td>${m.gender}</td>
        <td>${m.place_of_birth}</td>
        <td>${m.status}</td>
      </tr>`
      )
      .join("")}
  </tbody>
</table>

</body>
</html>
`;

  // 4️⃣ Puppeteer (SUPER CEPAT MODE)
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  // 5️⃣ Return PDF
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=KK-${kk.fc_number}.pdf`,
    },
  });
}
