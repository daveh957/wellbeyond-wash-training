import {UserActions} from './user.actions';
import {TrainingSessions, UserState} from './user.state';
import {initialState} from "../state";

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-accepted-terms':
      return { ...state, acceptedTerms: action.acceptedTerms };
    case 'set-is-loggedin':
      return { ...state, isLoggedIn: action.loggedIn };
    case 'set-is-registered':
      return { ...state, isRegistered: action.registered };
    case 'set-user-lessons':
      return { ...state, lessons: action.lessons };
    case 'set-user-profile':
      return { ...state, profile: action.profile };
    case 'set-intercom-user':
      return { ...state, intercomUser: action.intercomUser};
    case 'set-user-lesson':
      let lessons = Object.assign({}, state.lessons);
      lessons[action.lesson.lessonId] = action.lesson;
      return { ...state, lessons: lessons };
    case 'set-organizations':
      return { ...state, organizations: action.organizations };
    case 'set-training-sessions': {
      return { ...state, sessions: action.sessions };
    }
    case 'set-training-session': {
      let sessions = {...state.sessions} as TrainingSessions;
      if (action.session.id) {
        sessions[action.session.id] = action.session;
      }
      return { ...state, sessions: sessions };
    }
    case 'set-session-archived': {
      let sessions = {...state.sessions} as TrainingSessions;
      if (action.session.id) {
        delete sessions[action.session.id];
      }
      return { ...state, sessions: sessions};
    }
    case 'reset-user-data':
      let newState = {...initialState.user};
      newState.isLoggedIn = false;
      newState.isRegistered = false;
      newState.acceptedTerms = false;
      newState.profile = undefined;
      newState.intercomUser = undefined;
      newState.lessons = {};
      newState.sessions = {};
      return newState;
  }
}
