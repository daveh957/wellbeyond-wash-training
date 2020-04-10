import { LessonActions } from './lesson.actions';
import { TrainingState } from './training.state';

export const lessonReducer = (state: TrainingState, action: LessonActions): TrainingState => {
  switch (action.type) {
    case 'set-training-loading': {
      return { ...state, loading: action.isLoading };
    }
    case 'set-menu-enabled': {
      return { ...state, menuEnabled: action.menuEnabled };
    }
  }
}
