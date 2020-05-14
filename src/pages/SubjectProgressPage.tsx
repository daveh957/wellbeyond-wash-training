import React, {useEffect, useState} from 'react';
import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import LessonItem from '../components/LessonItem';
import {Lesson, Subject, TrainingSession} from '../models/Training';
import {UserLessons} from '../data/user/user.state';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSubjectLink from "../components/BackToSubject";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
  activeSession?: TrainingSession;
}

interface StateProps {
  userLessons?: UserLessons;
}

interface LessonFlags {
  completed: boolean;
  clickable: boolean;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectProgressPage: React.FC<SubjectProps> = ({ subject, lessons, userLessons, activeSession}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonFlags, setLessonFlags] = useState<LessonFlags[]>();
  useEffect(() => {
    if (lessons && (userLessons || activeSession)) {
      const flags = new Array<LessonFlags>();
      lessons.map((l, idx) => {
        const pl = idx>0 ? lessons[idx-1] : undefined;
        let currentLesson, previousLesson;
        if (activeSession) {
          currentLesson = activeSession.lessons && activeSession.lessons[l.id];
          previousLesson = pl && activeSession.lessons && activeSession.lessons[pl.id];
        }
        else {
          currentLesson = userLessons && userLessons[l.id];
          previousLesson = pl && userLessons && userLessons[pl.id];
        }
        flags.push({completed: !!(currentLesson && currentLesson.completed), clickable: !!(activeSession || idx === 0 || (currentLesson && currentLesson.completed) || (previousLesson && previousLesson.completed))});
      });
      setLessonFlags(flags);
    }
  }, [lessons, userLessons, activeSession]);

  return (
    <IonPage id="lesson-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSubjectLink subject={subject}/>
          </IonButtons>
          <IonTitle>{subject ? subject.name : t('resources.subjects.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { subject ?
        <IonContent fullscreen={true}>
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
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lessons: selectors.getSubjectLessons(state, ownProps),
    activeSession: selectors.getTrainingSession(state, ownProps),
    userLessons: selectors.getUserLessons(state),
  }),
  component: SubjectProgressPage
});

