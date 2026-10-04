"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetAuthLogin } from "@/features/auth/states/action";
import { IconLock, IconMail } from "@tabler/icons-react";

export default function LoginPage() {
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthLogin } = useAppSelector((state) => state.auth);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    const success = await dispatch(asyncSetAuthLogin(email, password));
    if (success) {
      router.replace("/");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Masuk</h2>
      <p className="text-slate-500 text-sm mb-6">
        Selamat datang kembali di Delcom Posts
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder="email@contoh.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              data-testid="login-email"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password-input"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Kata Sandi
          </label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={onPasswordChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              data-testid="login-password"
            />
          </div>
        </div>

        <button
          id="login-submit-button"
          type="submit"
          disabled={isAuthLogin}
          data-testid="login-submit"
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {isAuthLogin ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link
          href="/auth/register"
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}