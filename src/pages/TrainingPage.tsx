import React, { useState, useRef } from 'react';

import { IonToolbar, IonContent, IonPage, IonButtons, IonTitle, IonMenuButton, IonHeader, useIonViewWillEnter } from '@ionic/react';

import './TrainingPage.scss'

import { setMenuEnabled } from '../data/lessons/lesson.actions';
import * as selectors from '../data/selectors';
import { connect } from '../data/connect';
import { Subject } from '../models/Lesson';

interface OwnProps {
}

interface StateProps {
  subjects: Subject[]
}

interface DispatchProps {
  setMenuEnabled: typeof setMenuEnabled;
}

type TrainingPageProps = OwnProps & StateProps & DispatchProps;

const TrainingPage: React.FC<TrainingPageProps> = ({ subjects, setMenuEnabled}) => {

  const pageRef = useRef<HTMLElement>(null);

  return (
    <IonPage ref={pageRef} id="training-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Subjects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>

      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    subjects: selectors.getSubjects(state)
  }),
  component: React.memo(TrainingPage)
});
