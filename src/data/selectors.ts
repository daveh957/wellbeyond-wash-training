import { createSelector } from 'reselect';
import { AppState } from './state';
import { Lesson } from '../models/Lesson';

export const getSubjects = (state: AppState) => state.data.subjects;
export const getLessons = (state: AppState) => state.data.lessons;

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
  getSubject, getLessons,
  (subject, lessons) => {
    const subjectLessons = Array<Lesson>();
    subject && subject.lessons.map(id => {
      const lesson = lessons.find(l => l.id === id);
      lesson && subjectLessons.push(lesson);
    });
    return subjectLessons;
  }
);
