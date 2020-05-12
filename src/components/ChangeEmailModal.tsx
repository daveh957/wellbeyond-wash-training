import React, {useEffect, useState} from 'react';
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
import {setData} from "../data/user/user.actions";
import {connect} from "../data/connect";
import {updateEmail} from "../data/user/userApi";
import {ToastProps} from "../pages/Account";

interface OwnProps {
  email?: string,
  showModal: boolean,
  closeModal(): void,
  showToast(props:ToastProps): void
}

interface StateProps {
}

interface DispatchProps {
  setData: typeof setData;
}

interface ChangeEmailProps extends OwnProps, StateProps, DispatchProps { }

const ChangeEmailModal: React.FC<ChangeEmailProps> = ({showModal, closeModal, email, showToast, setData}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [formValues, setFormValues] = useState<any>({
    email: '',
    emailRepeat: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [serverError, setServerError] = useState<Error>();

  useEffect(() =>{
    setFormValues({email: email});
    setFormErrors({email: null});
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
    errors.email = formValues.email ? null : 'registration.errors.emailRequired';
    setFormErrors(errors);
    const valid = !Object.values(errors).some(x => (x !== null && x !== ''));
    return valid;
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      updateEmail(formValues.email).then((result) => {
        setData({email: formValues.email});
        showToast({message: t('registration.messages.emailChanged')});
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
          <IonTitle>{t('registration.modals.changeEmail')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={save}>
          <IonList>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.oldEmail')}</IonLabel>
              <IonInput name="email" type="email" value={email} disabled={true}>
              </IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.newEmail')}</IonLabel>
              <IonInput name="email" type="email" value={formValues.email} required={true} onIonChange={e => {
                handleChange('email', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.email && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.email)}
              </p>
            </IonText>}
          </IonList>

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
            </p>
          </IonText>}

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.changeEmail')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>
    </IonModal>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setData
  },
  mapStateToProps: (state) => ({
  }),
  component: ChangeEmailModal
})
