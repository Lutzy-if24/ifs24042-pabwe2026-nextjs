import { describe, it, expect } from "vitest";
import postsReducer from "./reducer";
import { ActionType } from "@/types/action";

describe("postsReducer", () => {
  it("returns initial state", () => {
    const state = postsReducer(undefined, { type: "UNKNOWN" });
    expect(state.posts).toEqual([]);
    expect(state.post).toBeNull();
    expect(state.isPost).toBe(false);
  });

  it("handles SET_POSTS with data and without payload", () => {
    const posts = [{ id: 1, user_id: 1, description: "hi" }];
    let state = postsReducer(undefined, {
      type: ActionType.SET_POSTS,
      payload: { posts },
    });
    expect(state.posts).toEqual(posts);

    state = postsReducer(state, { type: ActionType.SET_POSTS });
    expect(state.posts).toEqual([]);
  });

  it("handles SET_POST with data and without payload", () => {
    const post = { id: 1, user_id: 1, description: "hi" };
    let state = postsReducer(undefined, {
      type: ActionType.SET_POST,
      payload: { post },
    });
    expect(state.post).toEqual(post);

    state = postsReducer(state, { type: ActionType.SET_POST });
    expect(state.post).toBeNull();
  });

  const flagCases: Array<{
    type: string;
    key: keyof ReturnType<typeof postsReducer>;
  }> = [
    { type: ActionType.SET_IS_POST, key: "isPost" },
    { type: ActionType.SET_IS_POST_ADD, key: "isPostAdd" },
    { type: ActionType.SET_IS_POST_ADDED, key: "isPostAdded" },
    { type: ActionType.SET_IS_POST_CHANGE, key: "isPostChange" },
    { type: ActionType.SET_IS_POST_CHANGED, key: "isPostChanged" },
    { type: ActionType.SET_IS_POST_CHANGE_COVER, key: "isPostChangeCover" },
    { type: ActionType.SET_IS_POST_CHANGED_COVER, key: "isPostChangedCover" },
    { type: ActionType.SET_IS_POST_DELETE, key: "isPostDelete" },
    { type: ActionType.SET_IS_POST_DELETED, key: "isPostDeleted" },
    { type: ActionType.SET_IS_POST_LIKE, key: "isPostLike" },
    { type: ActionType.SET_IS_POST_LIKED, key: "isPostLiked" },
    { type: ActionType.SET_IS_POST_ADD_COMMENT, key: "isPostAddComment" },
    { type: ActionType.SET_IS_POST_ADDED_COMMENT, key: "isPostAddedComment" },
    { type: ActionType.SET_IS_POST_DELETE_COMMENT, key: "isPostDeleteComment" },
    {
      type: ActionType.SET_IS_POST_DELETED_COMMENT,
      key: "isPostDeletedComment",
    },
    { type: ActionType.SET_IS_POST_DELETE_ALL, key: "isPostDeleteAll" },
    { type: ActionType.SET_IS_POST_DELETED_ALL, key: "isPostDeletedAll" },
  ];

  flagCases.forEach(({ type, key }) => {
    it(`handles ${type} true and without payload`, () => {
      let state = postsReducer(undefined, {
        type,
        payload: { [key]: true },
      });
      expect(state[key]).toBe(true);

      state = postsReducer(state, { type });
      expect(state[key]).toBe(false);
    });
  });
});
