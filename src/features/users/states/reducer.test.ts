import { describe, it, expect } from "vitest";
import usersReducer from "./reducer";
import { ActionType } from "@/types/action";

describe("usersReducer", () => {
  it("returns initial state", () => {
    const state = usersReducer(undefined, { type: "UNKNOWN" });
    expect(state.users).toEqual([]);
    expect(state.profile).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isProfile).toBe(false);
  });

  it("handles SET_USERS with data", () => {
    const users = [{ id: 1, name: "A", email: "a@test.com" }];
    const state = usersReducer(undefined, {
      type: ActionType.SET_USERS,
      payload: { users },
    });
    expect(state.users).toEqual(users);
  });

  it("handles SET_USERS without payload uses empty array", () => {
    const prev = {
      users: [{ id: 1, name: "A", email: "a@t.com" }],
      user: null,
      profile: null,
      isProfile: false,
      isChangeProfile: false,
      isChangeProfilePhoto: false,
      isChangeProfilePassword: false,
    };
    const state = usersReducer(prev, { type: ActionType.SET_USERS });
    expect(state.users).toEqual([]);
  });

  it("handles SET_USER with data and without payload", () => {
    const user = { id: 2, name: "B", email: "b@test.com" };
    let state = usersReducer(undefined, {
      type: ActionType.SET_USER,
      payload: { user },
    });
    expect(state.user).toEqual(user);

    state = usersReducer(state, { type: ActionType.SET_USER });
    expect(state.user).toBeNull();
  });

  it("handles SET_PROFILE with data and without payload", () => {
    const profile = { id: 1, name: "A", email: "a@test.com" };
    let state = usersReducer(undefined, {
      type: ActionType.SET_PROFILE,
      payload: { profile },
    });
    expect(state.profile).toEqual(profile);

    state = usersReducer(state, { type: ActionType.SET_PROFILE });
    expect(state.profile).toBeNull();
  });

  it("handles SET_IS_PROFILE true and without payload", () => {
    let state = usersReducer(undefined, {
      type: ActionType.SET_IS_PROFILE,
      payload: { isProfile: true },
    });
    expect(state.isProfile).toBe(true);

    state = usersReducer(state, { type: ActionType.SET_IS_PROFILE });
    expect(state.isProfile).toBe(false);
  });

  it("handles SET_IS_CHANGE_PROFILE true and without payload", () => {
    let state = usersReducer(undefined, {
      type: ActionType.SET_IS_CHANGE_PROFILE,
      payload: { isChangeProfile: true },
    });
    expect(state.isChangeProfile).toBe(true);

    state = usersReducer(state, { type: ActionType.SET_IS_CHANGE_PROFILE });
    expect(state.isChangeProfile).toBe(false);
  });

  it("handles SET_IS_CHANGE_PROFILE_PHOTO true and without payload", () => {
    let state = usersReducer(undefined, {
      type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
      payload: { isChangeProfilePhoto: true },
    });
    expect(state.isChangeProfilePhoto).toBe(true);

    state = usersReducer(state, {
      type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    });
    expect(state.isChangeProfilePhoto).toBe(false);
  });

  it("handles SET_IS_CHANGE_PROFILE_PASSWORD true and without payload", () => {
    let state = usersReducer(undefined, {
      type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
      payload: { isChangeProfilePassword: true },
    });
    expect(state.isChangeProfilePassword).toBe(true);

    state = usersReducer(state, {
      type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    });
    expect(state.isChangeProfilePassword).toBe(false);
  });
});
