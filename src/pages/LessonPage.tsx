import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent, IonFooter,
  IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton,
  IonPage, IonRadio, IonRadioGroup,
  IonTitle,
  IonToolbar, NavContext
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, Subject, LessonPage} from '../models/Training';
import {UserLesson} from '../models/User';
import {Redirect} from "react-router-dom";
import {setUserLesson, updateLesson} from "../data/user/user.actions";
import VideoPlayer from "../components/VideoPlayer";
import ImageZoomModal from "../components/ImageZoomModal";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  page: LessonPage;
  idx: number;
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

interface LessonPageProps extends OwnProps, StateProps, DispatchProps {}

const LessonPagePage: React.FC<LessonPageProps> = ({ subject, lesson, page, idx, userLesson, isLoggedIn, trainerMode, updateLesson, setUserLesson }) => {

  const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [videoViewed, setVideoViewed] = useState();
  const [showNext, setShowNext] = useState();
  const [videoState, setVideoState] = useState();
  const [videoPlayer, setVideoPlayer] = useState();
  const [showModal, setShowModal] = useState();

  useEffect(() => {
    if (isLoggedIn && lesson) {
      const path = '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id;
      const prev = idx - 1;
      const next = idx + 1;
      if (prev < 0) {
        if (lesson.questions && lesson.questions.length && (!userLesson.completed || trainerMode)) {
          setPrevUrl(path + '/question/' + lesson.questions.length + '/preview');
        }
        else {
          setPrevUrl(path + '/intro');
        }
      }
      else {
        setPrevUrl(path + '/page/' + (prev+1));
      }
      if (next > lesson.pages.length - 1) {
        if (lesson.questions && lesson.questions.length) {
          setNextUrl(path + '/question/1');
        }
        else {
          setNextUrl(path + '/summary');
        }
      }
      else {
        setNextUrl(path + '/page/' + (next+1));
      }
    }
  },[isLoggedIn, lesson, idx]);

  useEffect(() => {
    if (videoState) {
      if (videoState.ended) {
        setVideoViewed(true);
      }
      if (videoState.currentTime > 0 && videoState.duration > 0 && (videoState.currentTime / videoState.duration) > 0.8) {
        setVideoViewed(true); // 80% is good enough
      }
    }
  }, [videoState]);

  const openModal = () => {setShowModal(true)};
  const closeModal = () => {setShowModal(false)};
  const handleNext = (e:any) => {
    e.preventDefault();
    navigate(nextUrl, 'forward');
  }
  const handlePrev = (e:any) => {
    e.preventDefault();
    navigate(prevUrl, 'back');
  }

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="lesson-page">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{lesson && lesson.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {lesson && userLesson && page &&
        <IonContent fullscreen={true}>
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Page {idx+1} of {lesson.pages.length}</IonCardSubtitle>
              <h2>{page.title}</h2>
            </IonCardHeader>
            <IonCardContent class='lesson-text'>
              <div dangerouslySetInnerHTML={{__html: page.text}}></div>
              {page.photo && <img src={page.photo} crossOrigin='anonymous' onClick={openModal} alt={page.title + ' photo'}/>}
              {page.video && <VideoPlayer id={`video-${lesson.id}-${idx}`} src={page.video} setVideoPlayer={setVideoPlayer} setVideoState={setVideoState} />}
            </IonCardContent>
          </IonCard>
          {page.photo && <ImageZoomModal showModal={showModal} closeModal={closeModal} image={page.photo || ''} title={page.title} />}
        </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" onClick={handlePrev}>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary" onClick={handleNext}>{t('buttons.next')}</IonButton>
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
    page: selectors.getLessonPage(state, ownProps),
    idx: selectors.getPageIdx(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: LessonPagePage
});
