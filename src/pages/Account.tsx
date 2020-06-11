import React, {useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react';
import './Account.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import * as selectors from "../data/selectors";
import {RouteComponentProps} from 'react-router';
import {Redirect} from "react-router-dom";
import {getGravatarUrl} from "../util/gravatar";
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ChangeProfileModal from "../components/ChangeProfileModal";
import {UserProfile} from "../models/User";

export interface ToastProps {
  color?:string;
  header?:string;
  message:string;
}

interface OwnProps extends RouteComponentProps { }

interface StateProps {
  isLoggedIn?: boolean;
  userProfile?: UserProfile;
}

interface DispatchProps {
}

interface AccountProps extends OwnProps, StateProps, DispatchProps { }

const Account: React.FC<AccountProps> = ({ isLoggedIn, userProfile,  }) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [toastColor, setToastColor] = useState<string|undefined>();
  const [toastHeader, setToastHeader] = useState<string|undefined>();
  const [toastMessage, setToastMessage] = useState<string>();

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  }
  const openEmailModal = () => {
    setShowEmailModal(true);
  }
  const openProfileModal = () => {
    setShowProfileModal(true);
  }
  const closePasswordModal = () => {
    setShowPasswordModal(false);
  }
  const closeEmailModal = () => {
    setShowEmailModal(false);
  }
  const closeProfileModal = () => {
    setShowProfileModal(false);
  }
  const showToast = ({color, header, message}:ToastProps) =>{
    setToastColor(color);
    setToastHeader(header);
    setToastMessage(message);
    setOpenToast(true);
  }
  if (isLoggedIn === false) {
    return <Redirect to="/login" />
  }

  return (
    <IonPage id="account-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton/>
          </IonButtons>
          <IonTitle>{t('registration.pages.account')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      {userProfile && <IonContent>
        <div className="ion-padding-top ion-text-center">
            <img src={userProfile.photoURL || getGravatarUrl(userProfile.email)} alt={t('registration.labels.avatar')} />
            <h2>{ userProfile.name }</h2>
            <h3>{ userProfile.email }</h3>
            <h3>{ userProfile.organization }</h3>
            <IonList inset>
              <IonItem>
                <IonButton expand="full" fill="clear" color="secondary" onClick={openProfileModal}>{t('registration.modals.changeProfile')}</IonButton>
              </IonItem>
              <IonItem>
                <IonButton expand="full" fill="clear" color="secondary" onClick={openEmailModal}>{t('registration.modals.changeEmail')}</IonButton>
              </IonItem>
              <IonItem>
                <IonButton expand="full" fill="clear" color="secondary" onClick={openPasswordModal}>{t('registration.modals.changePassword')}</IonButton>
              </IonItem>
            </IonList>
          </div>
        <ChangePasswordModal showModal={showPasswordModal} closeModal={closePasswordModal} showToast={showToast}/>
        <ChangeEmailModal showModal={showEmailModal} closeModal={closeEmailModal} email={userProfile.email}  showToast={showToast}/>
        <IonToast isOpen={openToast} header={toastHeader} message={toastMessage} color={toastColor||'success'} duration={2000} onDidDismiss={() => setOpenToast(false)} />
      </IonContent>}
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userProfile: selectors.getUserProfile(state)
  }),
  mapDispatchToProps: {
  },
  component: Account
})
