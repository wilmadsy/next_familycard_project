import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
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

    const [result]: any = await db.query(
      `
      INSERT INTO familycards
      (fc_number, address, rt_rw, ward, districk, regency, region)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [fc_number, address, rt_rw, ward, districk, regency, region]
    );

    return NextResponse.json({
      message: "KK berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error: any) {
    console.error("POST KK ERROR:", error);

    return NextResponse.json(
      {
        message: "Server Error",
        sqlError: error?.sqlMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        fc.id,
        fc.fc_number,
        fc.address,
        fc.rt_rw,
        fc.ward,
        fc.districk,
        fc.regency,
        fc.region,
        (
          SELECT full_name 
          FROM familycard_detail 
          WHERE familycard_id = fc.id AND status = 'Ayah'
          LIMIT 1
        ) AS kepala_kk
      FROM familycards fc
      ORDER BY fc.id DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



