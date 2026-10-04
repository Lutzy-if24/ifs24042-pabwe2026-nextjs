import { ActionType } from "@/types/action";
import type { User } from "@/types";

type UsersState = {
  users: User[];
  user: User | null;
  profile: User | null;
  isProfile: boolean;
  isChangeProfile: boolean;
  isChangeProfilePhoto: boolean;
  isChangeProfilePassword: boolean;
};

const initialState: UsersState = {
  users: [],
  user: null,
  profile: null,
  isProfile: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
};

type UsersAction = {
  type: string;
  payload?: Partial<UsersState>;
};

export default function usersReducer(
  state: UsersState = initialState,
  action: UsersAction
): UsersState {
  switch (action.type) {
    case ActionType.SET_USERS:
      return { ...state, users: action.payload?.users ?? [] };
    case ActionType.SET_USER:
      return { ...state, user: action.payload?.user ?? null };
    case ActionType.SET_PROFILE:
      return { ...state, profile: action.payload?.profile ?? null };
    case ActionType.SET_IS_PROFILE:
      return { ...state, isProfile: action.payload?.isProfile ?? false };
    case ActionType.SET_IS_CHANGE_PROFILE:
      return {
        ...state,
        isChangeProfile: action.payload?.isChangeProfile ?? false,
      };
    case ActionType.SET_IS_CHANGE_PROFILE_PHOTO:
      return {
        ...state,
        isChangeProfilePhoto: action.payload?.isChangeProfilePhoto ?? false,
      };
    case ActionType.SET_IS_CHANGE_PROFILE_PASSWORD:
      return {
        ...state,
        isChangeProfilePassword:
          action.payload?.isChangeProfilePassword ?? false,
      };
    default:
      return state;
  }
}
