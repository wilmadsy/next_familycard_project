"use client"

import React, { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import EditKkModal from "@/components/buttonkk/EditKkModal"
import KKDetailCard from "../kk/KKDetailCard"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

export default function FamilyTable() {
  const [data, setData] = useState<any[]>([])
  const [anggotaPreview, setAnggotaPreview] = useState<any[]>([])
  const [modalEditKk, setModalEditKk] = useState(false)
  const [kk, setKk] = useState<any>(null)
  const [confirmDelete, setConfirmDelete] = useState<any>(null)
  const [hoveredKk, setHoveredKk] = useState<any | null>(null)


  const loadData = async () => {
    const res = await fetch("/api/familycards")
    const dt = await res.json()
    setData(dt)
  }

  useEffect(() => {
    loadData()
  }, [])

  // mapping data KK untuk preview
  const mapKkPreview = (item: any) => ({
    no_kk: item.fc_number,
    alamat: item.address,
    rt_rw: item.rt_rw,
    kelurahan: item.ward,
    kecamatan: item.districk,
    kota: item.regency,
    provinsi: item.region,
  })

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full relative">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 text-center">No. KK</th>
              <th className="py-3 text-center">Alamat</th>
              <th className="py-3 text-center">Kepala Keluarga</th>
              <th className="py-3 text-center">Kecamatan</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <HoverCard
                key={item.id}
                openDelay={200}
                onOpenChange={async (open) => {
                  if (open) {
                    const res = await fetch(
                      `/api/familycards/${item.id}/members`
                    )
                    const data = await res.json()
                    setAnggotaPreview(data)
                  }
                }}
              >
                <HoverCardTrigger asChild>
                  <tr className="border-b hover:bg-gray-100 cursor-pointer">
                    <td
                      className="py-3 text-center font-medium cursor-pointer"
                      onMouseEnter={() => setHoveredKk(item)}
                      onMouseLeave={() => setHoveredKk(null)}
                    >
                      {item.fc_number}
                    </td>
                    <td className="py-3 text-center">{item.address}</td>
                    <td className="py-3 text-center">{item.kepala_kk || "-"}</td>
                    <td className="py-3 text-center">{item.districk}</td>

                    {/* ACTION — SUDAH KENA HOVER -- lihat detail */}
                    <td className="py-3">
                      <div className="flex gap-4 justify-center" 
                            onMouseEnter={(e) => e.stopPropagation()}>
                        <a
                          href={`/kk/${item.id}`}
                          className="text-blue-600 hover:underline z-20 relative"
                        >
                          Lihat Detail →
                        </a>
                          {/* edit */}
                        <button
                          className="text-blue-600 hover:text-blue-800 z-20 relative"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const res = await fetch(`/api/familycards/${item.id}`);
                            const data = await res.json();
                            setKk(data.kk);
                            setModalEditKk(true);
                          }}
                        >
                          <Pencil size={18} />
                        </button>
                          {/* delete */}
                        <button
                          className="text-red-600 hover:text-red-800 z-20 relative"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(item);
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                </HoverCardTrigger>

                <HoverCardContent
                  side="top"
                  align="center"
                  className="
                    w-[420px]
                    bg-white
                    border
                    shadow-2xl
                    rounded-xl
                    p-4
                    z-50
                  "
                >
                  <KKDetailCard
                    kk={mapKkPreview(item)}
                    anggota={anggotaPreview}
                    variant="preview"
                  />
                </HoverCardContent>
              </HoverCard>
            ))}
          </tbody>
        </table>

        {/* EDIT MODAL */}
        {modalEditKk && kk && (
          <EditKkModal
            kkId={kk.id}
            open={modalEditKk}
            setOpen={setModalEditKk}
            kkData={kk}
            onUpdated={loadData}
          />
        )}

        {hoveredKk && (
          <div className="fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-[420px] bg-white border shadow-2xl rounded-xl">
              <KKDetailCard
                kk={mapKkPreview(hoveredKk)}
                anggota={anggotaPreview}
                variant="preview"
              />
            </div>
          </div>
        )}


        {/* DELETE MODAL */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow w-80">
              <h2 className="text-lg font-semibold mb-4">
                Hapus KK {confirmDelete.fc_number}?
              </h2>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-3 py-1 border rounded"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/familycards/${confirmDelete.id}`, {
                      method: "DELETE",
                    })
                    setConfirmDelete(null)
                    loadData()
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
