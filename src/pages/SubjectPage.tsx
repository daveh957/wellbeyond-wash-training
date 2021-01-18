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
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import SelfTraining from "../components/SelfTraining";
import TrainingSessionItem from "../components/TrainingSessionItem";
import {Organization} from "../models/User";
import {TrainingSessions} from "../data/training/training.state";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  trainingSessions?: TrainingSessions;
  userId?: string;
  organization?: Organization;
  community?: string;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, trainingSessions, userId, organization, community}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [canTeach, setCanTeach] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<any>();
  const [activeSessions, setActiveSessions] = useState<any>();
  const [selfTrainingSession, setSelfTrainingSession] = useState<any>();

  useEffect(() => {
    if (subject && lessons) {
      // For now, let anyone teach the subject
      setCanTeach(true);
      i18n.changeLanguage(subject.locale || 'en');
    }

  }, [subject, lessons]);

  useEffect(() => {
    if (trainingSessions) {
      const values = Object.values(trainingSessions).filter((s) => s.subjectId === subject.id);
      if (values.length) {
        // @ts-ignore
        const selfTrainingSession = values.find((s) => s.groupType === 'self');
        const activeSessions = values.filter((s) => !s.completed && s.groupType !== 'self');
        const completedSessions = values.filter((s) => !!s.completed && s.groupType !== 'self');
        // @ts-ignore
        setActiveSessions(activeSessions.length ? activeSessions.sort((a,b) => (a && b && a.started < b.started) ? 1 : -1) : undefined);
        // @ts-ignore
        setCompletedSessions(completedSessions.length ? completedSessions.sort((a,b) => (a && b && a.started < b.started) ? 1 : -1) : undefined);
        setSelfTrainingSession(selfTrainingSession);
      }
      else {
        setActiveSessions(undefined);
        setCompletedSessions(undefined);
      }
    }

  }, [subject, trainingSessions]);


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
          {canTeach &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <h2>{t('training.headers.trainOthers')}</h2>
                  <h3><em>{t('training.headers.trainOthersSub')}</em></h3>
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

          <SelfTraining session={selfTrainingSession} subject={subject} lessons={lessons} />
        </IonContent>
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    trainingSessions: selectors.getTrainingSessions(state),
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: SubjectPage
});

