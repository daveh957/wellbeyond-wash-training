import React, {useContext, useEffect, useState} from 'react';
import {MaintenanceLog} from '../models/Maintenance';
import {IonButton, IonIcon, NavContext} from '@ionic/react';
import {arrowBack} from 'ionicons/icons';


interface BackToMaintenanceLogProps {
  log: MaintenanceLog;
}

const BackToMaintenanceLogLink: React.FC<BackToMaintenanceLogProps> = ({ log, }) => {

  const {navigate} = useContext(NavContext);
  const [backLink, setBackLink] = useState<string>('/tabs/maintenance');

  useEffect(() => {
    if (log) {
      setBackLink('/tabs/maintenance/' + log.id );
    }
  }, [log]);


  return (
    <IonButton onClick={()=>{navigate(backLink, 'back')}}>
      <IonIcon icon={arrowBack} />
    </IonButton>
  );
};

export default BackToMaintenanceLogLink;
