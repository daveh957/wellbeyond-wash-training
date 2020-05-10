import React, {useState, useEffect} from 'react';
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
import {changePassword, registerUser} from "../data/user/user.actions";
import {updatePassword} from "../data/user/userApi";
import {connect} from "../data/connect";
import {ToastProps} from "../pages/Account";

interface OwnProps {
  showModal: boolean,
  closeModal(): void,
  showToast(props:ToastProps): void
}

interface StateProps {
}

interface DispatchProps {
}

interface ChangePasswordProps extends OwnProps, StateProps, DispatchProps { }

const ChangePasswordModal: React.FC<ChangePasswordProps> = ({showModal, closeModal, showToast}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({
    password: '',
    passwordRepeat: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [serverError, setServerError] = useState<Error>();

  useEffect(() =>{
    setFormValues({password: '', repeatPassword: ''});
    setFormErrors({password: null, repeatPassword: null});
    setServerError(undefined);
  }, [showModal]);

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
    errors.password = formValues.password ? (formValues.password.length >= 8 ? null :  'registration.errors.passwordLength') : 'registration.errors.passwordRequired';
    errors.passwordRepeat = (formValues.password === formValues.passwordRepeat ? null :  'registration.errors.passwordMismatch');
    setFormErrors(errors);
    const valid = !Object.values(errors).some(x => (x !== null && x !== ''));
    return valid;
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      updatePassword(formValues.password).then((result) => {
        showToast({message: t('registration.messages.passwordChanged')});
        closeModal();
      })
      .catch((error) => {
        setServerError(error);
      });
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
          <IonTitle>{t('registration.modals.changePassword')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
          <IonList>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.newPassword')}</IonLabel>
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

          <IonItem>
            <IonLabel position="stacked" color="primary">{t('registration.labels.passwordRepeat')}</IonLabel>
            <IonInput name="passwordRepeat" type="password" value={formValues.passwordRepeat} minlength={8} required={true} onIonChange={e => {
              handleChange('passwordRepeat', e.detail.value!);
            }}>
            </IonInput>
          </IonItem>

          {formSubmitted && formErrors.passwordRepeat && <IonText color="danger">
            <p className="ion-padding-start">
              {t(formErrors.passwordRepeat)}
            </p>
          </IonText>}

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.changePassword')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: ChangePasswordModal
})
