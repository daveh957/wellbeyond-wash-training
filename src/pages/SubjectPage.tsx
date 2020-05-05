import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import LessonItem from '../components/LessonItem';
import { Subject, Lesson } from '../models/Training';
import { UserLesson } from '../models/User';
import { UserLessons } from '../data/user/user.state';
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
}

interface StateProps {
  isLoggedIn?: boolean;
  trainerMode: boolean;
  userLessons?: UserLessons;
}

interface LessonFlags {
  completed: boolean;
  clickable: boolean;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, userLessons, isLoggedIn, trainerMode}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonFlags, setLessonFlags] = useState<LessonFlags[]>();
  useEffect(() => {
    if (lessons && userLessons) {
      const flags = new Array<LessonFlags>();
      lessons.map((l, idx) => {
        const pl = idx>0 && lessons[idx-1];
        const currentLesson = userLessons[l.id];
        const previousLesson = pl && userLessons[pl.id];
        flags.push({completed: !!(currentLesson && currentLesson.completed), clickable: !!(trainerMode || idx === 0 || (currentLesson && currentLesson.completed) || (previousLesson && previousLesson.completed))});
      });
      setLessonFlags(flags);
    }
  }, [lessons, userLessons, trainerMode]);

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (subject && lessons && userLessons ?
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
              {lessons && lessons.map((lesson, idx) => (
                <IonCol size="6" key={lesson.id}>
                  <LessonItem
                    key={lesson.id}
                    subject={subject}
                    lesson={lesson}
                    completed={lessonFlags && lessonFlags.length > idx ? !!lessonFlags[idx].completed : false}
                    clickable={lessonFlags && lessonFlags.length > idx ? !!lessonFlags[idx].clickable : false}
                  />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </IonContent>
        : undefined
      }
    </IonPage> : null
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    userLessons: state.user.lessons,
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: SubjectPage
});

