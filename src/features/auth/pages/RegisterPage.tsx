"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetAuthRegister } from "@/features/auth/states/action";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";

export default function RegisterPage() {
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthRegister } = useAppSelector((state) => state.auth);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    const success = await dispatch(
      asyncSetAuthRegister(name, email, password)
    );
    if (success) {
      router.replace("/auth/login");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Daftar</h2>
      <p className="text-slate-500 text-sm mb-6">
        Buat akun baru untuk mulai berbagi
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama
          </label>
          <div className="relative">
            <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={onNameChange}
              placeholder="Nama lengkap"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              data-testid="register-name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="email@contoh.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              data-testid="register-email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              minLength={6}
              data-testid="register-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAuthRegister}
          data-testid="register-submit"
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {isAuthRegister ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}
