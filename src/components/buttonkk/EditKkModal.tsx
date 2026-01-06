"use client";

import { useEffect, useState } from "react";

type Props = {
  kkId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  kkData: any;
  onUpdated: () => void;
};

export default function EditKkModal({
  kkId,
  open,
  setOpen,
  kkData,
  onUpdated,
}: Props) {
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

  useEffect(() => {
    if (kkData) {
      setForm({
        fc_number: kkData.fc_number ?? "",
        address: kkData.address ?? "",
        rt_rw: kkData.rt_rw ?? "",
        ward: kkData.ward ?? "",
        districk: kkData.districk ?? "",
        regency: kkData.regency ?? "",
        region: kkData.region ?? "",
      });
    }
  }, [kkData]);

  if (!open) return null;

  const submit = async () => {
    setLoading(true);

    console.log("FORM DIKIRIM:", form);

    const res = await fetch(`/api/familycards/${kkId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("PUT KK RESULT:", data);

    setLoading(false);
    alert(data.message);

    if (res.ok) {
      setOpen(false);
      onUpdated();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] space-y-4">
        <h2 className="text-lg font-semibold">Edit Kartu Keluarga</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={(form as any)[key]}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        ))}

        <div className="flex justify-end gap-3 pt-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Batal
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
