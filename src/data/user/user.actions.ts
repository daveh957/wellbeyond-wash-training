import { loginWithEmail, logout, getUserProfile, registerWithEmail } from './userApi';
import { ActionType } from '../../util/types';
import { UserState } from './user.state';

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserProfile();
  // @ts-ignore
  dispatch(setData(data));
  dispatch(setLoading(false));
}

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const setUsername = (username?: string) => {
  return ({
    type: 'set-username',
    username
  } as const);
};

export const setIsLoggedIn = (loggedIn: boolean) => {
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const loginUser = (email: string, password: string) => async (dispatch: React.Dispatch<any>) => {
  await loginWithEmail(email, password);
  dispatch(loadUserData());
};

export const registerUser = (email: string, password: string) => async (dispatch: React.Dispatch<any>) => {
  await registerWithEmail(email, password);
  dispatch(loadUserData());
};

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  await logout();
  dispatch(loadUserData());
};

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setUsername>
  | ActionType<typeof setDarkMode>
