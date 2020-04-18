import React, { useEffect, useState, Fragment } from 'react';
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

import { connect } from '../data/connect';
import * as selectors from '../data/selectors';

import { Subject, Lesson, LessonPage } from '../models/Training';
import {CloudinaryContext, Image, Video} from "cloudinary-react";
import VideoPlayer from '../components/VideoPlayer';
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";

interface OwnProps extends RouteComponentProps {
  subject?: Subject;
  lesson?: Lesson;
}

interface StateProps {
}

interface DispatchProps {}

interface LessonProps extends OwnProps, StateProps, DispatchProps {}

const LessonDetailsPage: React.FC<LessonProps> = ({ subject,lesson }) => {

  const [sliderId , setSliderId] = useState('slider-' + (lesson ? lesson.id : ''));
  const [slider , setSlider] = useState();
  const [pageNum, setPageNum] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    setSlider(document.getElementById(sliderId));
  });


  const slideNext = () => {
    slider.slideNext();
  }
  const slidePrev = () => {
    slider.slidePrev();
  }

  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  const renderLessonSlides: any = (lesson:Lesson) => {
    return (
      <IonSlides pager={true} options={slideOpts} id={sliderId}>
        <IonSlide>
          <IonCard>
            <IonCardContent class='lesson-text'>
              <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
                <Image publicId={lesson.photo}>
                </Image>
              </CloudinaryContext>
              <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
            </IonCardContent>
          </IonCard>
        </IonSlide>
        {lesson.pages && lesson.pages.map((page, idx) =>  {
          return (
            <IonSlide>
              <IonCard>
                <IonCardHeader>
                  <h2>{page.title}</h2>
                </IonCardHeader>
                <IonCardContent class='lesson-text'>
                  <div dangerouslySetInnerHTML={{__html: page.text}}></div>
                  {page.photo ?
                    <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
                      <Image publicId={page.photo}>
                      </Image>
                    </CloudinaryContext>
                    : undefined}
                  {page.video ?
                    <VideoPlayer id={`video-${lesson.id}-${idx}`} src={page.video}  />
                    : undefined}
                </IonCardContent>
              </IonCard>
            </IonSlide>
          );
          })
        }
      </IonSlides>
    );
  }

  return (
    <IonPage id="lesson-detail">
      <IonContent>
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={subject ? `/tabs/subjects/${subject.id}` : '/tabs/training'} />
            </IonButtons>
            <IonTitle>{lesson ? lesson.name : 'Lesson'}</IonTitle>
          </IonToolbar>
        </IonHeader>

        { lesson ?
          <IonContent fullscreen={true}>
            <IonHeader collapse="condense">
            </IonHeader>
            { renderLessonSlides(lesson) }
          </IonContent>
          : undefined
        }
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton slot='start' onClick={slidePrev}>Prev</IonButton>
          <IonButton slot='end' onClick={slideNext}>Next</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};


export default connect({
  mapStateToProps: (state, ownProps) => ({
    subject: selectors.getSubject(state, ownProps),
    lesson: selectors.getLesson(state, ownProps)
  }),
  component: LessonDetailsPage
});
