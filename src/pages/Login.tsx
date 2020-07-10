import React, {useEffect, useRef, Fragment} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import {cfaSignIn, mapUserToUserInfo} from 'capacitor-firebase-auth';
import {UserInfo} from 'firebase/app';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform
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
  const providersRef = useRef<any>(null);
  const googleRef = useRef<any>(null);
  const googleLogin = () => {
    cfaSignIn('google.com').pipe(
      mapUserToUserInfo(),
    ).subscribe(
      (user: UserInfo) => console.log(user.displayName)
    )
    return false;
  };

  const uiShown = () => {
    if (providersRef && providersRef.current && googleRef && googleRef.current) {
        const providers = providersRef.current.getElementsByClassName('firebaseui-idp-list')[0];
        if (providers) {
          providers.appendChild(googleRef.current)
        }
    }
  };

// Configure FirebaseUI.
  const uiConfig = {
    callbacks: {
      uiShown: uiShown
    },
    signInFlow: 'redirect',
    credentialHelper: 'none',
    // Redirect to /register after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
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
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
          type: 'image', // 'audio'
          size: 'invisible', // 'invisible' or 'compact'
          badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
        }
      }
    ]
  };

  if (!isPlatform('hybrid')) {
    uiConfig.signInOptions.push({
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // @ts-ignore
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        }
      });
  }

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
            <div ref={providersRef}>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
            {isPlatform('hybrid') &&
              <ul>
                <li className="firebaseui-list-item" ref={googleRef}>
                  <button type="button" onClick={googleLogin}
                    className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-google firebaseui-id-idp-button"
                    data-provider-id="google.com"  data-upgraded=",MaterialButton"><span
                    className="firebaseui-idp-icon-wrapper"><img className="firebaseui-idp-icon" alt=""
                                                                 src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"/></span><span
                    className="firebaseui-idp-text firebaseui-idp-text-long">Sign in with Google</span><span
                    className="firebaseui-idp-text firebaseui-idp-text-short">Google</span></button>
                </li>
              </ul>
            }
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
