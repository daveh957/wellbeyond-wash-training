import React from 'react';
import { Subject, Lesson } from '../models/Training';
import { UserLesson } from '../models/User';
import {IonCard, IonCardContent, IonButton, } from '@ionic/react';
import {CloudinaryContext, Image, Transformation} from 'cloudinary-react';
import { cloudinaryConfig } from "../CLOUDINARY_CONFIG";
import { getPublicId} from "../util/cloudinary";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface LessonIntroProps {
  subject: Subject,
  lesson: Lesson;
  userLesson: UserLesson;
  next(): void;
}

const LessonIntro: React.FC<LessonIntroProps> = ({ subject,lesson, next}) => {
  const { t } = useTranslation(['translation'], {i18n} );
  return (
    <IonCard className='lesson-card'>
      <IonCardContent className='lesson-text'>
        <CloudinaryContext cloudName={cloudinaryConfig.cloudName}>
          <Image publicId={getPublicId(lesson.photo)} className={'lesson-logo'}>
            <Transformation width="600" crop="scale" />
          </Image>
        </CloudinaryContext>
        <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
        <IonButton expand='block' onClick={next}>{t('buttons.next')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonIntro;
