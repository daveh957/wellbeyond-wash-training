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
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, LessonProgress, Subject, TrainingSession} from '../models/Training';
import {getLessonIconUrl} from "../util/cloudinary";
import {updateTrainingLesson} from "../data/user/user.actions";
import BackToLessonsLink from "../components/BackToLessons";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  lessonProgress: LessonProgress;
  activeSession?: TrainingSession;
}

interface StateProps {
}

interface DispatchProps {
  updateTrainingLesson: typeof updateTrainingLesson;
}

interface LessonIntroProps extends OwnProps, StateProps, DispatchProps {}

const LessonIntroPage: React.FC<LessonIntroProps> = ({ subject,lesson, lessonProgress, activeSession, updateTrainingLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonIcon, setLessonIcon] = useState<string>();
  const [nextUrl, setNextUrl] = useState<string>();
  useEffect(() => {
    if (lesson && lesson.photo) {
      setLessonIcon(getLessonIconUrl(lesson.photo, false));
    }
  },[lesson]);

  useEffect(() => {
    if (subject && lesson && lessonProgress) {
      if (!lessonProgress.started) {
        lessonProgress.started = new Date();
        updateTrainingLesson(activeSession, lessonProgress);
      }
      const firstPage = ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id) + (lesson.pages && lesson.pages.length ?  '/page/1' : '/summary');
      const firstQuestion = lesson.questions && lesson.questions.length ?
        ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/preview/1' ) :
        firstPage;
      if (lessonProgress.completed) {
        setNextUrl(firstPage  + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
      else {
        setNextUrl(firstQuestion + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : ''));
      }
    }
  },[subject, lesson, lessonProgress, activeSession, updateTrainingLesson])

  return (
    <IonPage id="lesson-intro">
        <IonHeader translucent={true}>
          {subject && lesson &&
          <IonToolbar>
            <IonButtons slot="start">
              <BackToLessonsLink subject={subject} session={activeSession}/>
            </IonButtons>
            <IonTitle>{lesson.name}</IonTitle>
          </IonToolbar>
          }
        </IonHeader>
        {lesson &&
          <IonContent fullscreen={true}>
            <IonCard className='lesson-card'>
              <IonCardHeader>
                <IonCardSubtitle>{t('resources.lessons.intro.title')}</IonCardSubtitle>
                <IonCardTitle>{lesson.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className='lesson-text'>
                <img src={lessonIcon} crossOrigin='anonymous' alt="">
                </img>
                <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
                {lessonProgress && lessonProgress.completed ?
                  <p>{t('resources.lessons.intro.completed')}</p>
                  :
                  <p>{t('resources.lessons.intro.firsttime')} </p>
                }
              </IonCardContent>
            </IonCard>
          </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill="solid" color="primary" routerLink={nextUrl} routerDirection={'forward'}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};


export default connect({
  mapDispatchToProps: {
    updateTrainingLesson: updateTrainingLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getTrainingSession(state, ownProps)
  }),
  component: LessonIntroPage
});
