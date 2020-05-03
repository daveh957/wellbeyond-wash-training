import React, { useState, useRef } from 'react';

import { IonToolbar, IonContent, IonPage, IonButtons, IonTitle, IonMenuButton, IonHeader, IonList, IonItemGroup, IonItemDivider, IonLabel, IonListHeader, IonLoading } from '@ionic/react';

import './TrainingPage.scss'

import { useTranslation } from "react-i18next";
import i18n from '../i18n';
import * as selectors from '../data/selectors';
import { connect } from '../data/connect';
import { Subject, Lesson } from '../models/Training';
import SubjectItem from "../components/SubjectItem";
import {Redirect} from "react-router-dom";

interface OwnProps {
}

interface StateProps {
  subjects: Subject[],
  lessons: Lesson[],
  isLoggedIn?: boolean,
}

interface DispatchProps {
}

type TrainingPageProps = OwnProps & StateProps & DispatchProps;

const TrainingPage: React.FC<TrainingPageProps> = ({ subjects, lessons, isLoggedIn}) => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );
  const filteredSubjects = subjects ? subjects.filter(subject => subject.name && !subject.name.match(/test/i)) : [];

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  if (filteredSubjects.length === 1) {
    return <Redirect to={`/tabs/subjects/${filteredSubjects[0].id}`} />
  }

  return (subjects ?
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
        {filteredSubjects.length ?
          (<IonList>
            {filteredSubjects.map((subject, index: number) => (
              <IonItemGroup key={`subject-${index}`}>
                <IonItemDivider sticky>
                  <SubjectItem subject={subject} />
                </IonItemDivider>
              </IonItemGroup>))
            }
          </IonList>)
        :
          <IonLoading
            isOpen={!subjects}
            message={'Please wait...'}
            duration={5000}
          />
        }
      </IonContent>
    </IonPage> : null
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    subjects: selectors.getSubjects(state),
    lessons: selectors.getLessons(state),
    isLoggedIn: state.user.isLoggedIn
  }),
  component: React.memo(TrainingPage)
});
