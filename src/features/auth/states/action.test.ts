import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  setAuthLoginActionCreator,
  setAuthRegisterActionCreator,
  setAuthLogoutActionCreator,
  asyncSetAuthLogin,
  asyncSetAuthRegister,
  asyncSetAuthLogout,
} from "./action";
import { ActionType } from "@/types/action";

vi.mock("../api/authApi", () => ({
  loginApi: vi.fn(),
  registerApi: vi.fn(),
  logoutApi: vi.fn(),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(undefined),
  showErrorDialog: vi.fn().mockResolvedValue(undefined),
}));

import { loginApi, registerApi, logoutApi } from "../api/authApi";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

describe("auth actions", () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("action creators", () => {
    expect(setAuthLoginActionCreator(true).type).toBe(
      ActionType.SET_AUTH_LOGIN
    );
    expect(setAuthLoginActionCreator(true).payload.isAuthLogin).toBe(true);
    expect(setAuthRegisterActionCreator(true).type).toBe(
      ActionType.SET_AUTH_REGISTER
    );
    expect(setAuthLogoutActionCreator(true).type).toBe(
      ActionType.SET_AUTH_LOGOUT
    );
  });

  it("asyncSetAuthLogin success with message", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "ok",
    });
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: ActionType.SET_AUTH_LOGIN })
    );
  });

  it("asyncSetAuthLogin success without message uses fallback", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil login");
  });

  it("asyncSetAuthLogin fail with message", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "err",
    });
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("err");
  });

  it("asyncSetAuthLogin fail without message uses fallback", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal login");
  });

  it("asyncSetAuthLogin throw Error uses error.message", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("network")
    );
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("network");
  });

  it("asyncSetAuthLogin throw non-Error uses fallback message", async () => {
    (loginApi as ReturnType<typeof vi.fn>).mockRejectedValue("string-error");
    const result = await asyncSetAuthLogin("a@b.com", "pass")(dispatch);
    expect(result).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan");
  });

  it("asyncSetAuthRegister success with message", async () => {
    (registerApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
      message: "registered",
    });
    const result = await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch);
    expect(result).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("registered");
  });

  it("asyncSetAuthRegister success without message uses fallback", async () => {
    (registerApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    const result = await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch);
    expect(result).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil registrasi");
  });

  it("asyncSetAuthRegister fail with and without message", async () => {
    (registerApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
      message: "taken",
    });
    expect(await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch)).toBe(
      false
    );
    expect(showErrorDialog).toHaveBeenCalledWith("taken");

    (registerApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "fail",
    });
    expect(await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch)).toBe(
      false
    );
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal registrasi");
  });

  it("asyncSetAuthRegister throw Error and non-Error", async () => {
    (registerApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("err")
    );
    expect(await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch)).toBe(
      false
    );
    expect(showErrorDialog).toHaveBeenCalledWith("err");

    (registerApi as ReturnType<typeof vi.fn>).mockRejectedValue(123);
    expect(await asyncSetAuthRegister("N", "a@b.com", "p")(dispatch)).toBe(
      false
    );
    expect(showErrorDialog).toHaveBeenCalledWith("Terjadi kesalahan");
  });

  it("asyncSetAuthLogout success", async () => {
    (logoutApi as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "success",
    });
    const result = await asyncSetAuthLogout()(dispatch);
    expect(result).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil logout");
  });

  it("asyncSetAuthLogout throw still returns true", async () => {
    (logoutApi as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("err")
    );
    const result = await asyncSetAuthLogout()(dispatch);
    expect(result).toBe(true);
  });
});
