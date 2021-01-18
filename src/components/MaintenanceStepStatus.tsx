import React, {Fragment} from 'react';
import {ChecklistStep, MaintenanceStep} from '../models/Maintenance';
import {IonIcon, IonItem, IonText} from '@ionic/react';
import {buildOutline, checkmarkOutline, helpOutline, warningOutline} from 'ionicons/icons';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface MaintenanceStepStatusProps {
  maintenanceStep: MaintenanceStep;
  step: ChecklistStep;
  showNotStarted?: boolean;
}

const MaintenanceStepStatus: React.FC<MaintenanceStepStatusProps> = ({ maintenanceStep, step, showNotStarted}) => {

  const {t} = useTranslation(['translation'], {i18n});

  return (
    <Fragment>
      {!maintenanceStep.status && showNotStarted &&
        <IonItem lines="none">
          <IonIcon color="medium" slot="start" icon={helpOutline}></IonIcon>
          <IonText color="medium">{t('maintenance.step.notStarted')}</IonText>
        </IonItem>
      }
      {maintenanceStep.status === 'completed' &&
      <IonItem lines="none">
        <IonIcon color="success" slot="start" icon={checkmarkOutline}></IonIcon>
        <IonText color="success"> {t('maintenance.step.completed')}</IonText>
      </IonItem>
      }
      {maintenanceStep.status === 'incomplete' &&
      <IonItem lines="none">
        <IonIcon color="warning" slot="start" icon={warningOutline}></IonIcon>
        <IonText color="warning">{t('maintenance.step.incomplete')}</IonText>
      </IonItem>
      }
      {maintenanceStep.status === 'repairs-needed' &&
      <IonItem lines="none">
        <IonIcon color="danger" slot="start" icon={buildOutline}></IonIcon>
        <IonText color="danger">{t('maintenance.step.repairsNeeded')}</IonText>
      </IonItem>
      }
    </Fragment>)
};

export default MaintenanceStepStatus;
