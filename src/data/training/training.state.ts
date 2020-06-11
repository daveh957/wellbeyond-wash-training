import {Lesson, Subject} from '../../models/Training';

export interface TrainingState {
  subjects: Subject[];
  lessons: Lesson[];
  loading?: boolean;
  menuEnabled: boolean;
}
