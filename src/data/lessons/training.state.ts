import { Subject, Lesson } from '../../models/Lesson';
export interface TrainingState {
  subjects: Subject[];
  lessons: Lesson[];
  loading?: boolean;
  menuEnabled: boolean;
}
