import {LessonProgress, TrainingSession} from "../../models/Training";
import {IntercomUser, Organization, UserProfile} from "../../models/User";

export interface UserLessons {
  [lessonId:string] : LessonProgress
}

export interface TrainingSessions {
  [id: string]: TrainingSession
}

export interface UserState {
  id?: string;
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
  darkMode: boolean;
  loading: boolean;
  notificationsOn: boolean;
  intercomUser?: IntercomUser;
  profile?: UserProfile;
  organizations?: Organization[];
  lessons?: UserLessons;
  sessions?: TrainingSessions;
}
