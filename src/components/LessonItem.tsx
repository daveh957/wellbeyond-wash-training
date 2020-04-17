import React from 'react';
import { Lesson } from '../models/Training';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";


interface LessonItemProps {
  lesson: Lesson;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson}) => {
  return (
    <>
      <IonCard className="lesson-card">
        <IonCardHeader>
          <IonItem button detail={false} lines="none" className="lesson-item" routerLink={`/tabs/lessons/${lesson.id}`}>
            <IonLabel>
              <h2>{lesson.name}</h2>
            </IonLabel>
          </IonItem>
        </IonCardHeader>

        <IonCardContent>
          <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
            <Image publicId={lesson.photo}>
            </Image>
          </CloudinaryContext>
          <p>{lesson.description}</p>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default LessonItem;
