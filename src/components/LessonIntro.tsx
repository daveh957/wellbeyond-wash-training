import React, {useEffect, useState} from 'react';
import {Lesson, Subject} from '../models/Training';
import {UserLesson} from '../models/User';
import {IonButton, IonCard, IonCardContent,} from '@ionic/react';
import {getLessonIconUrl} from "../util/cloudinary";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface LessonIntroProps {
  subject: Subject,
  lesson: Lesson;
  userLesson: UserLesson;
  next(): void;
}

const LessonIntro: React.FC<LessonIntroProps> = ({ lesson, userLesson, next}) => {
  const [lessonIcon, setLessonIcon] = useState();
  useEffect(() => {
    if (lesson && lesson.photo) {
      setLessonIcon(getLessonIconUrl(lesson.photo, false));
    }
  },[lesson]);
  const { t } = useTranslation(['translation'], {i18n} );

  return (
    <IonCard className='lesson-card'>
      <IonCardContent className='lesson-text'>
        <img src={lessonIcon} crossOrigin='anonymous' alt="">
        </img>
        <div dangerouslySetInnerHTML={{__html: lesson.description}}></div>
        {userLesson && userLesson.completed ?
          <p>{t('resources.lessons.intro.completed')}</p>
        :
          <p>{t('resources.lessons.intro.firsttime')} </p>
        }
        <IonButton expand='block' onClick={next}>{t('buttons.next')}</IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default LessonIntro;
