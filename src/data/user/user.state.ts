import {LessonProgress} from "../../models/Training";
import {UserProfile, Organization, IntercomUser} from "../../models/User";

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
  intercomUser?: IntercomUser;
  profile?: UserProfile;
  lessons?: UserLessons;
  organizations?: Organization[];
}
