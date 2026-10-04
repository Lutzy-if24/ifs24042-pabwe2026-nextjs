import { ActionType } from "@/types/action";
import type { Post } from "@/types";

type PostsState = {
  posts: Post[];
  post: Post | null;
  isPost: boolean;
  isPostAdd: boolean;
  isPostAdded: boolean;
  isPostChange: boolean;
  isPostChanged: boolean;
  isPostChangeCover: boolean;
  isPostChangedCover: boolean;
  isPostDelete: boolean;
  isPostDeleted: boolean;
  isPostLike: boolean;
  isPostLiked: boolean;
  isPostAddComment: boolean;
  isPostAddedComment: boolean;
  isPostDeleteComment: boolean;
  isPostDeletedComment: boolean;
  isPostDeleteAll: boolean;
  isPostDeletedAll: boolean;
};

const initialState: PostsState = {
  posts: [],
  post: null,
  isPost: false,
  isPostAdd: false,
  isPostAdded: false,
  isPostChange: false,
  isPostChanged: false,
  isPostChangeCover: false,
  isPostChangedCover: false,
  isPostDelete: false,
  isPostDeleted: false,
  isPostLike: false,
  isPostLiked: false,
  isPostAddComment: false,
  isPostAddedComment: false,
  isPostDeleteComment: false,
  isPostDeletedComment: false,
  isPostDeleteAll: false,
  isPostDeletedAll: false,
};

type PostsAction = {
  type: string;
  payload?: Partial<PostsState>;
};

export default function postsReducer(
  state: PostsState = initialState,
  action: PostsAction
): PostsState {
  switch (action.type) {
    case ActionType.SET_POSTS:
      return { ...state, posts: action.payload?.posts ?? [] };
    case ActionType.SET_POST:
      return { ...state, post: action.payload?.post ?? null };
    case ActionType.SET_IS_POST:
      return { ...state, isPost: action.payload?.isPost ?? false };
    case ActionType.SET_IS_POST_ADD:
      return { ...state, isPostAdd: action.payload?.isPostAdd ?? false };
    case ActionType.SET_IS_POST_ADDED:
      return { ...state, isPostAdded: action.payload?.isPostAdded ?? false };
    case ActionType.SET_IS_POST_CHANGE:
      return { ...state, isPostChange: action.payload?.isPostChange ?? false };
    case ActionType.SET_IS_POST_CHANGED:
      return {
        ...state,
        isPostChanged: action.payload?.isPostChanged ?? false,
      };
    case ActionType.SET_IS_POST_CHANGE_COVER:
      return {
        ...state,
        isPostChangeCover: action.payload?.isPostChangeCover ?? false,
      };
    case ActionType.SET_IS_POST_CHANGED_COVER:
      return {
        ...state,
        isPostChangedCover: action.payload?.isPostChangedCover ?? false,
      };
    case ActionType.SET_IS_POST_DELETE:
      return { ...state, isPostDelete: action.payload?.isPostDelete ?? false };
    case ActionType.SET_IS_POST_DELETED:
      return {
        ...state,
        isPostDeleted: action.payload?.isPostDeleted ?? false,
      };
    case ActionType.SET_IS_POST_LIKE:
      return { ...state, isPostLike: action.payload?.isPostLike ?? false };
    case ActionType.SET_IS_POST_LIKED:
      return { ...state, isPostLiked: action.payload?.isPostLiked ?? false };
    case ActionType.SET_IS_POST_ADD_COMMENT:
      return {
        ...state,
        isPostAddComment: action.payload?.isPostAddComment ?? false,
      };
    case ActionType.SET_IS_POST_ADDED_COMMENT:
      return {
        ...state,
        isPostAddedComment: action.payload?.isPostAddedComment ?? false,
      };
    case ActionType.SET_IS_POST_DELETE_COMMENT:
      return {
        ...state,
        isPostDeleteComment: action.payload?.isPostDeleteComment ?? false,
      };
    case ActionType.SET_IS_POST_DELETED_COMMENT:
      return {
        ...state,
        isPostDeletedComment: action.payload?.isPostDeletedComment ?? false,
      };
    case ActionType.SET_IS_POST_DELETE_ALL:
      return {
        ...state,
        isPostDeleteAll: action.payload?.isPostDeleteAll ?? false,
      };
    case ActionType.SET_IS_POST_DELETED_ALL:
      return {
        ...state,
        isPostDeletedAll: action.payload?.isPostDeletedAll ?? false,
      };
    default:
      return state;
  }
}
