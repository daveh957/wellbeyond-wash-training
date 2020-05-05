import { UserActions } from './user.actions';
import { UserState } from './user.state';

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-trainer-mode':
      return { ...state, trainerMode: action.trainerMode };
    case 'set-is-loggedin':
      return { ...state, isLoggedIn: action.loggedIn };
    case 'set-login-error':
      return { ...state, loginError: action.loginError };
    case 'set-user-lessons':
      return { ...state, lessons: action.lessons };
    case 'set-user-lesson':
      let lessons = state.lessons || {};
      lessons[action.lesson.lessonId] = action.lesson;
      return { ...state, lessons: lessons };
  }
}
