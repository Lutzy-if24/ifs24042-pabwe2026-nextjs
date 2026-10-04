import { ActionType } from "@/types/action";
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
  showErrorDialog,
  showSuccessDialog,
  showConfirmDialog,
} from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import type { Post } from "@/types";

export function setPostsActionCreator(posts: Post[]) {
  return { type: ActionType.SET_POSTS, payload: { posts } };
}

export function setPostActionCreator(post: Post | null) {
  return { type: ActionType.SET_POST, payload: { post } };
}

export function setIsPostActionCreator(isPost: boolean) {
  return { type: ActionType.SET_IS_POST, payload: { isPost } };
}

export function setIsPostAddActionCreator(isPostAdd: boolean) {
  return { type: ActionType.SET_IS_POST_ADD, payload: { isPostAdd } };
}

export function setIsPostAddedActionCreator(isPostAdded: boolean) {
  return { type: ActionType.SET_IS_POST_ADDED, payload: { isPostAdded } };
}

export function setIsPostChangeActionCreator(isPostChange: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGE, payload: { isPostChange } };
}

export function setIsPostChangedActionCreator(isPostChanged: boolean) {
  return { type: ActionType.SET_IS_POST_CHANGED, payload: { isPostChanged } };
}

export function setIsPostChangeCoverActionCreator(isPostChangeCover: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGE_COVER,
    payload: { isPostChangeCover },
  };
}

export function setIsPostChangedCoverActionCreator(
  isPostChangedCover: boolean
) {
  return {
    type: ActionType.SET_IS_POST_CHANGED_COVER,
    payload: { isPostChangedCover },
  };
}

export function setIsPostDeleteActionCreator(isPostDelete: boolean) {
  return { type: ActionType.SET_IS_POST_DELETE, payload: { isPostDelete } };
}

export function setIsPostDeletedActionCreator(isPostDeleted: boolean) {
  return { type: ActionType.SET_IS_POST_DELETED, payload: { isPostDeleted } };
}

export function setIsPostLikeActionCreator(isPostLike: boolean) {
  return { type: ActionType.SET_IS_POST_LIKE, payload: { isPostLike } };
}

export function setIsPostLikedActionCreator(isPostLiked: boolean) {
  return { type: ActionType.SET_IS_POST_LIKED, payload: { isPostLiked } };
}

export function setIsPostAddCommentActionCreator(isPostAddComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADD_COMMENT,
    payload: { isPostAddComment },
  };
}

export function setIsPostAddedCommentActionCreator(
  isPostAddedComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_ADDED_COMMENT,
    payload: { isPostAddedComment },
  };
}

export function setIsPostDeleteCommentActionCreator(
  isPostDeleteComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_DELETE_COMMENT,
    payload: { isPostDeleteComment },
  };
}

export function setIsPostDeletedCommentActionCreator(
  isPostDeletedComment: boolean
) {
  return {
    type: ActionType.SET_IS_POST_DELETED_COMMENT,
    payload: { isPostDeletedComment },
  };
}

export function setIsPostDeleteAllActionCreator(isPostDeleteAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE_ALL,
    payload: { isPostDeleteAll },
  };
}

export function setIsPostDeletedAllActionCreator(isPostDeletedAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED_ALL,
    payload: { isPostDeletedAll },
  };
}

export function asyncSetPosts(isMe = false) {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await getPostsApi(isMe);
      if (result.status === "success" && result.data?.posts) {
        dispatch(setPostsActionCreator(result.data.posts));
      } else {
        dispatch(setPostsActionCreator([]));
      }
    } catch {
      dispatch(setPostsActionCreator([]));
    }
  };
}

export function asyncSetPost(id: number | string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostActionCreator(true));
    try {
      const result = await getPostApi(id);
      if (result.status === "success" && result.data?.post) {
        dispatch(setPostActionCreator(result.data.post));
      } else {
        dispatch(setPostActionCreator(null));
      }
    } catch {
      dispatch(setPostActionCreator(null));
    } finally {
      dispatch(setIsPostActionCreator(false));
    }
  };
}

export function asyncAddPost(description: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostAddActionCreator(true));
    dispatch(setIsPostAddedActionCreator(false));
    try {
      const result = await addPostApi(description);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil menambah postingan");
        dispatch(setIsPostAddedActionCreator(true));
        return result.data?.post_id ?? true;
      }
      await showErrorDialog(result.message || "Gagal menambah postingan");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostAddActionCreator(false));
    }
  };
}

