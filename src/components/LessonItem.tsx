import React from 'react';
import { Lesson } from '../models/Lesson';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';


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
          <p>{lesson.description}</p>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default LessonItem;
