import { createSelector } from 'reselect';
import { AppState } from './state';
import { Lesson } from '../models/Training';

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

const getPreviewParam = (_state: AppState, props: any) => {
  return props.match.params['preview'];
}

export const isPreview = createSelector(
  getPreviewParam,
  (preview) => {
    return preview === 'preview';
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

export const getUserLesson = createSelector(
  getUserLessons, getLessonIdParam, getUserId,
  (lessons, id, userId) => {
    if (lessons && id && userId) {
      return lessons[id] || {id:userId + ':' + id, lessonId: id, answers: []}
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
