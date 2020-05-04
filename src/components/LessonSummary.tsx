import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { UserLesson } from '../models/User';
import {IonCard, IonCardContent, IonButton, IonCardSubtitle, IonCardTitle, IonCardHeader,} from '@ionic/react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import { getPublicId} from "../util/cloudinary";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface LessonSummaryProps {
  subject: Subject,
  lesson: Lesson;
  userLesson: UserLesson;
  next(): void;
}

const LessonSummary: React.FC<LessonSummaryProps> = ({ subject,lesson, userLesson, next}) => {
  const { t } = useTranslation(['translation'], {i18n} );
  return (
    <IonCard className='lesson-card'>
      <IonCardContent className='lesson-text'>
        <IonCardSubtitle>Lesson completed</IonCardSubtitle>
        <IonCardTitle>{lesson.name}</IonCardTitle>
        <p>You have successfully completed this module and correctly answered {userLesson.score}% of the questions.</p>
        <IonButton expand='block' onClick={next}>{t('buttons.done')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonSummary;
