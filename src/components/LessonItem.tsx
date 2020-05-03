import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { UserLesson } from '../models/User';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import { getPublicId} from "../util/cloudinary";


interface LessonItemProps {
  subject: Subject,
  lesson: Lesson;
  completed: boolean;
  clickable: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ subject,lesson, completed, clickable}) => {
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
            <IonItem button detail={false} lines="none" className="lesson-item" disabled={!clickable} routerLink={`/tabs/subjects/${subject.id}/lessons/${lesson.id}?completed=${completed}`}>
              <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
                <Image publicId={getPublicId(lesson.photo)} crossorigin='anonymous'>
                  <Transformation width="400" crop="scale" />
                  {completed && <Transformation overlay={{fontFamily: "helvetica", fontSize: 100, fontWeight: "bold", text: "Completed"}} gravity="north" y="20" angle="-45" color="#999999" opacity="50" />}
                </Image>
              </CloudinaryContext>
              </IonItem>
          </IonCardContent>
      </IonCard>
  );
};

export default LessonItem;
