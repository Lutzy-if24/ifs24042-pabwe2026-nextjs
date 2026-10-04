"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/helpers/apiHelper";
import { useAppDispatch } from "@/hooks/redux";
import { asyncSetProfile } from "@/features/users/states/action";
import NavbarComponent from "@/features/posts/components/NavbarComponent";
import SidebarComponent from "@/features/posts/components/SidebarComponent";

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }
    dispatch(asyncSetProfile()).finally(() => setReady(true));
  }, [dispatch, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500" data-testid="layout-loading">
          Memuat...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" data-testid="post-layout">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <SidebarComponent
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
