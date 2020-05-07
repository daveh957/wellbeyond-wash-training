export interface Registration {
  email: string;
  name: string;
  password: string;
  organization?: string;
}

export interface Answer {
  question: string;
  answerBefore?: string | number;
  answerAfter?: string | number;
  correctAnswer?: string | number;
}

export interface PageView {
  attestationChecked?: boolean;
  videoWatched?: boolean;
}

export interface UserLesson {
  id?: string;
  lessonId: string;
  started?: Date;
  completed?: Date;
  preScore: number;
  score: number;
  answers: Array<Answer>;
  pageViews: Array<PageView>;
}

