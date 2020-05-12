import {
  loginWithEmail,
  logout,
  getUserProfile,
  registerWithEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithPassword,
  getUserLessons, createOrUpdateLessonProgress
} from './userApi';
import { ActionType } from '../../util/types'
import {UserLessons, UserState} from './user.state';
import { Registration, Answer } from '../../models/User';
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
    // @ts-ignore
    dispatch(setData(data));
    const lessons = await getUserLessons();
    dispatch(setUserLessons(lessons || {}));
    // @ts-ignore
    dispatch(setAcceptedTerms(!!data.acceptedTerms));
  }
  else {
    dispatch(resetData());
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

export const loginUser = (email: string, password: string) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoginError(null));
  dispatch(setLoading(true));
  loginWithEmail(email, password)
    .then(() => {
      dispatch(loadUserData());
    })
    .catch(error => {
      dispatch(setLoading(false));
      dispatch(setLoginError(error));
      console.log("Error logging in:", error);
    });
};

export const registerUser = ({name, email, password, organization}:Registration) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoginError(null));
  dispatch(setLoading(true));
  registerWithEmail(email, password)
    .then(() => {
      updateProfile({name: name, organization: organization})
        .then(() => {
          dispatch(loadUserData());
        })
        .catch(error => {
          dispatch(setLoading(false));
          dispatch(setLoginError(error));
          console.log("Error logging in:", error);
        });
    })
    .catch(error => {
      dispatch(setLoading(false));
      dispatch(setLoginError(error));
      console.log("Error registering user:", error);
    });
};

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  logout();
  dispatch(setIsLoggedIn(false));
  dispatch(setAcceptedTerms(undefined));
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

export const changeEmail = (email: string) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setData({changeEmail: {status: 'started'}}));
  updateEmail(email).then((result) => {
    dispatch(setData({changeEmail: {status: 'succeeded', result: result}}));
    })
    .catch(error => {
      dispatch(setData({changeEmail: {status: 'failed', error: error}}));
      console.log("Error updating password:", error);
    });
};

export const changePassword = (password: string) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setData({changePassword: {status: 'started'}}));
  updatePassword(password).then((result) => {
    dispatch(setData({changePassword: {status: 'succeeded', result: result}}));
  })
    .catch(error => {
      dispatch(setData({changePassword: {status: 'failed', error: error}}));
      console.log("Error updating password:", error);
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
