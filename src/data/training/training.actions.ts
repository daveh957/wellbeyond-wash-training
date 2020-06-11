import {ActionType} from '../../util/types';
import {
  cacheImagesAndVideos,
  createOrUpdateTrainingSession,
  listenForTrainingData, listenForTrainingSessionData,
} from './trainingApi'
import {TrainingSessions, TrainingState} from './training.state';
import {Lesson, LessonProgress, Question, Subject, TrainingSession} from '../../models/Training';
import {updateUserLesson} from "../user/user.actions";

export const loadLessonData = () => (async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  listenForTrainingData('subjects', (subjects:Subject[]) => {
    listenForTrainingData('lessons', (lessons:Lesson[]) => {
      if (lessons && lessons.length) {
        lessons.forEach(lesson => {
          if (lesson.questions) {
            lesson.questions = lesson.questions.filter((q:Question) => q.questionType && q.questionText && q.correctAnswer);
          }
        });
      }
      cacheImagesAndVideos(lessons, subjects);
      dispatch(setData({lessons, subjects}));
      dispatch(setLoading(false));
    });
  });
});

export const setData = (data: Partial<TrainingState>) => ({
  type: 'set-training-data',
  data
} as const);

export const setLoading = (isLoading: boolean) => ({
  type: 'set-training-loading',
  isLoading
} as const);

export const setMenuEnabled = (menuEnabled: boolean) => ({
  type: 'set-menu-enabled',
  menuEnabled
} as const);

export const loadTrainingSessions = () => async (dispatch: React.Dispatch<any>) => {
  listenForTrainingSessionData((sessions:TrainingSessions) => {
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

export const updateTrainingLesson = (session: TrainingSession, lesson: LessonProgress) => async (dispatch: React.Dispatch<any>) => {
  session.lessons = session.lessons || {};
  session.lessons[lesson.lessonId] = lesson;
  createOrUpdateTrainingSession(session);
}

export const archiveTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  session.archived = true;
  createOrUpdateTrainingSession(session);
  dispatch(setSessionArchived(session));
}

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

export type TrainingActions =
  | ActionType<typeof setData>
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>
  | ActionType<typeof setTrainingSessions>
  | ActionType<typeof setTrainingSession>
  | ActionType<typeof setSessionArchived>
