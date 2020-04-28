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

import { Subject, Lesson, LessonPage } from '../models/Training';
import { UserLesson } from '../models/User';
import {CloudinaryContext, Image, Video} from "cloudinary-react";
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";
import LessonPageDetail from "../components/LessonPageDetail";
import {Redirect} from "react-router-dom";
import QuestionDetail from "../components/QuestionDetail";
import {startLesson} from "../data/user/user.actions";

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
}

interface LessonProps extends OwnProps, StateProps, DispatchProps {}

const LessonDetailsPage: React.FC<LessonProps> = ({ subject,lesson, userLesson, isLoggedIn, startLesson }) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const slider:MutableRefObject<any> = useRef(null);
  const [slides ,setSlides] = useState(new Array<JSX.Element>());
  const [lessonStarted,setLessonStarted] = useState(false);

  useEffect(() => {
    if (isLoggedIn && lesson && !lessonStarted) {
      setLessonStarted(true);
      startLesson(lesson.id);
    }
  },[isLoggedIn, lesson])

  useEffect(() => {
    let slideIdx = 0;
    if (lesson) {
      slides.push(
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
      );
      if (lesson.questions && false) {
        lesson.questions.map((question, idx) => {
          slideIdx++;
          slides.push(
              <QuestionDetail subject={subject} lesson={lesson} question={question} idx={idx} unlock={unlockNext}
                              prev={slidePrev} next={slideNext} showExplanation={false}/>
          );
        });
      }
      if (lesson.pages) {
        lesson.pages.map((page, idx) => {
          slideIdx++;
          slides.push(
              <LessonPageDetail subject={subject} lesson={lesson} page={page} idx={idx} unlock={unlockNext}
                                prev={slidePrev} next={slideNext}/>
          );
        });
      }
      if (lesson.questions) {
        lesson.questions.map((question, idx) => {
          slides.push(
            <QuestionDetail subject={subject} lesson={lesson} question={question} idx={idx} unlock={unlockNext}
                            prev={slidePrev} next={slideNext} showExplanation={true}/>
          );
        });
      }
      setSlides(slides);
    }
  },[lesson]);

  const contentRef = useRef(null);
  const scrollToTop= () => {
    // @ts-ignore
    contentRef.current.scrollToTop();
  };

  const slideNext = () => {
    unlockNext();
    scrollToTop();
    slider.current.slideNext();
  }
  const slidePrev = () => {
    scrollToTop();
    slider.current.slidePrev();
  }
  const lockNext = () => {
    return slider.current.lockSwipeToNext(true);
  }
  const unlockNext = () => {
    return slider.current.lockSwipeToNext(false);
  }
  const slideChanged = (event: CustomEvent<void>) => {
    scrollToTop();
    slider.current.lockSwipeToNext(true);
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
              {slides.map ((slide, idx) => {
                return (
                  <IonSlide className='lesson-slide' id={`${lesson.id}-slide-${idx+1}`}>
                    {slide}
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
    startLesson
  },
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps),
    userLesson: selectors.getUserLesson(state, ownProps),
    isLoggedIn: state.user.isLoggedIn
  }),
  component: LessonDetailsPage
});
