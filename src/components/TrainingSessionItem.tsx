import React, {useEffect, useState} from 'react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader, IonCardTitle, IonCol, IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel, IonNote, IonText
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {connect} from "../data/connect";
import {updateUserLesson} from "../data/user/user.actions";
import {archiveTrainingSession, updateTrainingLesson} from "../data/training/training.actions";
import * as selectors from "../data/selectors";

interface DispatchProps {
  archiveTrainingSession: typeof archiveTrainingSession
}

interface LessonItemProps extends DispatchProps {
  subject: Subject;
  lessons: Lesson[];
  session: TrainingSession;
}

const TrainingSessionItem: React.FC<LessonItemProps> = ({ subject, lessons, session, archiveTrainingSession}) => {

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

  const archiveSession = () => {
    archiveTrainingSession(session);
  }

  return subject && lessons && session && (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="danger" onClick={archiveSession}>{t('training.buttons.archiveSession')}</IonItemOption>
      </IonItemOptions>
      <IonItem>
        <IonLabel className="ion-text-wrap">
          {sessionCompleted ?
            <h2>{t('training.messages.sessionCompletedAt',{date: session.completed })}</h2>
              :
            <h2>{t('training.messages.sessionStartedAt',{date: session.started })}</h2>
          }
          <p> {t('training.messages.sessionDescription',{type: session.groupType, size: session.groupSize })}</p>
        </IonLabel>
        <IonNote slot={'end'}>
          {session.completed ?
            <IonIcon></IonIcon> :
            <IonText>{'' + lessonsCompleted + ' / ' + lessons.length}</IonText>
          }
        </IonNote>
      </IonItem>
      {!sessionCompleted &&
        <IonItemOptions side="end">
          <IonItemOption color="primary" routerLink={resumeLink}>{t('training.buttons.resumeSession')}</IonItemOption>
        </IonItemOptions>
      }
    </IonItemSliding>
  );
};

export default connect({
  mapDispatchToProps: {
    archiveTrainingSession
  },
  component: TrainingSessionItem
});