export function asyncChangePost(id: number | string, description: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChangeActionCreator(true));
    dispatch(setIsPostChangedActionCreator(false));
    try {
      const result = await updatePostApi(id, description);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil mengubah postingan");
        dispatch(setIsPostChangedActionCreator(true));
        dispatch(asyncSetPost(id));
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah postingan");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostChangeActionCreator(false));
    }
  };
}

export function asyncChangePostCover(id: number | string, file: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostChangeCoverActionCreator(true));
    dispatch(setIsPostChangedCoverActionCreator(false));
    try {
      const result = await changeCoverApi(id, file);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil mengubah cover");
        dispatch(setIsPostChangedCoverActionCreator(true));
        dispatch(asyncSetPost(id));
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah cover");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostChangeCoverActionCreator(false));
    }
  };
}

export function asyncDeletePost(id: number | string) {
  return async (dispatch: AppDispatch) => {
    const confirm = await showConfirmDialog(
      "Hapus Postingan",
      "Apakah Anda yakin ingin menghapus postingan ini?"
    );
    if (!confirm.isConfirmed) return false;

    dispatch(setIsPostDeleteActionCreator(true));
    dispatch(setIsPostDeletedActionCreator(false));
    try {
      const result = await deletePostApi(id);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil menghapus postingan");
        dispatch(setIsPostDeletedActionCreator(true));
        return true;
      }
      await showErrorDialog(result.message || "Gagal menghapus postingan");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostDeleteActionCreator(false));
    }
  };
}

export function asyncLikePost(id: number | string, like: 0 | 1) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostLikeActionCreator(true));
    dispatch(setIsPostLikedActionCreator(false));
    try {
      const result = await likePostApi(id, like);
      if (result.status === "success") {
        dispatch(setIsPostLikedActionCreator(true));
        dispatch(asyncSetPost(id));
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah status suka");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostLikeActionCreator(false));
    }
  };
}

export function asyncAddComment(id: number | string, comment: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostAddCommentActionCreator(true));
    dispatch(setIsPostAddedCommentActionCreator(false));
    try {
      const result = await addCommentApi(id, comment);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil menambah komentar");
        dispatch(setIsPostAddedCommentActionCreator(true));
        dispatch(asyncSetPost(id));
        return true;
      }
      await showErrorDialog(result.message || "Gagal menambah komentar");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostAddCommentActionCreator(false));
    }
  };
}

export function asyncDeleteComment(id: number | string) {
  return async (dispatch: AppDispatch) => {
    const confirm = await showConfirmDialog(
      "Hapus Komentar",
      "Apakah Anda yakin ingin menghapus komentar ini?"
    );
    if (!confirm.isConfirmed) return false;

    dispatch(setIsPostDeleteCommentActionCreator(true));
    dispatch(setIsPostDeletedCommentActionCreator(false));
    try {
      const result = await deleteCommentApi(id);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil menghapus komentar");
        dispatch(setIsPostDeletedCommentActionCreator(true));
        dispatch(asyncSetPost(id));
        return true;
      }
      await showErrorDialog(result.message || "Gagal menghapus komentar");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostDeleteCommentActionCreator(false));
    }
  };
}

export function asyncDeleteAllPosts() {
  return async (dispatch: AppDispatch) => {
    const confirm = await showConfirmDialog(
      "Hapus Semua Postingan",
      "Apakah Anda yakin ingin menghapus semua postingan Anda?"
    );
    if (!confirm.isConfirmed) return false;

    dispatch(setIsPostDeleteAllActionCreator(true));
    dispatch(setIsPostDeletedAllActionCreator(false));
    try {
      const result = await deleteAllPostsApi();
      if (result.status === "success") {
        await showSuccessDialog(
          result.message || "Berhasil menghapus semua postingan"
        );
        dispatch(setIsPostDeletedAllActionCreator(true));
        dispatch(setPostsActionCreator([]));
        return true;
      }
      await showErrorDialog(result.message || "Gagal menghapus semua postingan");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsPostDeleteAllActionCreator(false));
    }
  };
}
