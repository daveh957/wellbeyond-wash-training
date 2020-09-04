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

export interface IntercomUser {
  user_id: string;
  user_hash: string;
  phone?: string;
  email?: string;
  name?: string;
  company?: object;
  tag?: object;
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
  notificationsOn?: boolean;
  intercomCompany?: object;
  intercomTag?: object;
}

export interface Admin {
  id: string;
  isAdmin?: boolean;
}

export interface Community {
  name: string;
  intercomCompany?: string;
}

export interface Organization {
  id: string;
  name: string;
  password?: string;
  contactName?: string;
  contactEmail?: string;
  communities: Community[];
  intercomCompany?: string;
  intercomTag?: string;
}


