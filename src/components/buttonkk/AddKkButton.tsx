"use client";

import { useState } from "react";
import AddKkModal from "./AddKkModal";

export default function AddKkButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Tambah KK
      </button>

      {open && <AddKkModal open={open} setOpen={setOpen} />}
    </>
  );
}
