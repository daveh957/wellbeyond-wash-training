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

import {Lesson, Subject} from '../models/Training';
import {UserLesson} from '../models/User';
import {Redirect} from "react-router-dom";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
}

interface StateProps {
  isLoggedIn?: boolean,
  trainerMode?: boolean,
  userLesson: UserLesson
}

interface DispatchProps {
}

interface LessonSummaryProps extends OwnProps, StateProps, DispatchProps {}

const LessonSummaryPage: React.FC<LessonSummaryProps> = ({ subject, lesson, userLesson, isLoggedIn, trainerMode }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonIcon, setLessonIcon] = useState();
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();

  useEffect(() => {
    if (isLoggedIn && lesson && userLesson) {
      const lastPage = ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id) + (lesson.pages && lesson.pages.length ?  + ('/page/' + lesson.pages.length) : '/intro');
      const lastQuestion = lesson.questions && lesson.questions.length ? ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/question') : lastPage;
      setPrevUrl(lastQuestion);
      setNextUrl('/tabs/subjects/' + subject.id);
    }
  },[isLoggedIn, lesson, userLesson, trainerMode])

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

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
        {lesson && userLesson &&
        <IonContent fullscreen={true}>
          <IonCard className='lesson-card'>
            <IonCardHeader>
              <IonCardSubtitle>Lesson completed</IonCardSubtitle>
              <IonCardTitle><h2>{lesson.name}</h2></IonCardTitle>
            </IonCardHeader>
            <IonCardContent className='lesson-text'>
              <p>You have successfully completed this module and correctly answered {userLesson.score}% of the questions.</p>
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
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: LessonSummaryPage
});
