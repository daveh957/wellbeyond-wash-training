import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
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
  IonToolbar
} from '@ionic/react';
import './Login.scss';
import {loginUser} from '../data/user/user.actions';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Redirect} from "react-router-dom";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  acceptedTerms?: boolean;
  loginError?: any;
}

interface DispatchProps {
  loginUser: typeof loginUser;
}

interface LoginProps extends OwnProps, StateProps,  DispatchProps { }

const Login: React.FC<LoginProps> = ({loginUser, isLoggedIn, acceptedTerms, loginError}) => {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    setUsername('');
    setPassword('');
    setFormSubmitted(false);
    setUsernameError(false);
    setPasswordError(false);
  }, [isLoggedIn])

  const { t } = useTranslation(['translation'], {i18n} );

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!username) {
      setUsernameError(true);
    }
    if(!password) {
      setPasswordError(true);
    }

    if(username && password) {
      loginUser(username, password);
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

        <div className="login-logo">
          <img src="assets/img/appicon.png" alt="WellBeyond logo" />
        </div>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Username</IonLabel>
              <IonInput name="username" type="text" value={username} spellCheck={false} autocapitalize="off" onIonChange={e => setUsername(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
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
              <IonButton type="submit" expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    loginUser
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    acceptedTerms: state.user.acceptedTerms,
    loginError: state.user.loginError
  }),
  component: Login
})
