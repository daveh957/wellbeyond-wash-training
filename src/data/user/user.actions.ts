import { loginWithEmail, logout, getUserProfile, getUserLessons, registerWithEmail, updateProfile, updateEmail, updatePassword, createOrUpdateUserLesson } from './userApi';
import { ActionType } from '../../util/types';
import { UserState } from './user.state';
import { Registration, UserLesson, Answer } from '../../models/User';

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const data = await getUserProfile();
  // @ts-ignore
  dispatch(setData(data));
  const lessons = await getUserLessons();
  dispatch(setUserLessons(lessons || []));
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

export const updateLesson = (lesson: UserLesson) => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  dispatch(setUserLesson(lesson));
  await createOrUpdateUserLesson(lesson);
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

export const registerUser = ({name, email, password, organization}:Registration) => async (dispatch: React.Dispatch<any>) => {
  await registerWithEmail(email, password);
  await updateProfile({name: name, organization: organization})
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

export const setUserLesson = (lesson: UserLesson) => ({
  type: 'set-user-lesson',
  lesson
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setUserLessons>
  | ActionType<typeof setUserLesson>
