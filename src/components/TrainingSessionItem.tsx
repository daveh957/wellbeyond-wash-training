import React, {useEffect, useState} from 'react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel} from '@ionic/react';


interface LessonItemProps {
  subject: Subject;
  lessons: Lesson[];
  session: TrainingSession;
}

const TrainingSessionItem: React.FC<LessonItemProps> = ({ subject, lessons,session}) => {

  const [resumeLink, setResumeLink] = useState();

  useEffect(() => {
    if (subject && lessons && session) {
        const nextLesson = lessons.find((l) => (session.lessons && session.lessons[l.id] && !session.lessons[l.id].completed));
        setResumeLink((nextLesson ? ('/tabs/subjects/' + subject.id + '/lessons/' + nextLesson.id + '/intro') : ('/tabs/subjects/' + subject.id + '/progress'))  + '?tsId=' + session.id)
    }
  }, [subject, lessons, session]);

  return (
    <IonCard className="lesson-card">
      <IonCardHeader>
        <IonItem button detail={false} lines="none" className="session-item" routerLink={resumeLink}>
          <IonLabel>
            <h2>{subject.name}</h2>
          </IonLabel>
        </IonItem>
      </IonCardHeader>

      <IonCardContent>
        <IonItem button detail={false} lines="none" className="session-item" routerLink={resumeLink}>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default TrainingSessionItem;
