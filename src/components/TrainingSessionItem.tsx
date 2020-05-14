import React, {useEffect, useState} from 'react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader, IonCardTitle, IonCol,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel, IonList, IonRow, IonText
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface LessonItemProps {
  subject: Subject;
  lessons: Lesson[];
  session: TrainingSession;
}

const TrainingSessionItem: React.FC<LessonItemProps> = ({ subject, lessons, session}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [resumeLink, setResumeLink] = useState();
  const [lessonsStarted, setLessonsStarted] = useState();
  const [lessonsCompleted, setLessonsCompleted] = useState();
  const [sessionCompleted, setSessionCompleted] = useState();
  const [nextLesson, setNextLesson] = useState();

  useEffect(() => {
    if (subject && lessons && session) {
      const nextLesson = lessons.find((l) => (session.lessons && session.lessons[l.id] && !session.lessons[l.id].completed));
      const lessonsStarted = lessons.reduce((count, l) => {
        return count + ((session.lessons && session.lessons[l.id] && session.lessons[l.id].started) ? 1 : 0);
      }, 0);
      const lessonsCompleted = lessons.reduce((count, l) => {
        return count + ((session.lessons && session.lessons[l.id] && session.lessons[l.id].completed) ? 1 : 0);
      }, 0);
      setLessonsStarted(lessonsStarted);
      setLessonsCompleted(lessonsCompleted);
      if (lessonsCompleted === lessons.length) {
        setNextLesson(undefined);
        setResumeLink(undefined);
        setSessionCompleted(true);
      }
      else {
        setNextLesson(nextLesson);
        setResumeLink((nextLesson ? ('/tabs/subjects/' + subject.id + '/lessons/' + nextLesson.id + '/intro') : ('/tabs/subjects/' + subject.id + '/progress')) + '?tsId=' + session.id);
        setSessionCompleted(false);
      }
    }
  }, [subject, lessons, session]);

  return subject && lessons && session && (
        <IonCard>
          <IonCardContent>
              {sessionCompleted ? (
                <IonText>
                  {t('training.messages.fullyComplete',{subject: subject.name })}
                </IonText>
              ) : (
                <IonText>
                  {t('training.messages.partiallyComplete',{completed: lessonsCompleted, count: lessons.length, subject: subject.name })}
                </IonText>
              )}
            <IonRow>
              <IonCol>
                <IonText>

                </IonText>
              </IonCol>
              <IonCol>
                <IonButton expand="block" fill="solid" color="primary" routerLink={resumeLink}>
                  {t('training.buttons.'+ (sessionCompleted ? 'reviewTraining' : (lessonsStarted ? 'resumeTraining' : 'startTraining')))}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
  );
};

export default TrainingSessionItem;
