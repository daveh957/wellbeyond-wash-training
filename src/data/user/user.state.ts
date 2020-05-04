import { UserLesson} from "../../models/User";

export interface UserState {
  id?: string;
  email?: string;
  name?: string;
  photoURL?: string;
  organization?: string;
  loginError?: any;
  isLoggedIn?: boolean;
  darkMode: boolean;
  loading: boolean;
  lessons?: Array<UserLesson>;
}
