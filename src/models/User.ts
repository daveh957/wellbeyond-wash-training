export interface Registration {
  email: string;
  name: string;
  password: string;
  organization?: string;
  community?: string;
}

export interface Answer {
  question: string;
  answerBefore?: string | number;
  answerAfter?: string | number;
  correctAnswer?: string | number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  organization?: string;
  acceptedTerms?: boolean;
  canTeach?: boolean;
}

export interface Admin {
  id: string;
  isAdmin?: boolean;
}


