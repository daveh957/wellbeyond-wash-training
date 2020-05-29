import {LessonProgress} from "../../models/Training";
import {Organization} from "../../models/User";

export interface UserLessons {
  [lessonId:string] : LessonProgress
}

export interface UserAction {
  status?: 'started'|'failed'|'succeeded';
  error?: Error;
  result?: any;
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
  acceptedTerms?: boolean;
  lessons?: UserLessons;
  changePassword?: UserAction;
  changeEmail?: UserAction;
  reauthenticate?: UserAction;
  organizations?: Organization[];
}
