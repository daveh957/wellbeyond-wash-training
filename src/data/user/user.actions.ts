import {
  createOrUpdateLessonProgress,
  getUserLessons,
  getUserProfile,
  logout,
  reauthenticateWithPassword,
  updateProfile
} from './userApi';
import {ActionType} from '../../util/types'
import {UserLessons, UserState} from './user.state';
import {LessonProgress} from "../../models/Training";

const setLoginError = (error: any) => {
  return ({
    type: 'set-login-error',
    loginError: error
  } as const)
};

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserProfile();
  if (data) {
    dispatch(setIsLoggedIn(true));
    // @ts-ignore
    data.acceptedTerms = !!data.acceptedTerms;
    // @ts-ignore
    dispatch(setData(data));
    const lessons = await getUserLessons();
    dispatch(setUserLessons(lessons || {}));
  }
  dispatch(setLoading(false));
}

export const acceptTerms = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setAcceptedTerms(true));
  updateProfile({acceptedTerms: true}); // Don't wait for it to complete since we have offline support
}

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const resetData = () => ({
  type: 'reset-user-data'
} as const);

export const setIsLoggedIn = (loggedIn: boolean) => {
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const)
};

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  logout();
  dispatch(resetData());
};

export const reauthenticate = (password: string) => async (dispatch: React.Dispatch<any>) => {
  setLoginError(null);
  reauthenticateWithPassword(password)
    .catch(error => {
      dispatch(setLoginError(error));
      console.log("Error reauthenticating:", error);
    });
};

export const updateUserLesson = (lesson: LessonProgress) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setUserLesson(lesson));
  createOrUpdateLessonProgress(lesson); // Don't wait for it to complete since we have offline support
}

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);

export const setTrainerMode = (trainerMode: boolean) => ({
  type: 'set-trainer-mode',
  trainerMode
} as const);

export const setAcceptedTerms = (acceptedTerms?: boolean) => ({
  type: 'set-accepted-terms',
  acceptedTerms
} as const);

export const setUserLessons = (lessons: UserLessons) => ({
  type: 'set-user-lessons',
  lessons
} as const);

export const setUserLesson = (lesson: LessonProgress) => ({
  type: 'set-user-lesson',
  lesson
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof resetData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setLoginError>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setTrainerMode>
  | ActionType<typeof setAcceptedTerms>
  | ActionType<typeof setUserLessons>
  | ActionType<typeof setUserLesson>
