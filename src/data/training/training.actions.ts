import { ActionType } from '../../util/types';
import { loadData } from './trainingApi'
import { TrainingState } from './training.state';
import { Subject, Lesson } from '../../models/Training';

export const loadLessonData = () => (async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true));
  let subjects:Subject[] = await loadData('subjects');
  let lessons:Lesson[] = await loadData('lessons');
  dispatch(setData({lessons, subjects}));
  dispatch(setLoading(false));
})

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
