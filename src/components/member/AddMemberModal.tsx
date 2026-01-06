"use client";

import { useState } from "react";
import Modal from "@/app/Modal";

export default function AddMemberModal({ kkId, open, setOpen, onAdded }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    pin: "",
    gender: "",
    place_of_birth: "",
    date_of_birth: "",
    education: "",
    employment: "",
    status: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.full_name) {
      alert("Nama wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/familycards/${kkId}/members`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menambah anggota");
        setLoading(false);
        return;
      }

      alert("Anggota berhasil ditambahkan!");

      setOpen(false);
      onAdded && onAdded();

    } catch (error) {
      console.error(error);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <h2 className="text-xl font-semibold mb-4">Tambah Anggota Keluarga</h2>

      <div className="space-y-3">

        <div>
          <label className="block mb-1">Nama Lengkap *</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Contoh: Budi Setiawan"
          />
        </div>

        <div>
          <label className="block mb-1">NIK</label>
          <input
            type="text"
            name="pin"
            value={form.pin}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Nomor Induk Kependudukan"
          />
        </div>

        <div>
          <label className="block mb-1">Jenis Kelamin</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Tempat Lahir</label>
          <input
            type="text"
            name="place_of_birth"
            value={form.place_of_birth}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Tanggal Lahir</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Pendidikan</label>
          <input
            type="text"
            name="education"
            value={form.education}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Pekerjaan</label>
          <input
            type="text"
            name="employment"
            value={form.employment}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1">Status di Keluarga</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Pilih</option>
            <option value="Ayah">Ayah</option>
            <option value="Ibu">Ibu</option>
            <option value="Anak">Anak</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          onClick={() => setOpen(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg"
        >
          Batal
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Tambah"}
        </button>
      </div>
    </Modal>
  );
}
