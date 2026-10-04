"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-teal-700 to-cyan-800 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Delcom Posts</h1>
        <p className="text-teal-100 text-lg leading-relaxed">
          Bagikan pemikiran, cerita, dan momen Anda. Terhubung dengan komunitas
          melalui postingan yang bermakna.
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}