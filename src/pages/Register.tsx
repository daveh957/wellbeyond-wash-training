import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  IonAlert,
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
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  NavContext
} from '@ionic/react';
import './Login.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import * as selectors from "../data/selectors";
import {RouteComponentProps} from 'react-router';
import {Redirect} from "react-router-dom";
import {registerWithEmail, updateProfile} from "../data/user/userApi";
import {loadUserData, setIsLoggedIn, setIsRegistered, setLoading} from "../data/user/user.actions";
import {Organization, UserProfile} from "../models/User";
import OrganizationAndCommunity from "../components/OrganizationAndCommunity";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  userProfile?: UserProfile;
  organizations?: Organization[];
}

interface DispatchProps {
  setLoading: typeof setLoading;
  setIsRegistered: typeof setIsRegistered;
  loadUserData: typeof loadUserData;
}

interface RegisterProps extends OwnProps, StateProps, DispatchProps { }

const Register: React.FC<RegisterProps> = ({isLoggedIn, isRegistered, userProfile, organizations,setLoading, setIsRegistered, loadUserData}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const [profile, setProfile] = useState<UserProfile>(userProfile || {} as UserProfile);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [serverError, setServerError] = useState<Error>();
  const [nameError, setNameError] = useState();
  const [organizationError, setOrganizationError] = useState();

  useEffect (() => {
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userProfile]);

  const validate = ():boolean => {
    setNameError(profile.name ? undefined :'registration.errors.nameRequired');
    setOrganizationError(profile.organizationId || profile.organization ? undefined : 'registration.errors.organizationRequired');
    return !!(profile.name && (profile.organizationId || profile.organization));
  }

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setServerError(undefined);
    if(validate()) {
      setLoading(true);
        updateProfile(profile)
          .then(() => {
            setLoading(false);
            setIsRegistered(true);
            navigate('/terms', 'forward');
          })
          .catch(error => {
            setLoading(false);
            setServerError(error);
          });
    }
  };

  if (isLoggedIn === false) {
    return <Redirect to={'/login'} />
  }
  if (isRegistered) {
    // return <Redirect to={'/terms'} />
  }
  // @ts-ignore
  return (
    <IonPage id="register-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('registration.pages.register')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form noValidate onSubmit={register}>
          <IonCard>
            <IonCardContent>
              <div className="login-logo">
                <img src="assets/img/appicon.png" alt="WellBeyond logo" />
              </div>
              <p>{t('registration.messages.registerInfo')}</p>

              <IonList>
                <IonItem>
                  <IonLabel position="stacked" color="primary">{t('registration.labels.name')}</IonLabel>
                  <IonInput name="name" type="text" value={profile.name} spellCheck={false} autocapitalize="on" autocomplete="on" required={true} onIonChange={e => {
                    setProfile(Object.assign(profile, {name: e.detail.value!}));
                  }}>
                  </IonInput>
                </IonItem>

                {formSubmitted && nameError && <IonText color="danger">
                  <p className="ion-padding-start">
                    {t(nameError)}
                  </p>
                </IonText>}
              </IonList>

              <OrganizationAndCommunity organizations={organizations} profile={profile} setProfile={setProfile} error={organizationError} />

              {formSubmitted && serverError && <IonText color="danger">
                <p className="ion-padding-start">
                  {serverError.message}
                </p>
              </IonText>}
            </IonCardContent>
          </IonCard>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">{t('registration.buttons.register')}</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setLoading,
    setIsRegistered,
    loadUserData
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    isRegistered: state.user.isRegistered,
    userProfile: selectors.getUserProfile(state),
    organizations: selectors.getOrganizations(state)
  }),
  component: Register
})
