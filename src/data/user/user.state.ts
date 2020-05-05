import { UserLesson} from "../../models/User";

export interface UserLessons {
  [lessonId:string] : UserLesson
}

export interface UserState {
  id?: string;
  email?: string;
  name?: string;
  photoURL?: string;
  organization?: string;
  loginError?: any;
  isLoggedIn?: boolean;
  darkMode: boolean;
  trainerMode: boolean;
  loading: boolean;
  lessons?: UserLessons;
}
