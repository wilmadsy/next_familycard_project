"use client";

import { useState } from "react";

export default function AddKkModal({ open, setOpen }: any) {
  const [form, setForm] = useState({
    fc_number: "",
    address: "",
    rt_rw: "",
    ward: "",
    districk: "",
    regency: "",
    region: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/familycards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch (err) {
      console.error("Response bukan JSON");
    }

    if (res.ok) {
      alert("KK berhasil ditambahkan!");
      setOpen(false);
      window.location.reload();
    } else {
      alert(data?.message || "Gagal menambah KK");
    }
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Tambah Kartu Keluarga</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fc_number"
            className="border p-2 rounded w-full"
            placeholder="Nomor KK"
            onChange={handleChange}
            required
          />
          <input
            name="address"
            className="border p-2 rounded w-full"
            placeholder="Alamat"
            onChange={handleChange}
            required
          />
          <input
            name="rt_rw"
            className="border p-2 rounded w-full"
            placeholder="RT/RW"
            onChange={handleChange}
            required
          />
          <input
            name="ward"
            className="border p-2 rounded w-full"
            placeholder="Kelurahan"
            onChange={handleChange}
            required
          />
          <input
            name="districk"
            className="border p-2 rounded w-full"
            placeholder="Kecamatan"
            onChange={handleChange}
            required
          />
          <input
            name="regency"
            className="border p-2 rounded w-full"
            placeholder="Kabupaten"
            onChange={handleChange}
            required
          />
          <input
            name="region"
            className="border p-2 rounded w-full"
            placeholder="Provinsi"
            onChange={handleChange}
            required
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-1/2 bg-gray-300 text-black px-4 py-2 rounded"
            >
              Batal
            </button>

            <button className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
