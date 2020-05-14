import React, {useContext, useEffect, useState, Fragment} from 'react';
import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader, IonItemDivider, IonItemGroup, IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar, NavContext, IonButton, IonItem, IonListHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent
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
import {startTrainingSession} from "../data/training/training.actions";
import SelfTraining from "../components/SelfTraining";
import SubjectItem from "../components/SubjectItem";
import TrainingSessionItem from "../components/TrainingSessionItem";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  userId?: string;
  userLessons?: UserLessons;
  trainingSessions?: TrainingSessions;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, userId, userLessons, trainingSessions}) => {

  const {navigate} = useContext(NavContext);
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
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {activeSessions &&
                    <Fragment>
                      <IonListHeader><h3>Active Training Sessions</h3></IonListHeader>
                      {
                        activeSessions.map((ts: TrainingSession) => {
                          return (
                            <TrainingSessionItem subject={subject} lessons={lessons} session={ts} />
                          )
                        })
                      }
                    </Fragment>
                  }
                  {completedSessions &&
                    <Fragment>
                      <IonListHeader><h3>Completed Training Sessions</h3></IonListHeader>
                      {
                        completedSessions.map((ts: TrainingSession) => {
                          return (
                            <TrainingSessionItem subject={subject} lessons={lessons} session={ts} />
                          )
                        })
                      }
                    </Fragment>
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
    userId: selectors.getUserId(state),
    userLessons: selectors.getUserLessons(state),
    trainingSessions: selectors.getTrainingSessions(state),
  }),
  component: SubjectPage
});

