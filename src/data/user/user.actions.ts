import {
  authCheck,
  createOrUpdateLessonProgress,
  createOrUpdateTrainingSession,
  getUserLessons,
  getUserProfile,
  listenForOrganizationData,
  listenForUserProfile,
  listenForUserLessons,
  listenForTrainingSessions,
  logout,
  updateProfile
} from './userApi';
import {ActionType} from '../../util/types'
import {TrainingSessions, UserLessons, UserState} from './user.state';
import {LessonProgress, TrainingSession} from "../../models/Training";
import {IntercomUser, Organization, UserProfile} from "../../models/User";

export const loadOrganizations = () => async (dispatch: React.Dispatch<any>) => {
  listenForOrganizationData(function(organizations:Organization[]) {
    dispatch(setOrganizations(organizations));
  });
}

export const watchAuthState = () => async (dispatch: React.Dispatch<any>) => {

}


export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const profile:(UserProfile|void) = await getUserProfile();
  if (profile) {
    dispatch(setIsRegistered(true));
    dispatch(setAcceptedTerms(!!profile.acceptedTerms));
    dispatch(setData({profile: profile}));
    const lessons = await getUserLessons();
    dispatch(setUserLessons(lessons || {}));
  }
  dispatch(setLoading(false));
}

export const acceptTerms = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setAcceptedTerms(true));
  updateProfile({acceptedTerms: true}); // Don't wait for it to complete since we have offline support
}
export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  logout();
  dispatch(resetData());
};
export const loadTrainingSessions = () => async (dispatch: React.Dispatch<any>) => {
  listenForTrainingSessions((sessions:TrainingSessions) => {
    dispatch(setTrainingSessions(sessions));
  });
}

export const startTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  createOrUpdateTrainingSession(session);
  dispatch(setTrainingSession(session));
}

export const updateTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  createOrUpdateTrainingSession(session);
  dispatch(setTrainingSession(session));
}

export const updateTrainingLesson = (session: TrainingSession|undefined, lesson: LessonProgress) => async (dispatch: React.Dispatch<any>) => {
  if (session) {
    session.lessons = session.lessons || {};
    session.lessons[lesson.lessonId] = lesson;
    createOrUpdateTrainingSession(session);
  }
  else {
    dispatch(setUserLesson(lesson));
    createOrUpdateLessonProgress(lesson); // Don't wait for it to complete since we have offline support
  }
}

export const archiveTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  session.archived = true;
  createOrUpdateTrainingSession(session);
  dispatch(setSessionArchived(session));
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
  } as const);
};

export const setIsRegistered = (registered: boolean) => {
  return ({
    type: 'set-is-registered',
    registered
  } as const)
};

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
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

export const setUserProfile = (profile: UserProfile) => ({
  type: 'set-user-profile',
  profile
} as const);

export const setIntercomUser = (intercomUser: IntercomUser) => ({
  type: 'set-intercom-user',
  intercomUser
} as const);

export const setOrganizations = (organizations: Organization[]) => ({
  type: 'set-organizations',
  organizations
} as const);

export const setTrainingSessions = (sessions: TrainingSessions) => ({
  type: 'set-training-sessions',
  sessions
} as const);

export const setTrainingSession = (session: TrainingSession) => ({
  type: 'set-training-session',
  session
} as const);

export const setSessionArchived = (session: TrainingSession) => ({
  type: 'set-session-archived',
  session
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof resetData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setIsRegistered>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setAcceptedTerms>
  | ActionType<typeof setUserLessons>
  | ActionType<typeof setUserLesson>
  | ActionType<typeof setUserProfile>
  | ActionType<typeof setIntercomUser>
  | ActionType<typeof setOrganizations>
  | ActionType<typeof setTrainingSessions>
  | ActionType<typeof setTrainingSession>
  | ActionType<typeof setSessionArchived>
