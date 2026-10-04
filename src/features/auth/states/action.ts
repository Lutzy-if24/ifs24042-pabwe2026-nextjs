import { ActionType } from "@/types/action";
import { loginApi, registerApi, logoutApi } from "../api/authApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";

export function setAuthLoginActionCreator(isAuthLogin: boolean) {
  return {
    type: ActionType.SET_AUTH_LOGIN,
    payload: { isAuthLogin },
  };
}

export function setAuthRegisterActionCreator(isAuthRegister: boolean) {
  return {
    type: ActionType.SET_AUTH_REGISTER,
    payload: { isAuthRegister },
  };
}

export function setAuthLogoutActionCreator(isAuthLogout: boolean) {
  return {
    type: ActionType.SET_AUTH_LOGOUT,
    payload: { isAuthLogout },
  };
}

export function asyncSetAuthLogin(email: string, password: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthLoginActionCreator(true));
    try {
      const result = await loginApi(email, password);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil login");
        return true;
      }
      await showErrorDialog(result.message || "Gagal login");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setAuthLoginActionCreator(false));
    }
  };
}

export function asyncSetAuthRegister(
  name: string,
  email: string,
  password: string
) {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthRegisterActionCreator(true));
    try {
      const result = await registerApi(name, email, password);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil registrasi");
        return true;
      }
      await showErrorDialog(result.message || "Gagal registrasi");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setAuthRegisterActionCreator(false));
    }
  };
}

export function asyncSetAuthLogout() {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthLogoutActionCreator(true));
    try {
      await logoutApi();
      await showSuccessDialog("Berhasil logout");
      return true;
    } catch {
      return true;
    } finally {
      dispatch(setAuthLogoutActionCreator(false));
    }
  };
}
