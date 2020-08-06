import {Answer} from "./User";

export interface LessonPage {
  title: string,
  text: string,
  photo?: string,
  video?: string,
  photoCaption?: string,
  videoCaption?: string,
  attestation?: string
}

export interface Question {
  questionType: string;
  questionText: string;
  choices?: Array<{value: string}>;
  correctAnswer: string|number;
  explanation?: string;
}

export interface Lesson {
  id: string;
  organizationId?: string;
  locale?: string;
  name: string;
  description: string;
  photo: string;
  pages: LessonPage[]; // Embedded list
  questions: Question[]; // Embedded list
}

export interface GroupType {
  name: string;
}

export interface Subject {
  id: string;
  organizationId?: string;
  locale?: string;
  name: string;
  description: string;
  photo: string;
  lessons: Array<{lessonId: string}>; // Ordered list of lesson ids
  groupTypes?: GroupType[];
}

export interface PageView {
    attestationChecked?: boolean;
    videoWatched?: boolean;
}

export interface LessonProgress {
  id?: string;
  lessonId: string;
  started?: Date;
  completed?: Date;
  preScore?: number;
  score?: number;
  answers: Array<Answer>;
  pageViews: Array<PageView>;
}

export interface LessonProgressHash {
  [lessonId:string] : LessonProgress
}

export interface TrainingSession {
  id?: string;
  name?: string;
  archived: boolean;
  userId: string;
  organizationId?: string;
  organization?: string;
  community?: string;
  subjectId: string;
  groupType?: string;
  groupSize?: string;
  groupSizeNum?: number;
  started?: Date;
  completed?: Date;
  lessons?: LessonProgressHash;
}
