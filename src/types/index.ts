export type Todo = {
  id: number;
  title: string | null;
  description: string | null;
  is_finished: number;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  created_at?: string;
};

export type ApiResult<T = unknown> = {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
};

export type { RootState, AppDispatch } from "@/store";
