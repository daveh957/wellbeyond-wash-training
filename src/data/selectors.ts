import { createSelector } from 'reselect';
import { AppState } from './state';
import { Lesson } from '../models/Training';

export const getSubjects = (state: AppState) => {
  return state.data.subjects;
}
export const getLessons = (state: AppState) => {
  return state.data.lessons;
}

const getIdParam = (_state: AppState, props: any) => {
  return props.match.params['id'];
}

export const getSubject = createSelector(
  getSubjects, getIdParam,
  (subjects, id) => {
    return subjects.find(s => s.id === id);
  }
);

export const getLesson = createSelector(
  getLessons, getIdParam,
  (lessons, id) => {
    return lessons.find(l => l.id === id);
  }
);

export const getSubjectLessons = createSelector(
  getSubject, getIdParam, getLessons,
  (subject, id, lessons) => {
    const subjectLessons = Array<Lesson>();
    subject && subject.lessons.map(sl => {
      const lesson = lessons.find(l => l.id === sl.lessonId);
      lesson && subjectLessons.push(lesson);
    });
    return subjectLessons;
  }
);
