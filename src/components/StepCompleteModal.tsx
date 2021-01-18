import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {MaintenanceLog, MaintenanceStep} from "../models/Maintenance";
import {connect} from "../data/connect";
import * as selectors from "../data/selectors";
import {UserProfile} from "../models/User";
import {updateMaintenanceLog} from '../data/maintenance/maintenance.actions';


interface OwnProps {
  showModal: boolean,
  closeModal(goback?:boolean): void,
  log: MaintenanceLog;
  step: MaintenanceStep;
}
interface StateProps {
  profile?: UserProfile;
}

interface DispatchProps {
  updateMaintenanceLog: typeof updateMaintenanceLog;
}

interface StepCompleteProps extends OwnProps, StateProps, DispatchProps { }

const StepCompleteModal: React.FC<StepCompleteProps> = ({showModal, closeModal, log, step, profile, updateMaintenanceLog}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() =>{
    setFormValues({status: step.status, information: step.information});
    setFormErrors({status: null});
  }, [showModal, step]);

  const handleChange = (field:string, value:string) => {
    let errors = {...formErrors};
    let values = {...formValues};
    errors[field] = null;
    values[field] = value;
    setFormErrors(errors);
    setFormValues(values);
  }
  const validate = ():boolean => {
    let errors = {...formErrors};
    errors.status = formValues.status ? null : 'maintenance.errors.statusRequired';
    setFormErrors(errors);
    return !Object.values(errors).some(x => (x !== null && x !== ''));
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate() && step && log) {
      step.completed = new Date();
      step.completedById = profile && profile.id;
      step.completedByName = profile && profile.name;
      step.status = formValues.status;
      step.information = formValues.information;
      updateMaintenanceLog(log);
      closeModal(true);
    }
  };


  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => closeModal(false)}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('maintenance.modals.stepComplete', {step: step.name})}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <form noValidate onSubmit={save}>
        <IonList>
          <IonListHeader>
            <h3>{t('maintenance.logs.status.choose')}</h3>
          </IonListHeader>
          <IonRadioGroup value={formValues.status} onIonChange={e => handleChange('status', e.detail.value)}>
            <IonItem>
              <IonLabel>{t('maintenance.logs.status.completed')}</IonLabel>
              <IonRadio slot="start" value="completed" />
            </IonItem>
            <IonItem>
              <IonLabel>{t('maintenance.logs.status.incomplete')}</IonLabel>
              <IonRadio slot="start" value="incomplete" />
            </IonItem>
            <IonItem>
              <IonLabel>{t('maintenance.logs.status.repairs')}</IonLabel>
              <IonRadio slot="start" value="repairs-needed" />
            </IonItem>
          </IonRadioGroup>

          {formSubmitted && formErrors.status && <IonText color="danger">
            <p className="ion-padding-start">
              {t(formErrors.status)}
            </p>
          </IonText>}
        </IonList>

        <IonList>
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <IonItemDivider>{t('maintenance.logs.infolabel')}</IonItemDivider>
          <IonItem>
            <IonTextarea disabled={formValues.status !== 'incomplete' && formValues.status !== 'repairs-needed'}
                         value={formValues.information} onIonChange={e => handleChange('information', e.detail.value!)}></IonTextarea>
          </IonItem>
        </IonList>

        <IonRow>
          <IonCol>
            <IonButton type="submit" expand="block">{t('maintenance.buttons.completeStep')}</IonButton>
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
  component: StepCompleteModal
})
