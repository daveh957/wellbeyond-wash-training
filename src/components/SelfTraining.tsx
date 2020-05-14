import React, {useEffect, useState} from 'react';
import {Lesson, Subject} from '../models/Training';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader, IonCardTitle, IonCol,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader, IonRow
} from '@ionic/react';
import {UserLessons} from "../data/user/user.state";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface SelfTrainingProps {
  finishedTraining: boolean;
  subject: Subject;
  lessons: Lesson[];
  userLessons?: UserLessons;
}

const SelfTraining: React.FC<SelfTrainingProps> = ({ finishedTraining, subject,lessons, userLessons}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [resumeLink, setResumeLink] = useState();
  const [lessonsStarted, setLessonsStarted] = useState();
  const [lessonsCompleted, setLessonsCompleted] = useState();
  const [nextLesson, setNextLesson] = useState();

  useEffect(() => {
    if (subject && lessons && userLessons) {
      if (finishedTraining) {
        setResumeLink('/tabs/subjects/' + subject.id + '/progress');
        setLessonsCompleted(lessons.length);
      }
      else {
        const nextLesson = lessons.find((l) => {
          return (userLessons[l.id] && !userLessons[l.id].completed);
        });
        const lessonsStarted = lessons.reduce((count, l) => {
          return count + ((userLessons[l.id] && userLessons[l.id].started) ? 1 : 0);
        }, 0);
        const lessonsCompleted = lessons.reduce((count, l) => {
          return count + ((userLessons[l.id] && userLessons[l.id].completed) ? 1 : 0);
        }, 0);
        setNextLesson(nextLesson);
        setResumeLink(nextLesson ? ('/tabs/subjects/' + subject.id + '/lessons/' + nextLesson.id + '/intro') : ('/tabs/subjects/' + subject.id + '/progress'));
        setLessonsStarted(lessonsStarted);
        setLessonsCompleted(lessonsCompleted);
      }
    }
  }, [finishedTraining, subject, lessons, userLessons]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <h2>{t('training.headers.yourTraining')}</h2>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {finishedTraining ? (
            <IonItem>
              {t('training.messages.fullyComplete',{subject: subject.name })}
            </IonItem>
          ) : (
            <IonItem>
              {t('training.messages.partiallyComplete',{completed: lessonsCompleted, count: lessons.length, subject: subject.name })}
            </IonItem>
          )}
        </IonList>
        <IonRow>
          <IonCol>
            <IonButton expand="block" fill="solid" color="primary" routerLink={resumeLink}>
              {t('training.buttons.'+ (finishedTraining ? 'reviewTraining' : (lessonsStarted ? 'resumeTraining' : 'startTraining')))}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default SelfTraining;
