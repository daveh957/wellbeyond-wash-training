import {Subject, Lesson, TrainingSession, LessonProgress} from '../../models/Training';

export interface TrainingSessions {
  [id:string] : TrainingSession
}

export interface TrainingState {
  subjects: Subject[];
  lessons: Lesson[];
  sessions?: TrainingSessions;
  activeSession?: TrainingSession;
  loading?: boolean;
  menuEnabled: boolean;
}
