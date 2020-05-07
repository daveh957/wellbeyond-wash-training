import { loginWithEmail, logout, getUserProfile, getUserLessons, registerWithEmail, updateProfile, updateEmail, updatePassword, createOrUpdateUserLesson } from './userApi';
import { ActionType } from '../../util/types';
import { UserState, UserLessons } from './user.state';
import { Registration, UserLesson, Answer } from '../../models/User';

const setLoginError = (error: any) => {
  return ({
    type: 'set-login-error',
    loginError: error
  } as const)
};

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserProfile();
  // @ts-ignore
  dispatch(setData(data));
  const lessons = await getUserLessons();
  dispatch(setUserLessons(lessons|| {}));
  dispatch(setLoading(false));
}

export const updateLesson = (lesson: UserLesson) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setUserLesson(lesson));
  createOrUpdateUserLesson(lesson); // Don't wait for it to complete since we have offline support
}

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const setIsLoggedIn = (loggedIn: boolean) => {
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const loginUser = (email: string, password: string) => async (dispatch: React.Dispatch<any>) => {
  setLoginError(null);
  loginWithEmail(email, password)
    .then(() => {
      dispatch(loadUserData());
    })
    .catch(error => {
      dispatch(setLoginError(error));
      console.log("Error logging in:", error);
    });
};

export const registerUser = ({name, email, password, organization}:Registration) => async (dispatch: React.Dispatch<any>) => {
  setLoginError(null);
  registerWithEmail(email, password)
    .then(() => {
      updateProfile({name: name, organization: organization})
        .then(() => {
          dispatch(loadUserData());
        })
        .catch(error => {
          dispatch(setLoginError(error));
          console.log("Error logging in:", error);
        });
    })
    .catch(error => {
      dispatch(setLoginError(error));
      console.log("Error logging in:", error);
    });
};

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  await logout();
  dispatch(loadUserData());
};

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);

export const setTrainerMode = (trainerMode: boolean) => ({
  type: 'set-trainer-mode',
  trainerMode
} as const);

export const setUserLessons = (lessons: UserLessons) => ({
  type: 'set-user-lessons',
  lessons
} as const);

export const setUserLesson = (lesson: UserLesson) => ({
  type: 'set-user-lesson',
  lesson
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setLoginError>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setTrainerMode>
  | ActionType<typeof setUserLessons>
  | ActionType<typeof setUserLesson>
