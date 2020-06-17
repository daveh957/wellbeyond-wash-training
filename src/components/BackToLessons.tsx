import React, {useContext, useEffect, useState} from 'react';
import {Subject, TrainingSession} from '../models/Training';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';


interface BackToLessonsProps {
  subject: Subject;
  session?: TrainingSession;
}

const BackToLessonsLink: React.FC<BackToLessonsProps> = ({ subject, session}) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/training');

  useEffect(() => {
    if (subject) {;
      setBackLink('/tabs/subjects/' + subject.id + '/progress' + (session && session.id ? ('?tsId=' + session.id) : ''));
    }
  }, [subject, session]);


  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack}></IonIcon>
    </IonButton>
  );
};

export default BackToLessonsLink;
