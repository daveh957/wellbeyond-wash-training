import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {UserLessons} from '../data/user/user.state';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {TrainingSessions} from "../data/training/training.state";
import SelfTraining from "../components/SelfTraining";
import TrainingSessionItem from "../components/TrainingSessionItem";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  userLessons?: UserLessons;
  trainingSessions?: TrainingSessions;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, userLessons, trainingSessions}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [finishedTraining, setFinishedTraining] = useState();
  const [canTeach, setCanTeach] = useState();
  const [completedSessions, setCompletedSessions] = useState();
  const [activeSessions, setActiveSessions] = useState();

  useEffect(() => {
    if (subject && lessons && userLessons) {
      const finishedTraining = lessons.every((l) => {
        return !!(userLessons[l.id] && userLessons[l.id].completed);
      });
      setFinishedTraining(finishedTraining);
      // For now, let anyone teach the subject
      setCanTeach(true);
    }

  }, [subject, lessons, userLessons]);

  useEffect(() => {
    if (trainingSessions) {
      const values = Object.values(trainingSessions);
      if (values.length) {
        // @ts-ignore
        const activeSessions = values.filter((s) => !s.completed);
        const completedSessions = values.filter((s) => !!s.completed);
        // @ts-ignore
        setActiveSessions(activeSessions.length ? activeSessions.sort((a,b) => (a && b && a.started < b.started) ? 1 : -1) : undefined);
        // @ts-ignore
        setCompletedSessions(completedSessions.length ? completedSessions.sort((a,b) => (a && b && a.started < b.started) ? 1 : -1) : undefined);
      }
      else {
        setActiveSessions(undefined);
        setCompletedSessions(undefined);
      }
    }

  }, [trainingSessions]);


  return (
    <IonPage id="subject-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{subject ? subject.name : t('resources.subjects.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { subject &&
        <IonContent fullscreen={true}>
          <SelfTraining finishedTraining={finishedTraining} subject={subject} lessons={lessons} userLessons={userLessons} />
          {canTeach &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <h2>{t('training.headers.trainOthers')}</h2>
                </IonCardTitle>
                {(activeSessions || completedSessions) &&
                  <IonCardSubtitle>
                    <em>{t('training.messages.swipeInstructions')}</em>
                  </IonCardSubtitle>
                }
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {
                    activeSessions && activeSessions.map((ts: TrainingSession) => {
                      return (
                        <TrainingSessionItem subject={subject} lessons={lessons} session={ts} key={ts.id}/>
                      )
                    })
                  }
                  {
                    completedSessions && completedSessions.map((ts: TrainingSession) => {
                      return (
                        <TrainingSessionItem subject={subject} lessons={lessons} session={ts} key={ts.id}/>
                      )
                    })
                  }
                </IonList>
                <IonRow>
                  <IonCol>
                    <IonButton expand="block" fill="solid" color="primary" routerLink={`/tabs/subjects/${subject.id}/start`}>{t('training.buttons.startNewSession')}</IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          }
        </IonContent>
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    userLessons: selectors.getUserLessons(state),
    trainingSessions: selectors.getTrainingSessions(state),
  }),
  component: SubjectPage
});

