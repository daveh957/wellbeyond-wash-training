import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Redirect} from "react-router-dom";
import {connect} from "../data/connect";

export interface ToastProps {
  color?:string;
  header?:string;
  message:string;
}

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  acceptedTerms?: boolean;
}

interface DispatchProps {
}

interface LoginProps extends OwnProps, StateProps,  DispatchProps { }

const Login: React.FC<LoginProps> = ({isLoggedIn, isRegistered, acceptedTerms, }) => {

  const { t } = useTranslation(['translation'], {i18n} );

// Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'redirect',
    credentialHelper: 'none',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/register',
    tosUrl: '/termsOfUse',
    privacyPolicyUrl: '/privacyPolicy',
    // We will display Email, Google and Phone as auth providers.
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false, // We will ask for display name after sign in
      },
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
      },
      {
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'invisible', // 'invisible' or 'compact'
          badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
        },

      }
    ],
  };

  if (isLoggedIn) {
    if (isRegistered) {
      return <Redirect to={acceptedTerms ? '/tabs' : '/terms'} />
    }
    return <Redirect to='/register'/>
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
        <IonCard>
          <IonCardContent>
            <div className="login-logo">
              <img src="assets/img/appicon.png" alt="WellBeyond logo" />
            </div>
            <p className="login-instructions">{t('registration.messages.loginInfo')}</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    isRegistered: state.user.isRegistered,
    acceptedTerms: state.user.acceptedTerms,
  }),
  component: Login
})
