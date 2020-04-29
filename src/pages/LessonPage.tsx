import React, {useEffect, useState, Fragment, useRef, MutableRefObject} from 'react';
import { RouteComponentProps } from 'react-router';

import './LessonPage.scss';

import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonButton,
  IonBackButton,
  IonPage,
  IonTitle, IonMenuButton, IonCardContent, IonItem, IonSlides, IonSlide, IonCard, IonCardHeader, IonFooter
} from '@ionic/react'
import { useTranslation } from "react-i18next";
import i18n from '../i18n';

import { connect } from '../data/connect';
import * as selectors from '../data/selectors';

import { Subject, Lesson, Question } from '../models/Training';
import {Answer, UserLesson} from '../models/User';
import {CloudinaryContext, Image, Video} from "cloudinary-react";
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";
import LessonPageDetail from "../components/LessonPageDetail";
import {Redirect} from "react-router-dom";
import QuestionDetail from "../components/QuestionDetail";
import {startLesson, updateLesson} from "../data/user/user.actions";

interface OwnProps extends RouteComponentProps {
  subject: Subject;
  lesson: Lesson;
}

interface StateProps {
  isLoggedIn?: boolean,
  userLesson: UserLesson
}

interface DispatchProps {
  startLesson: typeof startLesson;
  updateLesson: typeof updateLesson;
}

interface LessonProps extends OwnProps, StateProps, DispatchProps {}

const LessonDetailsPage: React.FC<LessonProps> = ({ subject,lesson, userLesson, isLoggedIn, startLesson, updateLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const slider:MutableRefObject<any> = useRef(null);
  const [slides ,setSlides] = useState(new Array<JSX.Element>());
  const [lessonStarted,setLessonStarted] = useState(false);

  const saveAnswer = (question:Question, preLesson:boolean, answer:(string|number)) => {
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
    updateLesson(userLesson);
  };

  useEffect(() => {
    if (isLoggedIn && lesson && !lessonStarted) {
      setLessonStarted(true);
      startLesson(lesson.id);
    }
  },[isLoggedIn, lesson])

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
  const slidePrev = () => {
    scrollToTop();
    slider.current.slidePrev();
  }
  const slideChanged = (event: CustomEvent<void>) => {
    scrollToTop();
    slider.current.lockSwipeToNext(true);
  }
  const handleLessonComplete = () => {
    userLesson.completed = userLesson.completed || new Date();
    let correct = 0, preCorrect = 0;
    userLesson.answers.map(a => {
      if (a.answerAfter === a.correctAnswer) correct++;
      if (a.answerBefore === a.correctAnswer) preCorrect++;
    });
    userLesson.preScore = userLesson.answers.length ? Math.round((100*preCorrect) / userLesson.answers.length) : 0;
    userLesson.score = userLesson.answers.length ? Math.round((100*correct) / userLesson.answers.length) : 0;
    updateLesson(userLesson);
    slideNext();
  }

  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="lesson-detail">
      <IonContent scrollEvents={true}>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={subject ? `/tabs/subjects/${subject.id}` : '/tabs/training'} />
            </IonButtons>
            <IonTitle>{lesson ? lesson.name : t('resources.lessons.name')}</IonTitle>
          </IonToolbar>
        </IonHeader>

        { lesson ?
          <IonContent ref={contentRef} fullscreen={true}>
            <IonHeader collapse="condense">
            </IonHeader>
            <IonSlides  ref={slider} options={slideOpts} id={`${lesson.id}-slider`} onIonSlideDidChange={slideChanged}>
              <IonSlide className='lesson-slide'>
                <IonCard className='lesson-card'>
                  <IonCardContent className='lesson-text'>
                    <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
                      <Image publicId={lesson.photo} className={'lesson-logo'}>
                      </Image>
                    </CloudinaryContext>
                    <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
                    <IonButton expand='block' onClick={slideNext}>{t('buttons.next')}</IonButton>
                  </IonCardContent>
                </IonCard>
              </IonSlide>
              {lesson.questions && lesson.questions.map ((question, idx) => {
                return (
                  <IonSlide className='lesson-slide' id={`${lesson.id}-bq-${idx+1}`}>
                    <QuestionDetail subject={subject} lesson={lesson} question={question} idx={idx} next={slideNext} save={saveAnswer} preLesson={true}/>
                  </IonSlide>
                )
              })}
              {lesson.pages && lesson.pages.map ((page, idx) => {
                return (
                  <IonSlide className='lesson-slide' id={`${lesson.id}-lp-${idx+1}`}>
                    <LessonPageDetail subject={subject} lesson={lesson} page={page} idx={idx} next={slideNext}/>
                  </IonSlide>
                )
              })}
              {lesson.questions && lesson.questions.map ((question, idx) => {
                if (idx+1 === lesson.questions.length) {
                  return (
                    <IonSlide className='lesson-slide' id={`${lesson.id}-aq-${idx+1}`}>
                      <QuestionDetail subject={subject} lesson={lesson} question={question} idx={idx} next={handleLessonComplete} save={saveAnswer} preLesson={false}/>
                    </IonSlide>
                  )
                }
                return (
                  <IonSlide className='lesson-slide' id={`${lesson.id}-aq-${idx+1}`}>
                    <QuestionDetail subject={subject} lesson={lesson} question={question} idx={idx} next={slideNext} save={saveAnswer} preLesson={false}/>
                  </IonSlide>
                )
              })}
            </IonSlides>
          </IonContent>
          : undefined
        }
      </IonContent>
    </IonPage>
  );
};


export default connect({
  mapDispatchToProps: {
    startLesson,
    updateLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn
  }),
  component: LessonDetailsPage
});