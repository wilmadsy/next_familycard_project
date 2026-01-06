"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ===============================
  // INIT SESSION (FIRST LOAD ONLY)
  // ===============================
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  // ===============================
  // LOGIN
  // ===============================
  const login = async (email: string, password: string) => {
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      setLoading(false);
      throw new Error("Login gagal");
    }

    // 🔥 ambil session SEKALI
    const sessionRes = await fetch("/api/auth/session", {
      credentials: "include",
    });

    if (sessionRes.ok) {
      const data = await sessionRes.json();
      setUser(data.user);
    }

    setLoading(false);

    // 🚀 pindah SETELAH user siap
    router.replace("/");
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = async () => {
    setLoading(true);

    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setLoading(false);

    router.replace("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
