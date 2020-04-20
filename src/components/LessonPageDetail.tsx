import React from 'react';
import { Subject, Lesson, LessonPage } from '../models/Training';
import {IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent, IonSlide} from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import VideoPlayer from "./VideoPlayer";


interface LessonPageDetailProps {
  subject: Subject,
  lesson: Lesson;
  page: LessonPage;
  idx: number;
}

const LessonPageDetail: React.FC<LessonPageDetailProps> = ({ subject,lesson, page, idx}) => {
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
          <VideoPlayer id={`video-${lesson.id}-${idx}`} src={page.video}  />
          : undefined}
      </IonCardContent>
    </IonCard>
  );
};

export default LessonPageDetail;
