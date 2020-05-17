import React, {useEffect, useState} from 'react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel} from '@ionic/react';
import {getLessonIconUrl} from "../util/cloudinary";

interface LessonItemProps {
  subject: Subject;
  lesson: Lesson;
  activeSession?: TrainingSession;
  completed: boolean;
  clickable: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ subject,lesson, activeSession, completed, clickable}) => {

  const [lessonIcon, setLessonIcon] = useState();
  useEffect(() => {
    if (lesson && lesson.photo) {
      setLessonIcon(getLessonIconUrl(lesson.photo, completed));
    }
  },[lesson, completed]);

  const makeLink = () => {
    return '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id + '/intro' + (activeSession && activeSession.id ? ('?tsId=' + activeSession.id) : '');
  }

  return (
      <IonCard className="lesson-card">
          <IonCardHeader>
            <IonItem button detail={false} lines="none" className="lesson-item" disabled={!clickable} routerLink={makeLink()}>
              <IonLabel>
                <h2>{lesson.name}</h2>
              </IonLabel>
            </IonItem>
          </IonCardHeader>

          <IonCardContent>
            <IonItem button detail={false} lines="none" className="lesson-item" disabled={!clickable} routerLink={makeLink()}>
              <img src={lessonIcon} crossOrigin='anonymous' alt={lesson.name} />
            </IonItem>
          </IonCardContent>
      </IonCard>
  );
};

export default LessonItem;
