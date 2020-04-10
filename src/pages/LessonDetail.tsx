import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';

import './LessonDetail.scss';

import { IonHeader, IonLabel, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonPage } from '@ionic/react'

import { connect } from '../data/connect';
import * as selectors from '../data/selectors';

import { Subject, Lesson, LessonPage } from '../models/Lesson';

interface OwnProps extends RouteComponentProps {
  subject?: Subject;
  lesson?: Lesson;
};

interface StateProps {};

interface DispatchProps {};

interface LessonDetailProps extends OwnProps, StateProps, DispatchProps {};

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson }) => {

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  return (
    <IonPage id="lesson-detail">
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/subjects/{subject.id}" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <div className="lesson-background">
          <h2>{lesson.name}</h2>
        </div>

        <div className="ion-padding lesson-detail">
          <p>{lesson.description}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};


export default connect({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps)
  }),
  component: LessonDetail
});
