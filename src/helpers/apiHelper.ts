import { DELCOM_BASEURL } from "@/lib/config";

const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

type FetchOptions = {
  method?: string;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  isFormData?: boolean;
  params?: Record<string, string | number | undefined | null>;
};

export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
) {
  const {
    method = "GET",
    body = null,
    headers = {},
    isFormData = false,
    params,
  } = options;

  let url = `${DELCOM_BASEURL}${endpoint}`;

  if (params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        search.append(key, String(value));
      }
    });
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const token = getAccessToken();
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  if (!isFormData && body && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
  });

  const data = await response.json().catch(() => ({
    status: "fail",
    message: "Gagal memproses respons server",
  }));

  return data;
}
