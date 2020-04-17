
export interface LessonPage {
  title: string,
  text: string,
  photo?: string,
  video?: string
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  photo: string;
  pages: LessonPage[]; // Embedded list
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  photo: string;
  lessons: Array<{lessonId: string}>; // Ordered list of lesson ids
}
