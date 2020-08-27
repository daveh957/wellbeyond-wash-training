import React, {useContext} from 'react';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonLoading,
  IonMenuButton,
  IonPage,
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
import {setIsRegistered, setLoading} from "../data/user/user.actions";
import {Organization, UserProfile} from "../models/User";
import UpdateProfileForm from "../components/UpdateProfileForm";

interface OwnProps extends RouteComponentProps {}

interface StateProps {
  isLoggedIn?: boolean;
  isRegistered?: boolean;
  profile?: UserProfile;
  organizations?: Organization[];
}

interface DispatchProps {
  setIsRegistered: typeof setIsRegistered;
  setLoading: typeof setLoading;
}

interface RegisterProps extends OwnProps, StateProps, DispatchProps { }

const Register: React.FC<RegisterProps> = ({isLoggedIn, isRegistered, profile, organizations, setIsRegistered, setLoading}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const {navigate} = useContext(NavContext);

  const onSave = () => {
    setIsRegistered(true);
    navigate('/terms', 'forward');
  };

  if (isLoggedIn === false) {
    return <Redirect to={'/login'} />
  }
  if (typeof isRegistered === 'undefined') {
    return (
      <IonContent>
        <IonLoading
          isOpen={true}
          message={t('menu.pleaseWait')}
        />
      </IonContent>
    );
  }
  if (isRegistered) {
    return <Redirect to={'/terms'} />
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
          <IonCard>
            <IonCardContent>
              <div className="login-logo">
                <img src="assets/img/appicon.png" alt="WellBeyond logo" />
              </div>
              <p>{t('registration.messages.registerInfo')}</p>

              <UpdateProfileForm profile={profile} organizations={organizations} onSave={onSave} saveButtonLabel={t('registration.buttons.register')} setLoading={setLoading} />

            </IonCardContent>
          </IonCard>

      </IonContent>

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setIsRegistered,
    setLoading,
  },
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    isRegistered: state.user.isRegistered,
    profile: selectors.getUserProfile(state),
    organizations: selectors.getOrganizations(state)
  }),
  component: Register
})
