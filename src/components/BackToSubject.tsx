import React, {useContext, useEffect, useState} from 'react';
import {Subject} from '../models/Training';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';


interface BackToLessonsProps {
  subject: Subject;
}

const BackToSubjectLink: React.FC<BackToLessonsProps> = ({ subject, }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState();

  useEffect(() => {
    if (subject) {
      setBackLink('/tabs/subjects/' + subject.id );
    }
  }, [subject]);


  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToSubjectLink;
