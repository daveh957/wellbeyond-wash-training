import { UserLesson} from "../../models/User";

export interface UserState {
  id?: string;
  email?: string;
  name?: string;
  photoURL?: string;
  organization?: string;
  isLoggedIn?: boolean;
  darkMode: boolean;
  loading: boolean;
  lessons?: Array<UserLesson>;
}
