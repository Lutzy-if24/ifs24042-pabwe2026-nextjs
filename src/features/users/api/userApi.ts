import { fetchWithAuth } from "@/helpers/apiHelper";
import type { ApiResult, User } from "@/types";

export async function getUsersApi() {
  return (await fetchWithAuth("/users")) as ApiResult<{ users: User[] }>;
}

export async function getProfileApi() {
  return (await fetchWithAuth("/users/me")) as ApiResult<{ user: User }>;
}

export async function updateProfileApi(name: string, email: string) {
  return (await fetchWithAuth("/users/me", {
    method: "PUT",
    body: JSON.stringify({ name, email }),
  })) as ApiResult<{ user: User }>;
}

export async function changePhotoApi(file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  return (await fetchWithAuth("/users/me/photo", {
    method: "POST",
    body: formData,
    isFormData: true,
  })) as ApiResult;
}

export async function changePasswordApi(
  password: string,
  new_password: string,
  new_password_confirmation: string
) {
  return (await fetchWithAuth("/users/password", {
    method: "PUT",
    body: JSON.stringify({
      password,
      new_password,
      new_password_confirmation,
    }),
  })) as ApiResult;
}
