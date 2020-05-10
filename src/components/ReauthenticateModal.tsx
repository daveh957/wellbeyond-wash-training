import React, {useState} from 'react';
import {
  IonButton,
  IonButtons, IonCol,
  IonContent,
  IonHeader, IonInput,
  IonItem, IonLabel,
  IonList,
  IonModal, IonRow, IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {reauthenticate} from "../data/user/user.actions";
import {connect} from "../data/connect";

interface OwnProps {
  showModal: boolean,
  closeModal(): void
}

interface StateProps {
  loginError?: any;
}

interface DispatchProps {
  reauthenticate: typeof reauthenticate;
}

interface ChangePasswordProps extends OwnProps, StateProps, DispatchProps { }

const ChangePasswordModal: React.FC<ChangePasswordProps> = ({showModal, closeModal, loginError, reauthenticate}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({
    password: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);


  const handleChange = (field:string, value:string) => {
    formErrors[field] = null;
    setFormErrors(formErrors);
    formValues[field] = value;
    setFormValues(formValues);
  }
  const validate = ():boolean => {
    formErrors.password = formValues.password ? (formValues.password.length >= 8 ? null :  'registration.errors.passwordLength') : 'registration.errors.passwordRequired';
    setFormErrors(formErrors);
    const valid = !Object.values(formErrors).some(x => (x !== null && x !== ''));
    return valid;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      reauthenticate(formValues.password);
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
          <IonTitle>{t('registration.modals.reauthenticate')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
          <IonList>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.password')}</IonLabel>
              <IonInput name="password" type="password" value={formValues.password} minlength={8} required={true} onIonChange={e => {
                handleChange('password', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.password && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.password)}
              </p>
            </IonText>}
          </IonList>

          {formSubmitted && loginError && <IonText color="danger">
            <p className="ion-padding-start">
              {loginError.message}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.reauthenticate')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    reauthenticate,
  },
  mapStateToProps: (state) => ({
    loginError: state.user.loginError
  }),
  component: ChangePasswordModal
})
