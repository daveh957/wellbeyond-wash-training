import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { useTranslation } from "react-i18next";
import i18n from '../i18n';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';
import {registerUser} from "../data/user/user.actions";
import { Registration } from "../models/User";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  registerUser: typeof registerUser;
}

interface SignupProps extends OwnProps,  DispatchProps { }

const Signup: React.FC<SignupProps> = ({registerUser,  history}) => {

  const [formValues, setFormValues] = useState<any>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    organization: ''
  });

  const [formErrors, setFormErrors] = useState<any>({});

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (field:string, value:string) => {
    formErrors[field] = false;
    setFormErrors(formErrors);
    formValues[field] = value;
    setFormValues(formValues);
  }
  const validate = ():boolean => {
    formErrors.name = formValues.name ? null : 'registration.errors.nameRequired';
    formErrors.email = formValues.email ? null : 'registration.errors.emailRequired';
    formErrors.password = formValues.password ? (formValues.password.length >= 8 ? null :  'registration.errors.passwordLength') : 'registration.errors.passwordRequired';
    formErrors.passwordRepeat = (formValues.password === formValues.passwordRepeat ? null :  'registration.errors.passwordMismatch');
    setFormErrors(formErrors);
    const valid = !Object.values(formErrors).some(x => (x !== null && x !== ''));
    return valid;
  }
  const sanitizeFormValues = ({ passwordRepeat, ...registration }:any):Registration => registration as Registration;

  const { t } = useTranslation(['translation'], {i18n} );

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(validate()) {
      await registerUser(sanitizeFormValues(formValues));
      history.push('/tabs/training', {direction: 'none'});
    }
  };

  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login">
          <img src="assets/img/appicon.png" alt="WellBeyond logo" />
        </div>

        <form noValidate onSubmit={signup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
              <IonInput name="name" type="text" value={formValues.name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
                handleChange('name', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.name && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.name)}
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.email')}</IonLabel>
              <IonInput name="email" type="text" value={formValues.email} spellCheck={false} required={true} autocapitalize="off" autocomplete="on" onIonChange={e => {
                handleChange('email', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>

            {formSubmitted && formErrors.email && <IonText color="danger">
              <p className="ion-padding-start">
                {t(formErrors.email)}
              </p>
            </IonText>}

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

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.organization')}</IonLabel>
              <IonInput name="organization" type="text" value={formValues.organization} spellCheck={false} onIonChange={e => {
                handleChange('organization', e.detail.value!);
              }}>
              </IonInput>
            </IonItem>
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Create</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    registerUser,
  },
  component: Signup
})
