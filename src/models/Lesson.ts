import { Photo } from './Photo';
import { Video } from './Video';

export interface LessonPage {
  title: string,
  text: string,
  photo?: Photo,
  video?: Video
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  pages: LessonPage[]; // Embedded list
}

export interface Subject {
  id: string;
  name: string;
  lessons: string[]; // Ordered list of lesson ids
}
