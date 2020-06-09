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

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  organizationId?: string;
  organization?: string; // If not from the predefined list
  community?: string;
  acceptedTerms?: boolean;
  canTeach?: boolean;
}

export interface Admin {
  id: string;
  isAdmin?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  communities: string[];
}


