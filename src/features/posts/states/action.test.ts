import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setPostsActionCreator,
  setPostActionCreator,
  setIsPostActionCreator,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedCoverActionCreator,
  setIsPostDeleteActionCreator,
  setIsPostDeletedActionCreator,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostDeleteAllActionCreator,
  setIsPostDeletedAllActionCreator,
  asyncSetPosts,
  asyncSetPost,
  asyncAddPost,
  asyncChangePost,
  asyncChangePostCover,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeleteAllPosts,
} from "./action";
import { ActionType } from "@/types/action";

vi.mock("../api/postApi", () => ({
  getPostsApi: vi.fn(),
  getPostApi: vi.fn(),
  addPostApi: vi.fn(),
  updatePostApi: vi.fn(),
  changeCoverApi: vi.fn(),
  deletePostApi: vi.fn(),
  likePostApi: vi.fn(),
  addCommentApi: vi.fn(),
  deleteCommentApi: vi.fn(),
  deleteAllPostsApi: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
  showConfirmDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
}));

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
} from "../api/postApi";
import {
  showConfirmDialog,
  showSuccessDialog,
  showErrorDialog,
} from "@/helpers/toolsHelper";

describe("posts actions", () => {
  const dispatch = vi.fn((action) => {
    if (typeof action === "function") return action(dispatch);
    return action;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: true,
    });
  });

  it("action creators", () => {
    expect(setPostsActionCreator([]).type).toBe(ActionType.SET_POSTS);
    expect(setPostActionCreator(null).type).toBe(ActionType.SET_POST);
    expect(setIsPostActionCreator(true).type).toBe(ActionType.SET_IS_POST);
    expect(setIsPostAddActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_ADD
    );
    expect(setIsPostAddedActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_ADDED
    );
    expect(setIsPostChangeActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_CHANGE
    );
    expect(setIsPostChangedActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_CHANGED
    );
    expect(setIsPostChangeCoverActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_CHANGE_COVER
    );
    expect(setIsPostChangedCoverActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_CHANGED_COVER
    );
    expect(setIsPostDeleteActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETE
    );
    expect(setIsPostDeletedActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETED
    );
    expect(setIsPostLikeActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_LIKE
    );
    expect(setIsPostLikedActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_LIKED
    );
    expect(setIsPostAddCommentActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_ADD_COMMENT
    );
    expect(setIsPostAddedCommentActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_ADDED_COMMENT
    );
    expect(setIsPostDeleteCommentActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETE_COMMENT
    );
    expect(setIsPostDeletedCommentActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETED_COMMENT
    );
    expect(setIsPostDeleteAllActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETE_ALL
    );
    expect(setIsPostDeletedAllActionCreator(true).type).toBe(
      ActionType.SET_IS_POST_DELETED_ALL
    );
  });

  it("asyncSetPosts success fail throw", async () => {
    (getPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { posts: [{ id: 1, user_id: 1, description: "x" }] },
    });
    await asyncSetPosts()(dispatch);
    await asyncSetPosts(true)(dispatch);

    (getPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    await asyncSetPosts()(dispatch);

    (getPostsApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("err")
    );
    await asyncSetPosts()(dispatch);
  });

  it("asyncSetPost success fail throw", async () => {
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    await asyncSetPost(1)(dispatch);

    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    await asyncSetPost(1)(dispatch);

    (getPostApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("err")
    );
    await asyncSetPost(1)(dispatch);
  });

  it("asyncAddPost success with post_id, without post_id, fail, Error, non-Error", async () => {
    (addPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
      data: { post_id: 5 },
    });
    expect(await asyncAddPost("hi")(dispatch)).toBe(5);
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");

    (addPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncAddPost("hi")(dispatch)).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith(
      "Berhasil menambah postingan"
    );

    (addPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "bad",
    });
    expect(await asyncAddPost("hi")(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("bad");

    (addPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncAddPost("hi")(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal menambah postingan");

    (addPostApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("net")
    );
    expect(await asyncAddPost("hi")(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("net");

    (addPostApi as ReturnType<typeof vi.fn>).mockRejectedValue("x");
    expect(await asyncAddPost("hi")(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan");
  });

  it("asyncChangePost success fail Error non-Error", async () => {
    (updatePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "updated",
    });
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(true);

    (updatePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(true);

    (updatePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(false);

    (updatePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(false);

    (updatePostApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(false);

    (updatePostApi as ReturnType<typeof vi.fn>).mockRejectedValue(1);
    expect(await asyncChangePost(1, "x")(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan");
  });

  it("asyncChangePostCover success fail Error non-Error", async () => {
    const file = new File(["x"], "c.jpg");
    (changeCoverApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(true);

    (changeCoverApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(true);

    (changeCoverApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(false);

    (changeCoverApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(false);

    (changeCoverApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(false);

    (changeCoverApi as ReturnType<typeof vi.fn>).mockRejectedValue(null);
    expect(await asyncChangePostCover(1, file)(dispatch)).toBe(false);
  });

  it("asyncDeletePost cancel confirm success fail Error non-Error", async () => {
    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: false,
    });
    expect(await asyncDeletePost(1)(dispatch)).toBe(false);

    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: true,
    });
    (deletePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    expect(await asyncDeletePost(1)(dispatch)).toBe(true);

    (deletePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncDeletePost(1)(dispatch)).toBe(true);

    (deletePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncDeletePost(1)(dispatch)).toBe(false);

    (deletePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncDeletePost(1)(dispatch)).toBe(false);

    (deletePostApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncDeletePost(1)(dispatch)).toBe(false);

    (deletePostApi as ReturnType<typeof vi.fn>).mockRejectedValue({});
    expect(await asyncDeletePost(1)(dispatch)).toBe(false);
  });

  it("asyncLikePost success fail Error non-Error", async () => {
    (likePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    expect(await asyncLikePost(1, 1)(dispatch)).toBe(true);
    expect(await asyncLikePost(1, 0)(dispatch)).toBe(true);

    (likePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncLikePost(1, 1)(dispatch)).toBe(false);

    (likePostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncLikePost(1, 1)(dispatch)).toBe(false);

    (likePostApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncLikePost(1, 1)(dispatch)).toBe(false);

    (likePostApi as ReturnType<typeof vi.fn>).mockRejectedValue("x");
    expect(await asyncLikePost(1, 1)(dispatch)).toBe(false);
  });

  it("asyncAddComment success fail Error non-Error", async () => {
    (addCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(true);

    (addCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(true);

    (addCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(false);

    (addCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(false);

    (addCommentApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(false);

    (addCommentApi as ReturnType<typeof vi.fn>).mockRejectedValue(0);
    expect(await asyncAddComment(1, "c")(dispatch)).toBe(false);
  });

  it("asyncDeleteComment cancel confirm success fail Error non-Error", async () => {
    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: false,
    });
    expect(await asyncDeleteComment(1)(dispatch)).toBe(false);

    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: true,
    });
    (deleteCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    (getPostApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { post: { id: 1, user_id: 1, description: "x" } },
    });
    expect(await asyncDeleteComment(1)(dispatch)).toBe(true);

    (deleteCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncDeleteComment(1)(dispatch)).toBe(true);

    (deleteCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncDeleteComment(1)(dispatch)).toBe(false);

    (deleteCommentApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncDeleteComment(1)(dispatch)).toBe(false);

    (deleteCommentApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncDeleteComment(1)(dispatch)).toBe(false);

    (deleteCommentApi as ReturnType<typeof vi.fn>).mockRejectedValue([]);
    expect(await asyncDeleteComment(1)(dispatch)).toBe(false);
  });

  it("asyncDeleteAllPosts cancel confirm success fail Error non-Error", async () => {
    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: false,
    });
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(false);

    (showConfirmDialog as ReturnType<typeof vi.fn>).mockResolvedValue({
      isConfirmed: true,
    });
    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(true);

    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(true);

    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "e",
    });
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(false);

    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(false);

    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(false);

    (deleteAllPostsApi as ReturnType<typeof vi.fn>).mockRejectedValue("x");
    expect(await asyncDeleteAllPosts()(dispatch)).toBe(false);
  });
});
