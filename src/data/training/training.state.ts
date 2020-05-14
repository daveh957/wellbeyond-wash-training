import {Lesson, Subject, TrainingSession} from '../../models/Training';

export interface TrainingSessions {
  [id:string] : TrainingSession
}

export interface TrainingState {
  subjects: Subject[];
  lessons: Lesson[];
  sessions?: TrainingSessions;
  loading?: boolean;
  menuEnabled: boolean;
}
