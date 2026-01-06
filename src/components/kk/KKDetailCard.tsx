import { cn } from "@/lib/utils"

type KK = {
  no_kk: string
  alamat: string
  rt_rw: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
}


type Anggota = {
  id: number
  nama: string
  status: string
}

type Props = {
  kk: KK
  anggota: Anggota[]
  variant?: "full" | "preview"
}

export default function KKDetailCard({
  kk,
  anggota,
  variant = "full",
}: Props) {
  const isPreview = variant === "preview"

  return (
    <div
      className={cn(
        "space-y-4",
        isPreview && "text-xs"
      )}
    >
      {/* ================= INFORMASI KK ================= */}
      <div className="border rounded-lg p-3">
        <h4 className="font-semibold mb-2">
          Informasi KK
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <p><b>No. KK:</b> {kk.no_kk}</p>
          <p><b>Alamat:</b> {kk.alamat}</p>
          <p><b>RT/RW:</b> {kk.rt_rw}</p>
          <p><b>Kelurahan:</b> {kk.kelurahan}</p>
          <p><b>Kecamatan:</b> {kk.kecamatan}</p>
          <p><b>Kota:</b> {kk.kota}</p>
          <p><b>Provinsi:</b> {kk.provinsi}</p>
        </div>
      </div>

      {/* ================= ANGGOTA KELUARGA ================= */}
      <div className="border rounded-lg p-3">
        <h4 className="font-semibold mb-2">
          Anggota Keluarga
        </h4>

        <div className="space-y-1">
          {anggota
            .slice(0, isPreview ? 3 : anggota.length)
            .map((a) => (
              <div
                key={a.id}
                className="flex justify-between border-b last:border-0 pb-1"
              >
                <span>{a.nama}</span>
                <span className="opacity-70">{a.status}</span>
              </div>
            ))}

          {isPreview && anggota.length > 3 && (
            <p className="text-muted-foreground text-[11px]">
              +{anggota.length - 3} anggota lainnya
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
