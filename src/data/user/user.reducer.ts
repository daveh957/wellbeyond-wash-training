import { UserActions } from './user.actions';
import { UserState } from './user.state';

export function userReducer(state: UserState, action: UserActions): UserState {
  switch (action.type) {
    case 'set-user-loading':
      return { ...state, loading: action.isLoading };
    case 'set-user-data':
      return { ...state, ...action.data };
    case 'set-username':
      return { ...state, username: action.username };
    case 'set-dark-mode':
      return { ...state, darkMode: action.darkMode };
    case 'set-is-loggedin':
      // @ts-ignore
      return { ...state, isLoggedIn: action.loggedIn };
  }
}
