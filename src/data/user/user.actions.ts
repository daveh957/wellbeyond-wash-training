import { loginWithEmail, logout, getUserProfile, getUserLessons, registerWithEmail, createOrUpdateUserLesson } from './userApi';
import { ActionType } from '../../util/types';
import { UserState } from './user.state';
import { UserLesson, Answer } from '../../models/User';
import { AppState } from '../state';

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserProfile();
  // @ts-ignore
  dispatch(setData(data));
  const lessons = await getUserLessons();
  // @ts-ignore
  dispatch(setLoading(false));
}

export const startLesson = (lessonId: string) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  let lessons = await getUserLessons();
  lessons = lessons || new Array<UserLesson>();
  let lesson = lessons.find(element => element.lessonId === lessonId);
  if (!lesson) {
    lesson = {
      lessonId: lessonId,
      answers: new Array<Answer>()
    };
    lessons.push(lesson);
  }
  lesson.started = lesson.started || new Date();
  await createOrUpdateUserLesson(lesson);
  dispatch(setUserLessons(lessons));
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

export const setUserLessons = (lessons: Array<UserLesson>) => ({
  type: 'set-user-lessons',
  lessons
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setUsername>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setUserLessons>
