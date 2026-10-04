import { fetchWithAuth } from "@/helpers/apiHelper";
import type { ApiResult, Post } from "@/types";

export async function getPostsApi(isMe?: boolean) {
  return (await fetchWithAuth("/posts", {
    params: isMe ? { is_me: 1 } : undefined,
  })) as ApiResult<{ posts: Post[] }>;
}

export async function getPostApi(id: number | string) {
  return (await fetchWithAuth(`/posts/${id}`)) as ApiResult<{ post: Post }>;
}

export async function addPostApi(description: string) {
  return (await fetchWithAuth("/posts", {
    method: "POST",
    body: JSON.stringify({ description }),
  })) as ApiResult<{ post_id: number }>;
}

export async function updatePostApi(id: number | string, description: string) {
  return (await fetchWithAuth(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ description }),
  })) as ApiResult;
}

export async function changeCoverApi(id: number | string, file: File) {
  const formData = new FormData();
  formData.append("cover", file);
  return (await fetchWithAuth(`/posts/${id}/cover`, {
    method: "POST",
    body: formData,
    isFormData: true,
  })) as ApiResult;
}

export async function deletePostApi(id: number | string) {
  return (await fetchWithAuth(`/posts/${id}`, {
    method: "DELETE",
  })) as ApiResult;
}

export async function likePostApi(id: number | string, like: 0 | 1) {
  return (await fetchWithAuth(`/posts/${id}/likes`, {
    method: "POST",
    body: JSON.stringify({ like }),
  })) as ApiResult;
}

export async function addCommentApi(id: number | string, comment: string) {
  return (await fetchWithAuth(`/posts/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  })) as ApiResult;
}

export async function deleteCommentApi(id: number | string) {
  return (await fetchWithAuth(`/posts/${id}/comments`, {
    method: "DELETE",
  })) as ApiResult;
}

export async function deleteAllPostsApi() {
  return (await fetchWithAuth("/posts", {
    method: "DELETE",
  })) as ApiResult;
}
