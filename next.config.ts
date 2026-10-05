import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "open-api.delcom.org",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  // Next.js hanya mengirim variabel ber-awalan NEXT_PUBLIC_ ke browser.
  // Blok ini menanam DELCOM_BASEURL (dari .env) ke kode saat build.
  env: {
    DELCOM_BASEURL: process.env.DELCOM_BASEURL || "",
  },
  // Proxy: browser memanggil /api/... di domain sendiri, lalu Next.js
  // meneruskannya ke Delcom dari sisi server (tidak lintas origin).
  // Hanya dipakai kalau NEXT_PUBLIC_DELCOM_BASEURL diatur ke "/api".
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://open-api.delcom.org/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;