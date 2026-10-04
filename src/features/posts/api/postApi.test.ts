import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPostsApi,
  getPostApi,
  addPostApi,
  updatePostApi,
  changeCoverApi,
  deletePostApi,
  likePostApi,
  addCommentApi,
  deleteCommentApi,
  deleteAllPostsApi,
} from "./postApi";

vi.mock("@/helpers/apiHelper", () => ({
  fetchWithAuth: vi.fn().mockResolvedValue({ status: "success" }),
}));

import { fetchWithAuth } from "@/helpers/apiHelper";

describe("postApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPostsApi without isMe", async () => {
    await getPostsApi();
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts", {
      params: undefined,
    });
  });

  it("getPostsApi with isMe", async () => {
    await getPostsApi(true);
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts", {
      params: { is_me: 1 },
    });
  });

  it("getPostApi", async () => {
    await getPostApi(1);
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts/1");
  });

  it("addPostApi", async () => {
    await addPostApi("desc");
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/posts",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("updatePostApi", async () => {
    await updatePostApi(1, "new");
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/posts/1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("changeCoverApi", async () => {
    const file = new File(["x"], "cover.jpg", { type: "image/jpeg" });
    await changeCoverApi(1, file);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/posts/1/cover",
      expect.objectContaining({ method: "POST", isFormData: true })
    );
  });

  it("deletePostApi", async () => {
    await deletePostApi(1);
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts/1", {
      method: "DELETE",
    });
  });

  it("likePostApi", async () => {
    await likePostApi(1, 1);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/posts/1/likes",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("addCommentApi", async () => {
    await addCommentApi(1, "nice");
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/posts/1/comments",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("deleteCommentApi", async () => {
    await deleteCommentApi(1);
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts/1/comments", {
      method: "DELETE",
    });
  });

  it("deleteAllPostsApi", async () => {
    await deleteAllPostsApi();
    expect(fetchWithAuth).toHaveBeenCalledWith("/posts", { method: "DELETE" });
  });
});
