import {ActionType} from '../../util/types';
import {listenForTrainingData,} from './trainingApi'
import {TrainingState} from './training.state';
import {Lesson, Question, Subject, Topic} from '../../models/Training';

const listeners:{topics?:any, subjects?:any, lessons?:any} = {};

export const loadTrainingData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.topics && typeof listeners.topics === 'function') {
    listeners.topics();
  }
  listenForTrainingData('topics', organizationId, (topics: Topic[]) => {
    dispatch(setTopics(topics));
  }).then(listener => {
    listeners.topics = listener;
  });

  if (listeners.subjects && typeof listeners.subjects === 'function') {
    listeners.subjects();
  }
  listenForTrainingData('subjects', organizationId, (subjects: Subject[]) => {
    dispatch(setSubjects(subjects));
  }).then(listener => {
    listeners.subjects = listener;
  });

  if (listeners.lessons && typeof listeners.lessons === 'function') {
    listeners.lessons();
  }
    listenForTrainingData('lessons', organizationId, (lessons:Lesson[]) => {
      if (lessons && lessons.length) {
        lessons.forEach(lesson => {
          if (lesson.questions) {
            lesson.questions = lesson.questions.filter((q:Question) => q.questionType && q.questionText && q.correctAnswer);
          }
        });
      }
      dispatch(setLessons(lessons));
    }).then(listener => {
      listeners.lessons = listener;
    });
});

export const setData = (data: Partial<TrainingState>) => ({
  type: 'set-training-data',
  data
} as const);

export const setTopics = (topics: Topic[]) => ({
  type: 'set-training-topics',
  topics
} as const);

export const setSubjects = (subjects: Subject[]) => ({
  type: 'set-training-subjects',
  subjects
} as const);

export const setLessons = (lessons: Lesson[]) => ({
  type: 'set-training-lessons',
  lessons
} as const);

export const setLoading = (isLoading: boolean) => ({
  type: 'set-training-loading',
  isLoading
} as const);

export const setMenuEnabled = (menuEnabled: boolean) => ({
  type: 'set-menu-enabled',
  menuEnabled
} as const);


export type TrainingActions =
  | ActionType<typeof setData>
  | ActionType<typeof setTopics>
  | ActionType<typeof setSubjects>
  | ActionType<typeof setLessons>
  | ActionType<typeof setLoading>
  | ActionType<typeof setMenuEnabled>
