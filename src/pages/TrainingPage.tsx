import React, { useState, useRef } from 'react';

import { IonToolbar, IonContent, IonPage, IonButtons, IonTitle, IonMenuButton, IonHeader, IonList, IonItemGroup, IonItemDivider, IonLabel, IonListHeader } from '@ionic/react';

import './TrainingPage.scss'

import * as selectors from '../data/selectors';
import { connect } from '../data/connect';
import { Subject, Lesson } from '../models/Training';
import SubjectItem from "../components/SubjectItem";

interface OwnProps {
}

interface StateProps {
  subjects: Subject[],
  lessons: Lesson[]
}

interface DispatchProps {
}

type TrainingPageProps = OwnProps & StateProps & DispatchProps;

const TrainingPage: React.FC<TrainingPageProps> = ({ subjects, lessons}) => {

  const pageRef = useRef<HTMLElement>(null);

  return (
    <IonPage ref={pageRef} id="subject-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Subjects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        {subjects.length ?
          (<IonList>
            {subjects.filter(subject => subject.name && !subject.name.match(/test/i)).map((subject, index: number) => (
              <IonItemGroup key={`subject-${index}`}>
                <IonItemDivider sticky>
                  <SubjectItem subject={subject} />
                </IonItemDivider>
              </IonItemGroup>))
            }
          </IonList>)
        :
          <IonList>
            <IonListHeader>
              No Subjects Found
            </IonListHeader>
          </IonList>
        }
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    subjects: selectors.getSubjects(state),
    lessons: selectors.getLessons(state)
  }),
  component: React.memo(TrainingPage)
});
