import { ActionType } from "@/types/action";

type AuthState = {
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
};

const initialState: AuthState = {
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
};

type AuthAction = {
  type: string;
  payload?: {
    isAuthLogin?: boolean;
    isAuthRegister?: boolean;
    isAuthLogout?: boolean;
  };
};

export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case ActionType.SET_AUTH_LOGIN:
      return {
        ...state,
        isAuthLogin: action.payload?.isAuthLogin ?? false,
      };
    case ActionType.SET_AUTH_REGISTER:
      return {
        ...state,
        isAuthRegister: action.payload?.isAuthRegister ?? false,
      };
    case ActionType.SET_AUTH_LOGOUT:
      return {
        ...state,
        isAuthLogout: action.payload?.isAuthLogout ?? false,
      };
    default:
      return state;
  }
}
