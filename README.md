# ifs24042-pabwe2026-nextjs

Aplikasi **Postingan** (Delcom Posts) — studi kasus 2.2 NextJS TypeScript.

Stack: Next.js 16 (App Router) · Redux Toolkit · Tailwind CSS v4 · Bun · Vitest · SweetAlert2 · Tabler Icons

## Fitur

- Auth: Login, Register, Logout + route guarding
- Posts: daftar (semua / milik saya), detail, tambah, ubah, cover, hapus, like, komentar, hapus semua
- Users: daftar pengguna + pencarian
- Profile: ubah nama/email, foto, kata sandi

## Instalasi

```bash
bun install
```

## Development

```bash
bun run dev
```

Buka http://localhost:3000

## Testing (coverage target 100%)

```bash
bun run test:coverage
```

## Environment

File `.env`:

```
NEXT_PUBLIC_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=3000
```

## Struktur utama

```
src/
├── app/                  # Next.js App Router
│   ├── (dashboard)/      # Rute terproteksi
│   └── auth/             # Login & Register
├── features/
│   ├── auth/
│   ├── posts/
│   └── users/
├── helpers/
├── hooks/
├── lib/
└── types/
```

API: https://open-api.delcom.org/docs/1.0/api-posts
