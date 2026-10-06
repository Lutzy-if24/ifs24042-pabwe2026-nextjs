"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  IconHome,
  IconUser,
  IconUsers,
  IconNews,
  IconX,
} from "@tabler/icons-react";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const menuItems = [
  { href: "/", label: "Semua Postingan", icon: IconHome },
  { href: "/?is_me=1", label: "Postingan Saya", icon: IconNews },
  { href: "/users", label: "Daftar Pengguna", icon: IconUsers },
  { href: "/profile", label: "Profil Saya", icon: IconUser },
];

export default function SidebarComponent({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMe = searchParams.get("is_me") === "1";

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/" && !isMe;
    }
    if (href === "/?is_me=1") {
      return pathname === "/" && isMe;
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Tutup overlay"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden cursor-default"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      <aside
        data-testid="sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-100">
          <span className="font-bold text-teal-700">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100"
            aria-label="Tutup menu"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Menu utama">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                data-testid={`sidebar-link-${item.label}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}