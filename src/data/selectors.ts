import { createSelector } from 'reselect';
import { AppState } from './state';
import { Lesson } from '../models/Training';

export const getUsername = (state: AppState) => {
  return state.user.username;
}
export const getSubjects = (state: AppState) => {
  return state.data.subjects;
}
export const getLessons = (state: AppState) => {
  return state.data.lessons;
}

const getSubjectIdParam = (_state: AppState, props: any) => {
  return props.match.params['subjectId'];
}

const getLessonIdParam = (_state: AppState, props: any) => {
  return props.match.params['lessonId'];
}

export const getSubject = createSelector(
  getSubjects, getSubjectIdParam,
  (subjects, id) => {
    return subjects.find(s => s.id === id);
  }
);

export const getLesson = createSelector(
  getLessons, getLessonIdParam,
  (lessons, id) => {
    return lessons.find(l => l.id === id);
  }
);

export const getSubjectLessons = createSelector(
  getSubject, getLessons,
  (subject, lessons) => {
    const subjectLessons = Array<Lesson>();
    subject && subject.lessons.map(sl => {
      const lesson = lessons.find(l => l.id === sl.lessonId);
      lesson && subjectLessons.push(lesson);
    });
    return subjectLessons;
  }
);
