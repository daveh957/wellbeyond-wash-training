import {Lesson, Subject, Topic, TrainingSession} from '../../models/Training';

export interface TrainingState {
  topics: Topic[];
  subjects: Subject[];
  lessons: Lesson[];
  loading?: boolean;
  menuEnabled: boolean;
}

export interface TrainingSessions {
    [id: string]: TrainingSession
}
