import { TrainingActions } from './training.actions';
import {TrainingSessions, TrainingState} from './training.state';

export const trainingReducer = (state: TrainingState, action: TrainingActions): TrainingState => {
  switch (action.type) {
    case 'set-training-data': {
      return { ...state, ...action.data };
    }
    case 'set-training-loading': {
      return { ...state, loading: action.isLoading };
    }
    case 'set-menu-enabled': {
      return { ...state, menuEnabled: action.menuEnabled };
    }
    case 'set-training-sessions': {
      return { ...state, sessions: action.sessions };
    }
    case 'set-active-session': {
      let sessions = {...state.sessions} as TrainingSessions;
      if (action.session.id) {
        sessions[action.session.id] = action.session;
      }
      return { ...state, sessions: sessions, activeSession: action.session };
    }
    case 'set-session-archived': {
      let sessions = {...state.sessions} as TrainingSessions;
      if (action.session.id) {
        delete sessions[action.session.id];
        if (state.activeSession && state.activeSession.id === action.session.id) {
          delete state.activeSession;
        }
      }
      return { ...state, sessions: sessions};
    }
  }
}
