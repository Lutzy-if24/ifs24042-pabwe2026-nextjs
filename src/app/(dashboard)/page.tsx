import { Suspense } from "react";
import HomePage from "@/features/posts/pages/HomePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-slate-600">Memuat...</div>}>
      <HomePage />
    </Suspense>
  );
}
