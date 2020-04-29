import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";


interface LessonSummaryProps {
  subject: Subject,
  lesson: Lesson;
}

const LessonSummary: React.FC<LessonSummaryProps> = ({ subject,lesson}) => {
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
            <Image publicId={lesson.photo}>
              <Transformation overlay={{fontFamily: "Arial", fontSize: 100, text: "Completed"}} />
            </Image>
          </CloudinaryContext>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonSummary;
