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
import {Lesson, Subject} from '../models/Training';
import {UserLessons} from '../data/user/user.state';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SubjectPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lessons: Lesson[];
}

interface StateProps {
  trainerMode: boolean;
  userLessons?: UserLessons;
}

interface LessonFlags {
  completed: boolean;
  clickable: boolean;
}

interface DispatchProps { }

interface SubjectProps extends OwnProps, StateProps, DispatchProps { }

const SubjectPage: React.FC<SubjectProps> = ({ subject, lessons, userLessons, trainerMode}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [lessonFlags, setLessonFlags] = useState<LessonFlags[]>();
  useEffect(() => {
    if (lessons && userLessons) {
      const flags = new Array<LessonFlags>();
      lessons.map((l, idx) => {
        const pl = idx>0 && lessons[idx-1];
        const currentLesson = userLessons[l.id];
        const previousLesson = pl && userLessons[pl.id];
        flags.push({completed: !trainerMode && !!(currentLesson && currentLesson.completed), clickable: !!(trainerMode || idx === 0 || (currentLesson && currentLesson.completed) || (previousLesson && previousLesson.completed))});
      });
      setLessonFlags(flags);
    }
  }, [lessons, userLessons, trainerMode]);

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
    userLessons: state.user.lessons,
    trainerMode: state.user.trainerMode
  }),
  component: SubjectPage
});

