"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { loading, user } = useAuth();

  // ⏳ NUNGGU SESSION
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">
          Checking session...
        </div>
      </div>
    );
  }

  // 🔒 OPTIONAL: kalau belum login
  if (!user) {
    return null; // atau redirect ke /signin kalau mau
  }

  // ✅ BARU RENDER DASHBOARD
  return <>{children}</>;
}
