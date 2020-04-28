
export interface LessonPage {
  title: string,
  text: string,
  photo?: string,
  video?: string
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
  name: string;
  description: string;
  photo: string;
  pages: LessonPage[]; // Embedded list
  questions: [Question]; // Embedded list
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  photo: string;
  lessons: Array<{lessonId: string}>; // Ordered list of lesson ids
}
