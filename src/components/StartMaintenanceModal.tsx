import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Checklist, MaintenanceLog, System} from "../models/Maintenance";
import {connect} from "../data/connect";
import * as selectors from "../data/selectors";
import {UserProfile} from "../models/User";
import {updateMaintenanceLog} from '../data/maintenance/maintenance.actions';


interface OwnProps {
  showModal: boolean,
  closeModal(): void,
  system: System;
  checklists: Checklist[];
}
interface StateProps {
  profile?: UserProfile;
}

interface DispatchProps {
  updateMaintenanceLog: typeof updateMaintenanceLog;
}

interface StartMaintenanceProps extends OwnProps, StateProps, DispatchProps { }

const StartMaintenanceModal: React.FC<StartMaintenanceProps> = ({showModal, closeModal, system, checklists, profile, updateMaintenanceLog}) => {

  const {navigate} = useContext(NavContext);
  const { t } = useTranslation(['translation'], {i18n} );

  const [checklist, setChecklist] = useState<Checklist>();
  const [checklistError, setChecklistError] = useState<string>();

  useEffect(() =>{
  }, [showModal]);

  const validate = ():boolean => {
    if (checklist && checklist.id) {
      setChecklistError(undefined);
      return true;
    }
    setChecklistError('maintenance.errors.checklistRequired');
    return false;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if(validate() && profile && checklist) {
      const now = new Date();
      const log:MaintenanceLog = {
        id: system.id + ':' + checklist.id + ':' + now.getTime(),
        started: now,
        name: checklist.name + ' - ' + now.toLocaleDateString(),
        organizationId: system.organizationId,
        checklistId: checklist.id,
        systemId: system.id,
        userId: profile.id,
        stepCount: checklist.steps ? checklist.steps.length : 0,
        completedCount: 0,
        archived: false,
        steps: checklist.steps.map(step => {return {name: step.name}})
      };
      updateMaintenanceLog(log);
      closeModal();
      navigate('/tabs/maintenance/'+ log.id, 'forward');
    }
  };


  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('maintenance.modals.startMaintenance', {system: system.name})}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
        <IonList>
          <IonListHeader>
            <h3>{t('maintenance.checklist.choose')}</h3>
          </IonListHeader>
          <IonRadioGroup value={checklist} onIonChange={e => setChecklist(e.detail.value)}>
            {checklists.map((cl, idx) =>  {
              return <IonItem key={`cl-${cl.id}`}>
                <IonLabel>
                  <div>{cl.name}</div>
                  <div>
                    <small>{t('maintenance.checklist.stepCount', {count: cl.steps.length})}</small>
                    {cl.frequency && <small>, {t('maintenance.checklist.schedule-' + cl.frequency)}</small>}
                  </div>
                </IonLabel>
                <IonRadio slot="start" value={cl} />
              </IonItem>
            })}
          </IonRadioGroup>
        </IonList>

        {checklistError && <IonText color="danger">
          <p className="ion-padding-start">
            {t(checklistError, {system: system ? system.name : ''})}
          </p>
        </IonText>}

        <IonRow>
          <IonCol>
            <IonButton disabled={!checklist} type="submit" expand="block">{t('maintenance.buttons.startChecklist')}</IonButton>
          </IonCol>
        </IonRow>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    updateMaintenanceLog
  },
  mapStateToProps: (state) => ({
    profile: selectors.getUserProfile(state),
  }),
  component: StartMaintenanceModal
})
