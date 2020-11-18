import {Lesson, Subject, Topic} from '../../models/Training';

export interface TrainingState {
  topics: Topic[];
  subjects: Subject[];
  lessons: Lesson[];
  loading?: boolean;
  menuEnabled: boolean;
}
