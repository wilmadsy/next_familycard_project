"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddMemberModal from "@/components/member/AddMemberModal";
import EditMemberModal from "@/components/member/EditMemberModal";
import EditKkModal from "@/components/buttonkk/EditKkModal";

// Icons
import { Pencil, Trash2 } from "lucide-react";

export default function DetailKKPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalEditKk, setModalEditKk] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [confirmEdit, setConfirmEdit] = useState<any>(null);

  const [kk, setKk] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

  const fetchData = async () => {
        try {
          const res = await fetch(`/api/familycards/${id}`);
          const data = await res.json();

          setKk(data.kk);
          setMembers(data.members);
        } catch (err) {
          console.error("Error Fetching KK:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [id]);

    const refresh = () => window.location.reload();

    if (loading) return <p className="p-6">Loading...</p>;
    if (!kk) return <p className="p-6">Data tidak ditemukan</p>;

  const handleImportExcel = async (file: File) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    const allowedExt = [".xlsx", ".xls"];

    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExt.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      alert("❌ File harus Excel (.xlsx / .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setImportLoading(true);

    try {
      const res = await fetch(`/api/familycards/${id}/import`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Import gagal");
      }

      alert("✅ Import Excel berhasil");
      refresh();
    } catch (err: any) {
      alert("❌ " + err.message);
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Detail Kartu Keluarga</h1>

        <div className="flex gap-3">
          
          <button
            onClick={() => setModalAdd(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Tambah Anggota
          </button>

          <button
            onClick={() => router.push(`/api/familycards/${id}/pdf`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Download PDF
          </button>

          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = `/api/familycards/${id}/export`;
              link.download = "";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Export Excel
          </button>

          <button
            onClick={() => document.getElementById("importExcel")?.click()}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={importLoading} // Disable button selama loading
          >
            {importLoading ? "Importing..." : "Import Excel"}
          </button>

          <input type="file" accept=".xlsx" hidden
            id="importExcel"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImportExcel(file);
              }
            }}
          />

          <button
            onClick={() => setModalEditKk(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit KK
          </button>

          <button
            onClick={() => router.push(`/familycards`)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* MODAL ADD */}
      {id && (
        <AddMemberModal
          kkId={id}
          open={modalAdd}
          setOpen={setModalAdd}
          onAdded={refresh}
        />
      )}

      {/* MODAL EDIT */}
      {selectedMember && (
        <EditMemberModal
          kkId={id!}
          open={modalEdit}
          setOpen={setModalEdit}
          member={selectedMember}
          onUpdated={refresh}
        />
      )}

      {/* MODAL EDIT KK */}
      <EditKkModal
        kkId={id!}
        open={modalEditKk}
        setOpen={setModalEditKk}
        kkData={kk}
        onUpdated={refresh}
      />



      {/* Informasi KK */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-3">Informasi KK</h2>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>No. KK:</strong> {kk.fc_number}</p>
          <p><strong>Alamat:</strong> {kk.address}</p>
          <p><strong>RT/RW:</strong> {kk.rt_rw}</p>
          <p><strong>Kelurahan:</strong> {kk.ward}</p>
          <p><strong>Kecamatan:</strong> {kk.districk}</p>
          <p><strong>Kota:</strong> {kk.regency}</p>
          <p><strong>Provinsi:</strong> {kk.region}</p>
        </div>
      </div>

      {/* Anggota */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-3">Anggota Keluarga</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">NIK</th>
              <th className="p-3 border">Gender</th>
              <th className="p-3 border">Tempat Lahir</th>
              <th className="p-3 border">Tanggal Lahir</th>
              <th className="p-3 border">Pendidikan</th>
              <th className="p-3 border">Pekerjaan</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-gray-100 transition">
                <td className="p-3 border">{m.full_name}</td>
                <td className="p-3 border">{m.pin}</td>
                <td className="p-3 border">{m.gender}</td>
                <td className="p-3 border">{m.place_of_birth}</td>
                <td className="p-3 border">{m.date_of_birth}</td>
                <td className="p-3 border">{m.education}</td>
                <td className="p-3 border">{m.employment}</td>
                <td className="p-3 border">{m.status}</td>

                {/* ACTION */}
                <td className="p-3 border">
                  <div className="flex justify-center gap-4">

                    {/* EDIT BUTTON */}
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setConfirmEdit(m)}
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => setConfirmDelete(m)}
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-80">
            <h2 className="text-lg font-semibold mb-4">
              Hapus {confirmDelete.full_name}?
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Yakin ingin menghapus data ini?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>

              <button
                onClick={async () => {
                  await fetch(`/api/familycards/${id}/members/${confirmDelete.id}`, {
                    method: "DELETE",
                  });
                  setConfirmDelete(null);
                  refresh();
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Hapus
              </button>

            </div>
          </div>
        </div>
      )}

      {/* CONFIRM EDIT */}
      {confirmEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow w-80">
            <h2 className="text-lg font-semibold mb-4">
              Edit {confirmEdit.full_name}?
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Yakin ingin mengedit data ini?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmEdit(null)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  setSelectedMember(confirmEdit);
                  setModalEdit(true);
                  setConfirmEdit(null);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
