import { fetchWithAuth, putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import type { ApiResult, LoginData } from "@/types";

export async function loginApi(email: string, password: string) {
  const result = (await fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })) as ApiResult<LoginData>;

  if (result.status === "success" && result.data?.token) {
    putAccessToken(result.data.token);
  }

  return result;
}

export async function registerApi(
  name: string,
  email: string,
  password: string
) {
  return (await fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })) as ApiResult;
}

export async function logoutApi() {
  const result = (await fetchWithAuth("/auth/logout", {
    method: "POST",
  })) as ApiResult;
  removeAccessToken();
  return result;
}
