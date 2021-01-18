import {TrainingActions} from './training.actions';
import {TrainingState} from './training.state';

export const trainingReducer = (state: TrainingState, action: TrainingActions): TrainingState => {
  switch (action.type) {
    case 'set-training-data': {
      return {...state, ...action.data};
    }
    case 'set-training-topics': {
      return {...state, topics: action.topics};
    }
    case 'set-training-subjects': {
      return {...state, subjects: action.subjects};
    }
    case 'set-training-lessons': {
      return {...state, lessons: action.lessons};
    }
    case 'set-training-loading': {
      return {...state, loading: action.isLoading};
    }
    case 'set-menu-enabled': {
      return {...state, menuEnabled: action.menuEnabled};
    }
  }
}
