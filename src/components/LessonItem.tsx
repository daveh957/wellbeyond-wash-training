import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import { getLessonIconUrl} from "../util/cloudinary";


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
              <img src={getLessonIconUrl(lesson.photo, completed)} crossOrigin='anonymous' />
            </IonItem>
          </IonCardContent>
      </IonCard>
  );
};

export default LessonItem;
