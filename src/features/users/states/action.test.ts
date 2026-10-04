import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
  asyncSetUsers,
  asyncSetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "./action";
import { ActionType } from "@/types/action";

vi.mock("../api/userApi", () => ({
  getUsersApi: vi.fn(),
  getProfileApi: vi.fn(),
  updateProfileApi: vi.fn(),
  changePhotoApi: vi.fn(),
  changePasswordApi: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
}));

import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  changePhotoApi,
  changePasswordApi,
} from "../api/userApi";

describe("users actions", () => {
  const dispatch = vi.fn((action) => {
    if (typeof action === "function") return action(dispatch);
    return action;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("action creators", () => {
    expect(setUsersActionCreator([]).type).toBe(ActionType.SET_USERS);
    expect(setUserActionCreator(null).type).toBe(ActionType.SET_USER);
    expect(setUserActionCreator({ id: 1, name: "A", email: "a@t.com" }).payload.user).toEqual(
      expect.objectContaining({ id: 1 })
    );
    expect(setProfileActionCreator(null).type).toBe(ActionType.SET_PROFILE);
    expect(setIsProfileActionCreator(true).type).toBe(ActionType.SET_IS_PROFILE);
    expect(setIsChangeProfileActionCreator(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE
    );
    expect(setIsChangeProfilePhotoActionCreator(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE_PHOTO
    );
    expect(setIsChangeProfilePasswordActionCreator(true).type).toBe(
      ActionType.SET_IS_CHANGE_PROFILE_PASSWORD
    );
  });

  it("asyncSetUsers", async () => {
    (getUsersApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { users: [{ id: 1, name: "A", email: "a@b.com" }] },
    });
    await asyncSetUsers()(dispatch);

    (getUsersApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    await asyncSetUsers()(dispatch);

    (getUsersApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    await asyncSetUsers()(dispatch);
  });

  it("asyncSetProfile", async () => {
    (getProfileApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { user: { id: 1, name: "A", email: "a@b.com" } },
    });
    expect(await asyncSetProfile()(dispatch)).toEqual(
      expect.objectContaining({ id: 1 })
    );

    (getProfileApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncSetProfile()(dispatch)).toBeNull();

    (getProfileApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncSetProfile()(dispatch)).toBeNull();
  });

  it("asyncChangeProfile", async () => {
    (updateProfileApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { user: { id: 1, name: "A", email: "a@b.com" } },
    });
    expect(await asyncChangeProfile("A", "a@b.com")(dispatch)).toBe(true);

    (updateProfileApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncChangeProfile("A", "a@b.com")(dispatch)).toBe(false);

    (updateProfileApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncChangeProfile("A", "a@b.com")(dispatch)).toBe(false);
  });

  it("asyncChangeProfilePhoto", async () => {
    const file = new File(["x"], "p.png");
    (changePhotoApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(await asyncChangeProfilePhoto(file)(dispatch)).toBe(true);

    (changePhotoApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncChangeProfilePhoto(file)(dispatch)).toBe(false);

    (changePhotoApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(await asyncChangeProfilePhoto(file)(dispatch)).toBe(false);
  });

  it("asyncChangeProfilePassword", async () => {
    (changePasswordApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    expect(
      await asyncChangeProfilePassword("a", "b", "b")(dispatch)
    ).toBe(true);

    (changePasswordApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(
      await asyncChangeProfilePassword("a", "b", "b")(dispatch)
    ).toBe(false);

    (changePasswordApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("e")
    );
    expect(
      await asyncChangeProfilePassword("a", "b", "b")(dispatch)
    ).toBe(false);
  });


  it("asyncChangeProfile success without data.user skips setProfile", async () => {
    (updateProfileApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    expect(await asyncChangeProfile("A", "a@b.com")(dispatch)).toBe(true);
  });

  it("asyncChangeProfile catch non-Error uses fallback message", async () => {
    (updateProfileApi as ReturnType<typeof vi.fn>).mockRejectedValue("oops");
    expect(await asyncChangeProfile("A", "a@b.com")(dispatch)).toBe(false);
  });

  it("asyncChangeProfilePhoto catch non-Error uses fallback message", async () => {
    const file = new File(["x"], "p.png");
    (changePhotoApi as ReturnType<typeof vi.fn>).mockRejectedValue(123);
    expect(await asyncChangeProfilePhoto(file)(dispatch)).toBe(false);
  });

  it("asyncChangeProfilePassword catch non-Error uses fallback message", async () => {
    (changePasswordApi as ReturnType<typeof vi.fn>).mockRejectedValue({
      any: true,
    });
    expect(
      await asyncChangeProfilePassword("a", "b", "b")(dispatch)
    ).toBe(false);
  });
});
