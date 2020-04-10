import { ActionType } from '../../util/types';
import { loadData } from './lessonApi'
import { TrainingState } from './training.state';
import {Subject, Lesson} from '../../models/Lesson';

export const loadLessonData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  const subjects:Subject[] = await loadData('subjects');
  const lessons:Lesson[] = await loadData('lessons');
  dispatch(setData({lessons, subjects}));
  dispatch(setLoading(false));
}

export const setData = (data: Partial<TrainingState>) => ({
  type: 'set-lesson-data',
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

export type LessonActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>
