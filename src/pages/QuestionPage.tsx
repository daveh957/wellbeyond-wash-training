import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent, IonFooter,
  IonHeader, IonInput, IonItem, IonLabel, IonList, IonMenuButton,
  IonPage, IonRadio, IonRadioGroup,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, Subject, Question} from '../models/Training';
import {Answer, UserLesson} from '../models/User';
import {Redirect} from "react-router-dom";
import {setUserLesson, updateLesson} from "../data/user/user.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
  question: Question;
  idx: number;
  isPreview: boolean;
}

interface StateProps {
  isLoggedIn?: boolean,
  trainerMode?: boolean,
  userLesson: UserLesson
}

interface DispatchProps {
  updateLesson: typeof updateLesson;
  setUserLesson: typeof setUserLesson;
}

interface QuestionPageProps extends OwnProps, StateProps, DispatchProps {}

const QuestionPage: React.FC<QuestionPageProps> = ({ history, subject, lesson, question, idx, isPreview, userLesson, isLoggedIn, trainerMode, updateLesson, setUserLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [answer, setAnswer] = useState<string|number>();
  const [showNext, setShowNext] = useState<boolean>(!!trainerMode);
  const [lockAnswer, setLockAnswer] = useState<boolean>();
  const handleAnswer = (value:(string|number)) => {
    setAnswer(value);
  }
  const handleNext = () => {
    saveAnswer(question, isPreview, answer);
    history.push(nextUrl, 'forward');
  }
  const saveAnswer = (question:Question, preLesson:boolean, answer?:(string|number)) => {
    if (!answer) {
      return;
    }
    userLesson.answers = userLesson.answers || new Array<Answer>();
    let ans = userLesson.answers.find(element => element.question === question.questionText);
    if (!ans) {
      ans = {
        question: question.questionText,
        correctAnswer: question.correctAnswer
      };
      userLesson.answers.push(ans);
    }
    ans[preLesson ? 'answerBefore' : 'answerAfter'] = answer;
    if (trainerMode) { // Only update the DB if not in trainer mode
      setUserLesson(userLesson);
    }
    else {
      updateLesson(userLesson);
    }
  };

  useEffect(() => {
    if (isLoggedIn && lesson) {
      const path = '/tabs/subjects/' + subject.id + '/lessons/' + lesson.id;
      const prev = idx - 1;
      const next = idx + 1;
      if (prev < 0) {
        if (isPreview || !lesson.pages || !lesson.pages.length) {
          setPrevUrl(path + '/intro');
        }
        else {
          setPrevUrl(path + '/page/' + lesson.pages.length);
        }
      }
      else {
        setPrevUrl(path + '/question/' + (prev+1) + (isPreview ? '/preview' : '/final'));
      }
      if (next > lesson.questions.length - 1) {
        if (isPreview && lesson.pages && lesson.pages.length) {
          setNextUrl(path + '/page/1');
        }
        else {
          setNextUrl(path + '/summary');
        }
      }
      else {
        setNextUrl(path + '/question/' + (next+1) + (isPreview ? '/preview' : '/final'));
      }
    }
  },[isLoggedIn, lesson, isPreview, idx])

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
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
        {lesson && userLesson && question &&
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
              {question && answer && !isPreview ?
                <div className='question-explanation'>
                  {answer === question.correctAnswer ?
                    <div>Great job, you got it right.</div>
                    :
                    <div>Sorry, you got it wrong. The correct answer is <strong>{question.correctAnswer}</strong>.</div>}
                  <div dangerouslySetInnerHTML={{__html: question.explanation || ''}}></div>
                </div>
                : undefined }
            </IonCardContent>
          </IonCard>
        </IonContent>
        }
      <IonFooter>
        <IonToolbar>
          <IonButtons slot={'start'}>
            <IonButton fill="solid" color="primary" routerLink={prevUrl} routerDirection='back'>{t('buttons.previous')}</IonButton>
            <IonButton fill="solid" color="primary" onClick={handleNext}>{t('buttons.next')}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>);
};


export default connect({
  mapDispatchToProps: {
    updateLesson,
    setUserLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    question: selectors.getQuestion(state, ownProps),
    idx: selectors.getQuestionIdx(state, ownProps),
    isPreview: selectors.isPreview(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: QuestionPage
});
