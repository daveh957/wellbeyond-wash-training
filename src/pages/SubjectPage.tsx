import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import LessonItem from '../components/LessonItem';
import { Subject, Lesson } from '../models/Lesson';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";

interface OwnProps extends RouteComponentProps {
  subject?: Subject;
  lessons?: Lesson[];
};

interface StateProps {
};

interface DispatchProps { };

interface SubjectProps extends OwnProps, StateProps, DispatchProps { };

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons }) => {

  return (
    <IonPage id="lesson-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Lessons</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Lessons</IonTitle>
          </IonToolbar>
        </IonHeader>

          <IonGrid fixed>
            <IonRow>
              {lessons && lessons.map(lesson => (
                <IonCol size="12" size-md="6" key={lesson.id}>
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps)
  }),
  component: SubjectPage
});

