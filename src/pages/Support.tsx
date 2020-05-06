import React, {useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import './Login.scss';
import {connect} from '../data/connect';

interface OwnProps { }

interface DispatchProps { }

interface SupportProps extends OwnProps, DispatchProps { }

const Support: React.FC<SupportProps> = () => {

  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { t } = useTranslation(['translation'], {i18n} );

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!message) {
      setMessageError(true);
    }
    if (message) {
      setMessage('');
      setShowToast(true);
    }
  };

  return (
    <IonPage id="support-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/appicon.png" alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={send}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Enter your support message below</IonLabel>
              <IonTextarea name="message" value={message} spellCheck={false} autocapitalize="off" rows={6} onIonChange={e => setMessage(e.detail.value!)}
                required>
              </IonTextarea>
            </IonItem>

            {formSubmitted && messageError && <IonText color="danger">
              <p className="ion-padding-start">
                Support message is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Submit</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

      <IonToast
        isOpen={showToast}
        duration={3000}
        message="Your support request has been sent"
        onDidDismiss={() => setShowToast(false)} />
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  component: Support
})
