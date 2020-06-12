import {ActionType} from '../../util/types';
import {cacheImagesAndVideos, listenForTrainingData,} from './trainingApi'
import {TrainingState} from './training.state';
import {Lesson, Question, Subject} from '../../models/Training';

export const loadTrainingData = () => (async (dispatch: React.Dispatch<any>) => {
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


export type TrainingActions =
  | ActionType<typeof setData>
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>
