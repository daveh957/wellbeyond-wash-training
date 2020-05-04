import { ActionType } from '../../util/types';
import { loadData, addImageToCache, addVideoToCache } from './trainingApi'
import { TrainingState } from './training.state';
import {Subject, Lesson, Question} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";

export const loadLessonData = () => (async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  let subjects:Subject[] = await loadData('subjects');
  let lessons:Lesson[] = await loadData('lessons');
  if (lessons && lessons.length) {
    lessons.map(lesson => {
      if (lesson.questions) {
        lesson.questions = lesson.questions.filter((q:Question) => q.questionType && q.questionText && q.correctAnswer);
      }
    });
  }
  dispatch(setData({lessons, subjects}));
  dispatch(setLoading(false));
  cacheImagesAndVideos(lessons, subjects);
});

export const cacheImagesAndVideos = (lessons:Lesson[], subjects:Subject[]) => {
  if (lessons && lessons.length) {
    lessons.map(async lesson => {
      if (lesson.photo) {
        await addImageToCache(getLessonIconUrl(lesson.photo, false));
        await addImageToCache(getLessonIconUrl(lesson.photo, true));
      }
      if (lesson.pages && lesson.pages.length) {
        lesson.pages.map(async page => {
          page.photo && await addImageToCache(page.photo);
          page.video && await addVideoToCache(page.video);
        });
      }
    });
  }
  if (subjects && subjects.length) {
    subjects.map(async subject => {
      subject.photo && await addImageToCache(subject.photo);
    });
  }
};

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
