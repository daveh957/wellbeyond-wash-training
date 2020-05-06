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
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import VideoPlayer from "./VideoPlayer";
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
  const [showModal, setShowModal] = useState();
  const [videoState, setVideoState] = useState();
  const [videoPlayer, setVideoPlayer] = useState();
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
    <Fragment>
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
      <IonModal isOpen={showModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={closeModal}>
                {t('buttons.close')}
              </IonButton>
            </IonButtons>
            <IonTitle>{t('resources.lessons.imageZoom')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <TransformWrapper
            defaultScale={1}
          >
            {({ zoomIn, zoomOut, resetTransform }:any) => (
              <React.Fragment>
                <div className="tools">
                  <IonButton onClick={zoomIn} color='medium'>+</IonButton>
                  <IonButton onClick={zoomOut} color='medium'>-</IonButton>
                  <IonButton onClick={resetTransform} color='medium'>x</IonButton>
                </div>
                <TransformComponent>
                  <div style={{padding: '100px 0 300px 0'}}>
                    <img src={page.photo} alt={page.title + ' photo'} crossOrigin='anonymous'/>
                  </div>
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>
        </IonContent>
      </IonModal>
    </Fragment>
  );
};

export default LessonPageDetail;
