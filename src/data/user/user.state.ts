import {LessonProgress} from "../../models/Training";
import {UserProfile, Organization} from "../../models/User";

export interface UserLessons {
  [lessonId:string] : LessonProgress
}

export interface UserState {
  id?: string;
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
  darkMode: boolean;
  loading: boolean;
  profile?: UserProfile;
  lessons?: UserLessons;
  organizations?: Organization[];
}
