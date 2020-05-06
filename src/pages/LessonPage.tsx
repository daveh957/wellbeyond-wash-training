import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import './LessonPage.scss';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import * as selectors from '../data/selectors';

import {Lesson, Question, Subject} from '../models/Training';
import {Answer, UserLesson} from '../models/User';
import LessonPageDetail from "../components/LessonPageDetail";
import {Redirect} from "react-router-dom";
import QuestionDetail from "../components/QuestionDetail";
import {setUserLesson, updateLesson} from "../data/user/user.actions";
import LessonIntro from "../components/LessonIntro";
import LessonSummary from "../components/LessonSummary";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
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

interface LessonProps extends OwnProps, StateProps, DispatchProps {}

const LessonDetailsPage: React.FC<LessonProps> = ({ history, subject,lesson, userLesson, isLoggedIn, trainerMode, updateLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const slider:MutableRefObject<any> = useRef(null);
  const [beforeQuestions ,setBeforeQuestions] = useState<Question[]>();

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
    (trainerMode ? setUserLesson : updateLesson)(userLesson); // Only update the DB if not in trainer mode
  };

  const done = () => {
    slider.current.slideTo(0);
    history.push('/tabs/subjects/'+subject.id, {direction: 'forward'});
  };

  const contentRef = useRef(null);
  const scrollToTop= () => {
    // @ts-ignore
    contentRef.current.scrollToTop();
  };

  const slideNext = () => {
    scrollToTop();
    slider.current.lockSwipeToNext(false);
    slider.current.slideNext();
  }
  const slideChanged = (_event: CustomEvent<void>) => {
    scrollToTop();
    slider.current.lockSwipeToNext(true);
  }
  const handleLessonComplete = () => {
    userLesson.completed = userLesson.completed || new Date();
    let correct = 0, preCorrect = 0;
    // eslint-disable-next-line array-callback-return
    userLesson.answers.map(a => {
      if (a.answerAfter === a.correctAnswer) correct++;
      if (a.answerBefore === a.correctAnswer) preCorrect++;
    });
    userLesson.preScore = userLesson.answers.length ? Math.round((100*preCorrect) / lesson.questions.length) : 0;
    userLesson.score = userLesson.answers.length ? Math.round((100*correct) / lesson.questions.length) : 0;
    (trainerMode ? setUserLesson : updateLesson)(userLesson); // Only update the DB if not in trainer mode
    slideNext();
  }
  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  useEffect(() => {
    if (isLoggedIn && lesson && userLesson) {
      setBeforeQuestions(beforeQuestions || (!userLesson.completed ? lesson.questions: undefined));
      if (!userLesson.started) {
        userLesson.started = new Date();
        if (trainerMode) { // Only update the DB if not in trainer mode
          setUserLesson(userLesson);
        }
        else {
          updateLesson(userLesson);
        }
      }
    }
  },[isLoggedIn, lesson, userLesson, trainerMode])

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="lesson-detail">
      <IonContent scrollEvents={true}>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={subject ? `/tabs/subjects/${subject.id}` : '/tabs/training'}/>
            </IonButtons>
            <IonTitle>{lesson ? lesson.name : t('resources.lessons.name')}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {lesson ?
          <IonContent ref={contentRef} fullscreen={true}>
            <IonHeader collapse="condense">
            </IonHeader>
            <IonSlides ref={slider} options={slideOpts} id={`${lesson.id}-slider`} onIonSlideDidChange={slideChanged}>
              <IonSlide className='lesson-slide' id={`${lesson.id}-intro`}>
                <LessonIntro subject={subject} lesson={lesson} userLesson={userLesson} next={slideNext}/>
              </IonSlide>
              {beforeQuestions && beforeQuestions.map((question:Question, idx:number) => {
                return (
                  <IonSlide className='lesson-slide' key={`${lesson.id}-bq-${idx + 1}`}>
                    <QuestionDetail subject={subject} lesson={lesson} question={question}
                                    questionNum={idx + 1} questionCount={lesson.questions.length}
                                    next={slideNext} save={saveAnswer} preLesson={true} trainerMode={trainerMode}/>
                  </IonSlide>
                )
              })}
              {lesson.pages && lesson.pages.map((page, idx) => {
                return (
                  <IonSlide className='lesson-slide' key={`${lesson.id}-lp-${idx + 1}`}>
                    <LessonPageDetail subject={subject} lesson={lesson} page={page} pageNum={idx + 1}
                                      pageCount={lesson.pages.length} skipVideo={!!(userLesson && userLesson.completed)}
                                      next={slideNext} trainerMode={trainerMode}/>
                  </IonSlide>
                )
              })}
              {lesson.questions && lesson.questions.map((question, idx) => {
                return (
                  <IonSlide className='lesson-slide' key={`${lesson.id}-aq-${idx + 1}`}>
                    <QuestionDetail subject={subject} lesson={lesson} question={question}
                                    questionNum={idx + 1} questionCount={lesson.questions.length}
                                    priorAnswers={userLesson && userLesson.answers}
                                    next={idx + 1 === lesson.questions.length ? handleLessonComplete : slideNext}
                                    save={saveAnswer} preLesson={false} trainerMode={trainerMode}/>
                  </IonSlide>
                )
              })}
              <IonSlide className='lesson-slide' id={`${lesson.id}-summary`}>
                <LessonSummary subject={subject} lesson={lesson} userLesson={userLesson} next={done}/>
              </IonSlide>
            </IonSlides>
          </IonContent>
          : undefined
        }
      </IonContent>
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
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn,
    trainerMode: state.user.trainerMode
  }),
  component: LessonDetailsPage
});
