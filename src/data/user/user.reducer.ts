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
    case 'set-is-loggedin':
      return { ...state, isLoggedIn: action.loggedIn };
    case 'set-user-lessons':
      return { ...state, lessons: action.lessons };
    case 'set-user-lesson':
      const lessons = state.lessons ? state.lessons.map(l => {
        return l.id === action.lesson.id ? action.lesson : l;
      }) : [action.lesson];
      return { ...state, lessons: lessons };
  }
}
