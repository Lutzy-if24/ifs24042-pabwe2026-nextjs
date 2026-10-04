"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetAuthLogout } from "@/features/auth/states/action";
import { removeAccessToken } from "@/helpers/apiHelper";
import {
  IconLogout,
  IconMenu2,
  IconUser,
} from "@tabler/icons-react";

type NavbarProps = {
  onToggleSidebar?: () => void;
};

export default function NavbarComponent({ onToggleSidebar }: NavbarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.users.profile);

  async function handleLogout() {
    await dispatch(asyncSetAuthLogout());
    removeAccessToken();
    router.replace("/auth/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Toggle menu"
          data-testid="navbar-toggle"
        >
          <IconMenu2 className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-teal-700">Delcom Posts</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
          {profile?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
              <IconUser className="w-4 h-4 text-teal-700" />
            </div>
          )}
          <span className="font-medium" data-testid="navbar-username">
            {profile?.name || "Pengguna"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          data-testid="navbar-logout"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <IconLogout className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
