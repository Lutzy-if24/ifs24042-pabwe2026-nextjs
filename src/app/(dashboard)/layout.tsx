"use client";

import TodoLayout from "@/features/todos/layouts/TodoLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TodoLayout>{children}</TodoLayout>;
}
