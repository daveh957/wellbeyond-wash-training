import React, {useContext, useEffect, useState} from 'react';
import {System} from '../models/Maintenance';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';


interface BackToSystemProps {
  system: System;
}

const BackToSystemLink: React.FC<BackToSystemProps> = ({ system, }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/maintenance');

  useEffect(() => {
    if (system) {
      setBackLink('/tabs/systems/' + system.id );
    }
  }, [system]);


  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToSystemLink;
