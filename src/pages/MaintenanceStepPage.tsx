import React, {useContext, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import {ChecklistStep, MaintenanceLog, MaintenanceStep} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './MaintenancePage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToMaintenanceLogLink from "../components/BackToMaintenanceLog";
import VideoPlayer from "../components/VideoPlayer";
import StepCompleteModal from "../components/StepCompleteModal";
import MaintenanceStepStatus from "../components/MaintenanceStepStatus";

interface OwnProps extends RouteComponentProps {
  log: MaintenanceLog;
  checklistStep: ChecklistStep;
  maintenanceStep: MaintenanceStep;
}

interface StateProps {
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const MaintenanceStepPage: React.FC<SystemProps> = ({ log, checklistStep,  maintenanceStep}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const closeModal = (goback?:boolean) => {
    setShowModal(false);
    if (goback) {
      navigate('/tabs/maintenance/' + log.id, 'back');
    }
  }

  const openModal = () => {
    setShowModal(true);
  }

  return (
    <IonPage id="maintenance-step">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToMaintenanceLogLink log={log}/>
          </IonButtons>
          <IonTitle>{checklistStep ? checklistStep.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {checklistStep && maintenanceStep &&
      <IonContent fullscreen={true}>
        <IonCard>
          <IonCardHeader>
            <h2>{checklistStep.name}</h2>
          </IonCardHeader>
          <IonCardContent class='lesson-text'>
            <div dangerouslySetInnerHTML={{__html: checklistStep.instructions || ''}}></div>
            {checklistStep.photo &&
            <IonGrid>
              <IonRow>
                <IonCol>
                  <img src={checklistStep.photo} crossOrigin='anonymous' alt={checklistStep.name}/>
                </IonCol>
              </IonRow>
              {checklistStep.photoCaption &&
              <IonRow>
                <IonCol>
                  <IonText color='medium'>
                    <div className='ion-text-center'>{checklistStep.photoCaption}</div>
                  </IonText>
                </IonCol>
              </IonRow>
              }
            </IonGrid>
            }
            {checklistStep.video &&
            <IonGrid>
              <IonRow>
                <IonCol>
                  <VideoPlayer id={`video-${log.id}`} src={checklistStep.video}/>
                </IonCol>
              </IonRow>
              {checklistStep.videoCaption &&
              <IonRow>
                <IonCol>
                  <IonText color='medium'>
                    <div className='ion-text-center'>{checklistStep.videoCaption}</div>
                  </IonText>
                </IonCol>
              </IonRow>
              }
            </IonGrid>
            }
            {maintenanceStep.status &&
            <IonGrid>
              <IonRow>
                <IonCol>
                  <MaintenanceStepStatus maintenanceStep={maintenanceStep} step={checklistStep}></MaintenanceStepStatus>
                </IonCol>
              </IonRow>
            </IonGrid>}
          </IonCardContent>
        </IonCard>
        <IonRow>
          <IonCol>
            <IonButton expand="block" fill="solid" color="primary" onClick={openModal}>{t('maintenance.buttons.complete')}</IonButton>
          </IonCol>
        </IonRow>
        <StepCompleteModal showModal={showModal} closeModal={closeModal} log={log} step={maintenanceStep} />
      </IonContent>

      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    log: selectors.getMaintenanceLog(state, ownProps),
    checklistStep: selectors.getChecklistStep(state, ownProps),
    maintenanceStep: selectors.getMaintenanceStep(state, ownProps),
  }),
  component: MaintenanceStepPage
});

