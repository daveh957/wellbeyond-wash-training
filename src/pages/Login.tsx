import React, {useState, useEffect, useContext} from 'react';
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
  IonToolbar, NavContext
} from '@ionic/react';
import './Login.scss';
import {setAcceptedTerms, setData, setIsLoggedIn, setLoading} from '../data/user/user.actions';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {Redirect} from "react-router-dom";
import {getUserProfile, loginWithEmail} from "../data/user/userApi";

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

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [serverError, setServerError] = useState<Error>();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setFormSubmitted(false);
    setUsernameError(false);
    setPasswordError(false);
  }, [isLoggedIn])


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
      setLoading(true);
      loginWithEmail(username, password)
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

          {formSubmitted && serverError && <IonText color="danger">
            <p className="ion-padding-start">
              {serverError.message}
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
