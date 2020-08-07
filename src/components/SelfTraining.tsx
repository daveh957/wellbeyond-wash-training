import React, {useContext, useEffect, useState} from 'react';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonItem,
  IonList,
  IonRow, NavContext
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Organization} from "../models/User";
import {startTrainingSession} from "../data/user/user.actions";
import {connect} from "../data/connect";
import * as selectors from "../data/selectors";

interface OwnProps {
  subject: Subject;
  lessons: Lesson[];
  session?: TrainingSession;
}

interface StateProps {
  userId?: string;
  organization?: Organization;
  community?: string;
}

interface DispatchProps {
  startTrainingSession: typeof startTrainingSession;
}

interface SelfTrainingProps extends OwnProps, StateProps, DispatchProps { }

const SelfTraining: React.FC<SelfTrainingProps> = ({ subject,lessons, session, userId, organization, community, startTrainingSession}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [lessonsCompleted, setLessonsCompleted] = useState<number>(0);
  const [startedTraining, setStartedTraining] = useState<boolean>();
  const [finishedTraining, setFinishedTraining] = useState<boolean>();

  const resumeTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      if (finishedTraining) {
        navigate('/tabs/subjects/' + subject.id + '/progress?tsId=' + session.id);
      }
      else {
        const nextLesson = lessons.find((l) => (session.lessons && session.lessons[l.id] && !session.lessons[l.id].completed));
        navigate((nextLesson ? ('/tabs/subjects/' + subject.id + '/lessons/' + nextLesson.id + '/intro') : ('/tabs/subjects/' + subject.id + '/progress')) + '?tsId=' + session.id);
      }
    }
    else {
      const session:TrainingSession = {
        subjectId: subject.id,
        userId: userId || '',
        organizationId: organization && organization.id,
        organization: organization && organization.name,
        community: community,
        started: new Date(),
        archived: false,
        name: '',
        groupType: 'self',
        groupSizeNum: 1,
        lessons: {}
      };
      session.id = userId + ':' + session.subjectId + ':' + (session.started && session.started.getTime());
      lessons.forEach((l) => {
        if (session.lessons && l.id) {
          session.lessons[l.id] = {
            id: l.id,
            lessonId: l.id,
            answers: [],
            pageViews: []
          };
        }
      });
      startTrainingSession(session);
      navigate('/tabs/subjects/' + subject.id + '/progress?tsId=' + session.id);
    }
  }

  useEffect(() => {
    if (subject && lessons) {
      if (session) {
        setStartedTraining(true);
        const lessonsCompleted = lessons.reduce((count, l) => {
          return count + ((session.lessons && session.lessons[l.id] && session.lessons[l.id].completed) ? 1 : 0);
        }, 0);
        setLessonsCompleted(lessonsCompleted);
        if (lessonsCompleted === lessons.length) {
          setFinishedTraining(true);
        }
        else {
          setFinishedTraining(false);
        }
      }
    }
  }, [subject, lessons, session]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <h2>{t('training.headers.yourTraining')}</h2>
          <h3><em>{t('training.headers.yourTrainingSub')}</em></h3>
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
            <IonButton expand="block" fill="solid" color="primary"  onClick={resumeTraining}>
              {t('training.buttons.'+ (finishedTraining ? 'reviewTraining' : (startedTraining ? 'resumeTraining' : 'startTraining')))}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    startTrainingSession
  },
  mapStateToProps: (state) => ({
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: SelfTraining
});
