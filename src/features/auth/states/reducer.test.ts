import { describe, it, expect } from "vitest";
import authReducer from "./reducer";
import { ActionType } from "@/types/action";

describe("authReducer", () => {
  it("returns initial state", () => {
    const state = authReducer(undefined, { type: "UNKNOWN" });
    expect(state).toEqual({
      isAuthLogin: false,
      isAuthRegister: false,
      isAuthLogout: false,
    });
  });

  it("handles SET_AUTH_LOGIN true", () => {
    const state = authReducer(undefined, {
      type: ActionType.SET_AUTH_LOGIN,
      payload: { isAuthLogin: true },
    });
    expect(state.isAuthLogin).toBe(true);
  });

  it("handles SET_AUTH_LOGIN without payload uses false", () => {
    const state = authReducer(
      { isAuthLogin: true, isAuthRegister: false, isAuthLogout: false },
      { type: ActionType.SET_AUTH_LOGIN }
    );
    expect(state.isAuthLogin).toBe(false);
  });

  it("handles SET_AUTH_LOGIN with empty payload uses false", () => {
    const state = authReducer(undefined, {
      type: ActionType.SET_AUTH_LOGIN,
      payload: {},
    });
    expect(state.isAuthLogin).toBe(false);
  });

  it("handles SET_AUTH_REGISTER true", () => {
    const state = authReducer(undefined, {
      type: ActionType.SET_AUTH_REGISTER,
      payload: { isAuthRegister: true },
    });
    expect(state.isAuthRegister).toBe(true);
  });

  it("handles SET_AUTH_REGISTER without payload uses false", () => {
    const state = authReducer(
      { isAuthLogin: false, isAuthRegister: true, isAuthLogout: false },
      { type: ActionType.SET_AUTH_REGISTER }
    );
    expect(state.isAuthRegister).toBe(false);
  });

  it("handles SET_AUTH_LOGOUT true", () => {
    const state = authReducer(undefined, {
      type: ActionType.SET_AUTH_LOGOUT,
      payload: { isAuthLogout: true },
    });
    expect(state.isAuthLogout).toBe(true);
  });

  it("handles SET_AUTH_LOGOUT without payload uses false", () => {
    const state = authReducer(
      { isAuthLogin: false, isAuthRegister: false, isAuthLogout: true },
      { type: ActionType.SET_AUTH_LOGOUT }
    );
    expect(state.isAuthLogout).toBe(false);
  });
});
