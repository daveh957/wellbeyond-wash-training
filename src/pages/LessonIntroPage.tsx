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
import {setUserLesson, updateLesson} from "../data/user/user.actions";
import {getLessonIconUrl} from "../util/cloudinary";

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
  updateLesson: typeof updateLesson;
  setUserLesson: typeof setUserLesson;
}

interface LessonIntroProps extends OwnProps, StateProps, DispatchProps {}

const LessonIntroPage: React.FC<LessonIntroProps> = ({ subject,lesson, userLesson, isLoggedIn, trainerMode, updateLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonIcon, setLessonIcon] = useState();
  const [nextUrl, setNextUrl] = useState();
  useEffect(() => {
    if (lesson && lesson.photo) {
      setLessonIcon(getLessonIconUrl(lesson.photo, false));
    }
  },[lesson]);

  useEffect(() => {
    if (isLoggedIn && lesson && userLesson) {
      if (!userLesson.started) {
        userLesson.started = new Date();
        if (trainerMode) { // Only update the DB if not in trainer mode
          setUserLesson(userLesson);
        }
        else {
          updateLesson(userLesson);
        }
      }
      const firstPage = ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id) + (lesson.pages && lesson.pages.length ?  '/page/1' : '/summary');
      const firstQuestion = lesson.questions && lesson.questions.length ?
        ('/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/preview/1' ) :
        firstPage;
      if (userLesson.completed && !trainerMode) {
        setNextUrl(firstPage);
      }
      else {
        setNextUrl(firstQuestion);
      }
    }
  },[isLoggedIn, lesson, userLesson, trainerMode])

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="lesson-intro">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{lesson && lesson.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {lesson &&
          <IonContent fullscreen={true}>
            <IonCard className='lesson-card'>
              <IonCardHeader>
                <IonCardSubtitle>Introduction</IonCardSubtitle>
                <IonCardTitle>{lesson.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent className='lesson-text'>
                <img src={lessonIcon} crossOrigin='anonymous' alt="">
                </img>
                <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
                {userLesson && userLesson.completed ?
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
    updateLesson,
    setUserLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: LessonIntroPage
});
