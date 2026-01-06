"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateKKPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fc_number: "",
    address: "",
    rt_rw: "",
    ward: "",
    districk: "",
    regency: "",
    region: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/familycards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal menyimpan");
        return;
      }

      alert("Berhasil membuat Kartu Keluarga!");
      router.push("/familycards");

    } catch (error) {
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Tambah Kartu Keluarga</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-5"
      >
        {/* ROW 1 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="fc_number"
            className="p-3 border rounded"
            placeholder="Nomor KK"
            onChange={handleChange}
            required
          />
          <input
            name="address"
            className="p-3 border rounded"
            placeholder="Alamat Lengkap"
            onChange={handleChange}
            required
          />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="rt_rw"
            className="p-3 border rounded"
            placeholder="RT / RW"
            onChange={handleChange}
            required
          />
          <input
            name="ward"
            className="p-3 border rounded"
            placeholder="Kelurahan / Desa"
            onChange={handleChange}
            required
          />
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="districk"
            className="p-3 border rounded"
            placeholder="Kecamatan"
            onChange={handleChange}
            required
          />
          <input
            name="regency"
            className="p-3 border rounded"
            placeholder="Kabupaten / Kota"
            onChange={handleChange}
            required
          />
        </div>

        {/* ROW 4 */}
        <div>
          <input
            name="region"
            className="p-3 border rounded w-full"
            placeholder="Provinsi"
            onChange={handleChange}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Kembali
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Menyimpan..." : "Simpan KK"}
          </button>
        </div>
      </form>
    </div>
  );
}
