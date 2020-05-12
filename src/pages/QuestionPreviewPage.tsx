import React, {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, LessonProgress, Question, Subject, TrainingSession} from '../models/Training';
import {Answer} from '../models/User';
import {updateUserLesson} from "../data/user/user.actions";
import {updateTrainingLesson} from "../data/training/training.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  question: Question;
  idx: number;
  lessonProgress: LessonProgress
}

interface StateProps {
  activeSession?: TrainingSession;
}

interface DispatchProps {
  updateUserLesson: typeof updateUserLesson;
  updateTrainingLesson: typeof updateTrainingLesson;
}

interface QuestionPageProps extends OwnProps, StateProps, DispatchProps {}

const QuestionPreviewPage: React.FC<QuestionPageProps> = ({ subject, lesson, question, idx, lessonProgress, activeSession, updateUserLesson, updateTrainingLesson }) => {

  const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [answer, setAnswer] = useState<string|number|undefined>();
  const [showNext, setShowNext] = useState<boolean>();
  const [lockAnswer, setLockAnswer] = useState<boolean>();

  useEffect(() => {
    let priorAnswer;
    if (question && lessonProgress) {
      const a = lessonProgress.answers.find(element => element.question === question.questionText);
      if (a) {
        priorAnswer = a.answerBefore;
      }
    }
    setAnswer(priorAnswer);
    setShowNext(!!priorAnswer);
  },[lessonProgress, question]);

  useEffect(() => {
    if (lesson) {
      const path = '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id;
      const prev = idx - 1;
      const next = idx + 1;
      if (prev < 0) {
          setPrevUrl(path + '/intro');
      }
      else {
        setPrevUrl(path + '/preview/' + (prev+1));
      }
      if (next > lesson.questions.length - 1) {
        if (lesson.pages && lesson.pages.length) {
          setNextUrl(path + '/page/1');
        }
        else {
          setNextUrl(path + '/summary');
        }
      }
      else {
        setNextUrl(path + '/preview/' + (next+1));
      }
    }
  },[subject, lesson, idx])

  const handleAnswer = (value:(string|number|undefined)) => {
    setAnswer(value);
    if (value) {
      lessonProgress.answers = lessonProgress.answers || new Array<Answer>();
      let ans = lessonProgress.answers.find(element => element.question === question.questionText);
      if (!ans) {
        ans = {
          question: question.questionText,
          correctAnswer: question.correctAnswer
        };
        lessonProgress.answers.push(ans);
      }
      ans.answerBefore = value;
      setShowNext(true);
    }
  }

  const handleNext = () => {
    if (answer) {
      if (activeSession) {
        updateTrainingLesson(activeSession, lessonProgress);
      }
      else {
        updateUserLesson(lessonProgress);
      }
    }
    navigate(nextUrl, 'forward');
  }

  return (
    <IonPage id="question-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{lesson && lesson.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {lesson && lessonProgress && question &&
      <IonContent fullscreen={true}>
        <IonCard className='lesson-card'>
          <IonCardHeader>
            <IonCardSubtitle>Question {idx+1} of {lesson.questions.length}</IonCardSubtitle>
            <IonCardTitle><h2>{question.questionText}</h2></IonCardTitle>
          </IonCardHeader>
          <IonCardContent className='question-answer'>
            {
              (question && question.questionType === 'yes-no' &&
                <IonList>
                  <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                    <IonItem>
                      <IonLabel>Yes</IonLabel>
                      <IonRadio disabled={lockAnswer} slot="start" value="yes" />
                    </IonItem>
                    <IonItem>
                      <IonLabel>No</IonLabel>
                      <IonRadio disabled={lockAnswer} slot="start" value="no" />
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
              )
            }
            {
              (question && question.questionType === 'choose-one' && question.choices &&
                <IonList>
                  <IonRadioGroup value={answer} onIonChange={e => handleAnswer(e.detail.value)}>
                    {question.choices.map((choice, idx) =>  {
                      return <IonItem key={`choice-${idx}`}>
                        <IonLabel>{choice.value}</IonLabel>
                        <IonRadio disabled={lockAnswer} slot="start" value={choice.value} />
                      </IonItem>
                    })}
                  </IonRadioGroup>
                </IonList>
              )
            }
            {
              (question && question.questionType === 'number' &&
                <IonList>
                  <IonItem>
                    <IonInput disabled={lockAnswer} type="number" value={answer} placeholder={t('questions.enterNumber')} onIonChange={e => handleAnswer(parseInt(e.detail.value!, 10))}/>
                  </IonItem>
                </IonList>
              )
            }
          </IonCardContent>
        </IonCard>
      </IonContent>
      }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary"  disabled={!showNext} onClick={handleNext}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};


export default connect({
  mapDispatchToProps: {
    updateUserLesson: updateUserLesson,
    updateTrainingLesson: updateTrainingLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    question: selectors.getQuestion(state, ownProps),
    idx: selectors.getQuestionIdx(state, ownProps),
    lessonProgress: selectors.getLessonProgress(state, ownProps),
    activeSession: selectors.getActiveSession(state)
  }),
  component: QuestionPreviewPage
});
