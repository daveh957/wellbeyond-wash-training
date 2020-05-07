import React, {useEffect, useState} from 'react';
import {Lesson, Subject} from '../models/Training';
import {IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel} from '@ionic/react';
import {getLessonIconUrl} from "../util/cloudinary";


interface LessonItemProps {
  subject: Subject,
  lesson: Lesson;
  completed: boolean;
  clickable: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ subject,lesson, completed, clickable}) => {

  const [lessonIcon, setLessonIcon] = useState();
  useEffect(() => {
    if (lesson && lesson.photo) {
      setLessonIcon(getLessonIconUrl(lesson.photo, completed));
    }
  },[lesson, completed]);

  return (
      <IonCard className="lesson-card">
          <IonCardHeader>
            <IonItem button detail={false} lines="none" className="lesson-item" disabled={!clickable} routerLink={`/tabs/subjects/${subject.id}/lessons/${lesson.id}/intro`}>
              <IonLabel>
                <h2>{lesson.name}</h2>
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <IonCardContent>
            <IonItem button detail={false} lines="none" className="lesson-item" disabled={!clickable} routerLink={`/tabs/subjects/${subject.id}/lessons/${lesson.id}/intro`}>
              <img src={lessonIcon} crossOrigin='anonymous' />
            </IonItem>
          </IonCardContent>
      </IonCard>
  );
};

export default LessonItem;
