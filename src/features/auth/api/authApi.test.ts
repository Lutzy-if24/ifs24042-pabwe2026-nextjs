import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginApi, registerApi, logoutApi } from "./authApi";

vi.mock("@/helpers/apiHelper", () => ({
  fetchWithAuth: vi.fn(),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));

import {
  fetchWithAuth,
  putAccessToken,
  removeAccessToken,
} from "@/helpers/apiHelper";

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loginApi success stores token", async () => {
    (fetchWithAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      data: { token: "tok", user: { id: 1 } },
    });
    const result = await loginApi("a@b.com", "pass");
    expect(putAccessToken).toHaveBeenCalledWith("tok");
    expect(result.status).toBe("success");
  });

  it("loginApi fail does not store token", async () => {
    (fetchWithAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "error",
    });
    await loginApi("a@b.com", "pass");
    expect(putAccessToken).not.toHaveBeenCalled();
  });

  it("registerApi", async () => {
    (fetchWithAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    const result = await registerApi("Name", "a@b.com", "pass");
    expect(result.status).toBe("success");
  });

  it("logoutApi removes token", async () => {
    (fetchWithAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    await logoutApi();
    expect(removeAccessToken).toHaveBeenCalled();
  });
});
