import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import { getPublicId} from "../util/cloudinary";


interface LessonItemProps {
  subject: Subject,
  lesson: Lesson;
}

const LessonItem: React.FC<LessonItemProps> = ({ subject,lesson}) => {
  return (
      <IonCard className="lesson-card">
          <IonCardHeader>
            <IonItem button detail={false} lines="none" className="lesson-item" routerLink={`/tabs/subjects/${subject.id}/lessons/${lesson.id}`}>
              <IonLabel>
                <h2>{lesson.name}</h2>
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <IonCardContent>
            <IonItem button detail={false} lines="none" className="lesson-item" routerLink={`/tabs/subjects/${subject.id}/lessons/${lesson.id}`}>
              <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
                <Image publicId={getPublicId(lesson.photo)}>
                  <Transformation width="400" crop="scale" />
                  <Transformation overlay={{fontFamily: "helvetica", fontSize: 100, fontWeight: "bold", text: "Completed"}} gravity="north" y="20" angle="-45" color="#cccccc" opacity="50" />
                </Image>
              </CloudinaryContext>
              </IonItem>
          </IonCardContent>
      </IonCard>
  );
};

export default LessonItem;
