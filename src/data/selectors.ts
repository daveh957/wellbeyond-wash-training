import {createSelector} from 'reselect';
import {AppState} from './state';
import {Lesson} from '../models/Training';
import queryString from 'query-string';

export const getTrainingSessions = (state: AppState) => {
  return state.data.sessions;
}
export const getUserLessons = (state: AppState) => {
  return state.user.lessons;
}
export const getSubjects = (state: AppState) => {
  return state.data.subjects;
}
export const getLessons = (state: AppState) => {
  return state.data.lessons;
}
export const getUserId = (state: AppState) => {
  return state.user.id;
}

const getSubjectIdParam = (_state: AppState, props: any) => {
  return props.match.params['subjectId'];
}
const getLessonIdParam = (_state: AppState, props: any) => {
  return props.match.params['lessonId'];
}
const getPageIdParam = (_state: AppState, props: any) => {
  return props.match.params['pageId'];
}
const getQuestionIdParam = (_state: AppState, props: any) => {
  return props.match.params['questionId'];
}
const getTrainingSessionIdParam  = (_state: AppState, props: any) => {
  const values = queryString.parse(props.location.search);
  return values['tsId'];
}
export const getTrainingSession = createSelector(
  getTrainingSessions, getTrainingSessionIdParam,
  (sessions, id) => {
    if (sessions && id && typeof id === 'string') {
      return sessions[id];
    }
  }
);
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
export const getLessonPage = createSelector(
  getLesson, getPageIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.pages && lesson.pages.length > idx ? lesson.pages[idx] : undefined;
  }
);
export const getQuestion = createSelector(
  getLesson, getQuestionIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.questions && lesson.questions.length > idx ? lesson.questions[idx] : undefined;
  }
);

export const getPageIdx = createSelector(
  getLesson, getPageIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.pages && lesson.pages.length > idx ? idx : -1;
  }
);

export const getQuestionIdx = createSelector(
  getLesson, getQuestionIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.questions && lesson.questions.length > idx ? idx : -1;
  }
);

export const getLessonProgress = createSelector(
  getTrainingSession, getUserLessons, getLessonIdParam, getUserId,
  (activeSession, userLessons, id, userId) => {
    if (activeSession && id) {
      return (activeSession && activeSession.lessons &&  activeSession.lessons[id]) || {id: id, lessonId: id, answers: []}
    }
    if (userLessons && id && userId) {
      return userLessons[id] || {id:userId + ':' + id, lessonId: id, answers: []}
    }
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
