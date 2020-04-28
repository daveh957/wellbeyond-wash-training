import React, {useEffect, useState} from 'react';
import { Subject, Lesson, LessonPage } from '../models/Training';
import {IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent, IonSlide, IonButton} from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import VideoPlayer from "./VideoPlayer";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface LessonPageDetailProps {
  subject: Subject,
  lesson: Lesson;
  page: LessonPage;
  idx: number;
  unlock(): void;
  prev(): void;
  next(): void;
}

const LessonPageDetail: React.FC<LessonPageDetailProps> = ({ subject,lesson, page, idx, unlock, prev, next}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [videoViewed, setVideoViewed] = useState();
  const [showNext, setShowNext] = useState();
  const [videoState, setVideoState] = useState();
  useEffect(() => {
    if (page && (videoViewed || !page.video)) {
      setShowNext(true);
      unlock();
    }
  }, [page, videoViewed]);
  useEffect(() => {
    if (videoState) {
      if (videoState.ended) {
        setVideoViewed(true);
      }
      if (videoState.currentTime > 0 && videoState.duration > 0 && (videoState.duration / videoState.currentTime) < 2) {
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
          <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
            <Image publicId={page.photo}>
            </Image>
          </CloudinaryContext>
          : undefined}
        {page.video ?
          <VideoPlayer id={`video-${lesson.id}-${idx}`} src={page.video} setVideoState={setVideoState}  />
          : undefined}
        <IonButton expand='block' disabled={!showNext} onClick={next}>{t('buttons.next')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonPageDetail;
