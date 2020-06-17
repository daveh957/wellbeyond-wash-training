import React, {useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {setAcceptedTerms, setIsLoggedIn, setLoading} from '../data/user/user.actions';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Redirect} from "react-router-dom";
import {getUserProfile, loginWithEmail} from "../data/user/userApi";
import ForgotPasswordModal from "../components/ForgotPasswordModal";

export interface ToastProps {
  color?:string;
  header?:string;
  message:string;
}

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  acceptedTerms?: boolean;
}

interface DispatchProps {
  setLoading: typeof setLoading;
  setIsLoggedIn: typeof setIsLoggedIn;
  setAcceptedTerms: typeof setAcceptedTerms;
}

interface LoginProps extends OwnProps, StateProps,  DispatchProps { }

const Login: React.FC<LoginProps> = ({isLoggedIn, acceptedTerms, setLoading, setIsLoggedIn, setAcceptedTerms}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [formSubmitted, setFormSubmitted] = useState<boolean>();
  const [usernameError, setUsernameError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [serverError, setServerError] = useState<Error>();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<string|undefined>();
  const [toastHeader, setToastHeader] = useState<string|undefined>();
  const [toastMessage, setToastMessage] = useState<string>();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setFormSubmitted(false);
    setUsernameError('');
    setPasswordError('');
  }, [isLoggedIn])


  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  }
  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  }
  const showToast = ({color, header, message}:ToastProps) =>{
    setToastColor(color);
    setToastHeader(header);
    setToastMessage(message);
    setOpenToast(true);
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!username) {
      setUsernameError('registration.errors.loginUsernameRequired');
    }
    if(!password) {
      setPasswordError('registration.errors.loginPasswordRequired');
    }
    if(username && password) {
      setLoading(true);
      loginWithEmail(username.trim().toLowerCase(), password)
        .then(() => {
          getUserProfile().then((data) => {
            setLoading(false);
            setIsLoggedIn(true);
            // @ts-ignore
            const acceptedTerms = !!(data && data.acceptedTerms);
            setAcceptedTerms(acceptedTerms);
            navigate(acceptedTerms ? '/tabs' : '/terms');
          });
        })
        .catch(error => {
          setLoading(false);
          setServerError(error);
        });
    }
  };

  if (isLoggedIn) {
    return <Redirect to={acceptedTerms ? '/tabs' : '/terms'} />
  }

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('registration.pages.login')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={login}>
        <IonCard>
          <IonCardContent>
            <div className="login-logo">
              <img src="assets/img/appicon.png" alt="WellBeyond logo" />
            </div>
            <p>{t('registration.messages.loginInfo')}</p>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.loginUsername')}</IonLabel>
              <IonInput name="username" type="email" value={username} spellCheck={false} autocapitalize="off" inputmode="email" onIonChange={e => setUsername(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                {t(usernameError)}
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">{t('registration.labels.loginPassword')}</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                {t(passwordError)}
              </p>
            </IonText>}
          </IonList>

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
            </p>
          </IonText>}
          </IonCardContent>
        </IonCard>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.login')}</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">{t('registration.buttons.newuser')}</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton onClick={openForgotPasswordModal} color="light" expand="block">{t('registration.buttons.forgotPassword')}</IonButton>
            </IonCol>
          </IonRow>
      </form>
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <ForgotPasswordModal showModal={showForgotPasswordModal} closeModal={closeForgotPasswordModal} showToast={showToast}/>
        <IonToast isOpen={openToast} header={toastHeader} message={toastMessage} color={toastColor||'success'} onDidDismiss={() => setOpenToast(false)} />

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setLoading,
    setIsLoggedIn,
    setAcceptedTerms,
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    acceptedTerms: state.user.acceptedTerms,
  }),
  component: Login
})
