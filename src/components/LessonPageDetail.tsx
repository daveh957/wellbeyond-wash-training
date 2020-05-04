import React, {useEffect, useState} from 'react';
import { Subject, Lesson, LessonPage } from '../models/Training';
import {
  IonCard,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonCardContent,
  IonSlide,
  IonButton,
  IonHeader,
  IonSlides, IonContent
} from '@ionic/react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import VideoPlayer from "./VideoPlayer";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import LessonIntro from "./LessonIntro";


interface LessonPageDetailProps {
  subject: Subject,
  lesson: Lesson;
  page: LessonPage;
  pageNum: number;
  pageCount: number;
  skipVideo?: boolean;
  next(): void;
}

const LessonPageDetail: React.FC<LessonPageDetailProps> = ({ subject,lesson, page, pageNum, pageCount, skipVideo, next}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [videoViewed, setVideoViewed] = useState();
  const [showNext, setShowNext] = useState();
  const [videoState, setVideoState] = useState();

  const slideOpts = {
    zoom: {
      maxRatio: 2
    }
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
    <IonCard>
      <IonCardHeader>
        <h2>{page.title}</h2>
      </IonCardHeader>
      <IonCardContent class='lesson-text'>
        <div dangerouslySetInnerHTML={{__html: page.text}}></div>
        {page.photo ?
          <IonSlides options={slideOpts} >
            <IonSlide className='lesson-photo-slide'>
              <div className='swiper-zoom-container'>
                <img src={page.photo} crossOrigin='anonymous'>
                </img>
              </div>
            </IonSlide>
          </IonSlides>
          : undefined}
        {page.video ?
          <VideoPlayer id={`video-${lesson.id}-${pageNum}`} src={page.video} setVideoState={setVideoState} />
          : undefined}
        <IonButton expand='block' disabled={!showNext} onClick={next}>{t('buttons.next')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonPageDetail;
