export interface UserInfo {
  email: string;
  name: string;
  companyName?: string;
}

export interface Answer {
  question: string;
  answerBefore?: string | number;
  answerAfter?: string | number;
  correctAnswer?: string | number;
}

export interface UserLesson {
  id?: string;
  lessonId: string;
  started?: Date;
  completed?: Date;
  preScore: number;
  score: number;
  answers: Array<Answer>;
}

