import { combineReducers } from './combineReducers';
import { lessonReducer } from './lessons/lesson.reducer';
import { userReducer } from './user/user.reducer';

export const initialState: AppState = {
  data: {
    subjects: [],
    lessons: [],
    loading: false,
    menuEnabled: true
  },
  user: {
    darkMode: false,
    isLoggedIn: false,
    loading: false
  }
};

export const reducers = combineReducers({
  data: lessonReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
