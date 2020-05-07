import React, {Fragment, useEffect, useState,} from 'react';
import {Lesson, LessonPage, Subject} from '../models/Training';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import VideoPlayer from "./VideoPlayer";
import ImageZoomModal from "./ImageZoomModal";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import '../pages/LessonPage.scss';


interface LessonPageDetailProps {
  subject: Subject,
  lesson: Lesson;
  page: LessonPage;
  pageNum: number;
  pageCount: number;
  skipVideo?: boolean;
  trainerMode?: boolean;
  next(): void;
}

const LessonPageDetail: React.FC<LessonPageDetailProps> = ({ lesson, page, pageNum, skipVideo, next}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [videoViewed, setVideoViewed] = useState();
  const [showNext, setShowNext] = useState();
  const [videoState, setVideoState] = useState();
  const [videoPlayer, setVideoPlayer] = useState();
  const [showModal, setShowModal] = useState();
  const openModal = () => {setShowModal(true)};
  const closeModal = () => {setShowModal(false)};

  const nextSlide = () => {
    if (videoPlayer) {
      videoPlayer.pause();
    }
    next();
  };

  useEffect(() => {
    if (page) {
      setShowNext(true);
    }
  }, [page, videoViewed, skipVideo]);
  useEffect(() => {
    if (videoState) {
      if (videoState.ended) {
        setVideoViewed(true);
      }
      if (videoState.currentTime > 0 && videoState.duration > 0 && (videoState.currentTime / videoState.duration) > 0.8) {
        setVideoViewed(true);
      }
    }
  }, [videoState]);

  return (
    page && <Fragment>
      <IonCard>
        <IonCardHeader>
          <h2>{page.title}</h2>
        </IonCardHeader>
        <IonCardContent class='lesson-text'>
          <div dangerouslySetInnerHTML={{__html: page.text}}></div>
          {page.photo && <img src={page.photo} crossOrigin='anonymous' onClick={openModal} alt={page.title + ' photo'}/>}
          {page.video && <VideoPlayer id={`video-${lesson.id}-${pageNum}`} src={page.video} setVideoPlayer={setVideoPlayer} setVideoState={setVideoState} />}
          <IonButton expand='block' disabled={!showNext} onClick={nextSlide}>{t('buttons.next')}</IonButton>
        </IonCardContent>
      </IonCard>
      {page.photo && <ImageZoomModal showModal={showModal} closeModal={closeModal} image={page.photo || ''} title={page.title} />}
    </Fragment>
  );
};

export default LessonPageDetail;
