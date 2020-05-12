import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, LessonProgress, Subject, TrainingSession} from '../models/Training';
import {updateUserLesson} from "../data/user/user.actions";
import {updateTrainingLesson} from "../data/training/training.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  lessonProgress: LessonProgress;
}

interface StateProps {
  activeSession?: TrainingSession;
}

interface DispatchProps {
  updateUserLesson: typeof updateUserLesson;
  updateTrainingLesson: typeof updateTrainingLesson;
}

interface LessonSummaryProps extends OwnProps, StateProps, DispatchProps {}

const LessonSummaryPage: React.FC<LessonSummaryProps> = ({ subject, lesson, lessonProgress,  activeSession, updateUserLesson, updateTrainingLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonIcon, setLessonIcon] = useState();
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();

  useEffect(() => {
    if (lesson && lessonProgress) {
      const lastPage = ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id) + (lesson.pages && lesson.pages.length ?  + ('/page/' + lesson.pages.length) : '/intro');
      const lastQuestion = lesson.questions && lesson.questions.length ? ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/question') : lastPage;
      setPrevUrl(lastQuestion);
      setNextUrl('/tabs/subjects/' + subject.id);
    }
  },[lesson, lessonProgress])

  return (
    <IonPage id="lesson-summary">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{lesson && lesson.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {lesson && lessonProgress &&
        <IonContent fullscreen={true}>
          <IonCard className='lesson-card'>
            <IonCardHeader>
              <IonCardSubtitle>Lesson completed</IonCardSubtitle>
              <IonCardTitle><h2>{lesson.name}</h2></IonCardTitle>
            </IonCardHeader>
            <IonCardContent className='lesson-text'>
              <p>You have successfully completed this module and correctly answered {lessonProgress.score}% of the questions.</p>
            </IonCardContent>
          </IonCard>
        </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary"  routerLink={nextUrl} routerDirection='root'>{t('buttons.done')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};

export default connect({
  mapDispatchToProps: {
    updateUserLesson: updateUserLesson,
    updateTrainingLesson: updateTrainingLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getActiveSession(state)
  }),
  component: LessonSummaryPage
});
