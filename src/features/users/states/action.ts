import { ActionType } from "@/types/action";
import {
  getUsersApi,
  getProfileApi,
  updateProfileApi,
  changePhotoApi,
  changePasswordApi,
} from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import type { User } from "@/types";

export function setUsersActionCreator(users: User[]) {
  return { type: ActionType.SET_USERS, payload: { users } };
}

export function setUserActionCreator(user: User | null) {
  return { type: ActionType.SET_USER, payload: { user } };
}

export function setProfileActionCreator(profile: User | null) {
  return { type: ActionType.SET_PROFILE, payload: { profile } };
}

export function setIsProfileActionCreator(isProfile: boolean) {
  return { type: ActionType.SET_IS_PROFILE, payload: { isProfile } };
}

export function setIsChangeProfileActionCreator(isChangeProfile: boolean) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE,
    payload: { isChangeProfile },
  };
}

export function setIsChangeProfilePhotoActionCreator(
  isChangeProfilePhoto: boolean
) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
    payload: { isChangeProfilePhoto },
  };
}

export function setIsChangeProfilePasswordActionCreator(
  isChangeProfilePassword: boolean
) {
  return {
    type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
    payload: { isChangeProfilePassword },
  };
}

export function asyncSetUsers() {
  return async (dispatch: AppDispatch) => {
    try {
      const result = await getUsersApi();
      if (result.status === "success" && result.data?.users) {
        dispatch(setUsersActionCreator(result.data.users));
      } else {
        dispatch(setUsersActionCreator([]));
      }
    } catch {
      dispatch(setUsersActionCreator([]));
    }
  };
}

export function asyncSetProfile() {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsProfileActionCreator(true));
    try {
      const result = await getProfileApi();
      if (result.status === "success" && result.data?.user) {
        dispatch(setProfileActionCreator(result.data.user));
        return result.data.user;
      }
      dispatch(setProfileActionCreator(null));
      return null;
    } catch {
      dispatch(setProfileActionCreator(null));
      return null;
    } finally {
      dispatch(setIsProfileActionCreator(false));
    }
  };
}

export function asyncChangeProfile(name: string, email: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfileActionCreator(true));
    try {
      const result = await updateProfileApi(name, email);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil mengubah profil");
        if (result.data?.user) {
          dispatch(setProfileActionCreator(result.data.user));
        }
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah profil");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsChangeProfileActionCreator(false));
    }
  };
}

export function asyncChangeProfilePhoto(file: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePhotoActionCreator(true));
    try {
      const result = await changePhotoApi(file);
      if (result.status === "success") {
        await showSuccessDialog(result.message || "Berhasil mengubah foto");
        dispatch(asyncSetProfile());
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah foto");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsChangeProfilePhotoActionCreator(false));
    }
  };
}

export function asyncChangeProfilePassword(
  password: string,
  newPassword: string,
  newPasswordConfirmation: string
) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsChangeProfilePasswordActionCreator(true));
    try {
      const result = await changePasswordApi(
        password,
        newPassword,
        newPasswordConfirmation
      );
      if (result.status === "success") {
        await showSuccessDialog(
          result.message || "Berhasil mengubah kata sandi"
        );
        return true;
      }
      await showErrorDialog(result.message || "Gagal mengubah kata sandi");
      return false;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      await showErrorDialog(message);
      return false;
    } finally {
      dispatch(setIsChangeProfilePasswordActionCreator(false));
    }
  };
}
