import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  changePhotoApi,
  changePasswordApi,
} from "./userApi";

vi.mock("@/helpers/apiHelper", () => ({
  fetchWithAuth: vi.fn().mockResolvedValue({ status: "success" }),
}));

import { fetchWithAuth } from "@/helpers/apiHelper";

describe("userApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUsersApi", async () => {
    await getUsersApi();
    expect(fetchWithAuth).toHaveBeenCalledWith("/users");
  });

  it("getProfileApi", async () => {
    await getProfileApi();
    expect(fetchWithAuth).toHaveBeenCalledWith("/users/me");
  });

  it("updateProfileApi", async () => {
    await updateProfileApi("Name", "a@b.com");
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/users/me",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("changePhotoApi", async () => {
    const file = new File(["x"], "photo.png", { type: "image/png" });
    await changePhotoApi(file);
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/users/me/photo",
      expect.objectContaining({ method: "POST", isFormData: true })
    );
  });

  it("changePasswordApi", async () => {
    await changePasswordApi("old", "new", "new");
    expect(fetchWithAuth).toHaveBeenCalledWith(
      "/users/password",
      expect.objectContaining({ method: "PUT" })
    );
  });
});
