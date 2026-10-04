"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetUsers } from "@/features/users/states/action";
import { IconSearch, IconUser } from "@tabler/icons-react";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(asyncSetUsers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div data-testid="users-page">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Daftar Pengguna</h2>
      <p className="text-sm text-slate-500 mb-6">
        {filtered.length} pengguna ditemukan
      </p>

      <div className="relative mb-6">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengguna..."
          data-testid="users-search"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">Tidak ada pengguna</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((user) => (
            <div
              key={user.id}
              data-testid={`user-card-${user.id}`}
              className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3 shadow-sm"
            >
              {user.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <IconUser className="w-6 h-6 text-teal-700" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
