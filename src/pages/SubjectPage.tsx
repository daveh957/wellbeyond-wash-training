import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import LessonItem from '../components/LessonItem';
import { Subject, Lesson } from '../models/Training';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";
import { useTranslation } from "react-i18next";
import i18n from '../i18n';
import {Redirect} from "react-router-dom";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
};

interface StateProps {
  isLoggedIn?: boolean;
};

interface DispatchProps { };

interface SubjectProps extends OwnProps, StateProps, DispatchProps { };

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, isLoggedIn}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="lesson-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{subject ? subject.name : t('resources.subjects.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { subject ?
        <IonContent fullscreen={true}>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{subject.name}</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonGrid fixed>
            <IonRow>
              {lessons && lessons.map(lesson => (
                <IonCol size="6" key={lesson.id}>
                  <LessonItem
                    key={lesson.id}
                    subject={subject}
                    lesson={lesson}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
        : undefined
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    isLoggedIn: state.user.isLoggedIn
  }),
  component: SubjectPage
});

