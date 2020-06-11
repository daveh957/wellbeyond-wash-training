import {TrainingActions} from './training.actions';
import {TrainingState} from './training.state';

export const trainingReducer = (state: TrainingState, action: TrainingActions): TrainingState => {
  switch (action.type) {
    case 'set-training-data': {
      return {...state, ...action.data};
    }
    case 'set-training-loading': {
      return {...state, loading: action.isLoading};
    }
    case 'set-menu-enabled': {
      return {...state, menuEnabled: action.menuEnabled};
    }
  }
}
