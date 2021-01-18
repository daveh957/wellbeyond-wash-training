import {combineReducers} from './combineReducers';
import {maintenanceReducer} from './maintenance/maintenance.reducer';
import {trainingReducer} from './training/training.reducer';
import {userReducer} from './user/user.reducer';

export const initialState: AppState = {
  data: {
    topics: [],
    subjects: [],
    lessons: [],
    loading: false,
    menuEnabled: true
  },
  maintenance: {
    systems: [],
    checklists: [],
    maintenanceLogs: {}
  },
  user: {
    darkMode: false,
    notificationsOn: true,
    loading: false,
    sessions: {}
  }
};

export const reducers = combineReducers({
  data: trainingReducer,
  maintenance: maintenanceReducer,
  user: userReducer
});

export type AppState = ReturnType<typeof reducers>;
