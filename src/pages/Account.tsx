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
  IonTitle, IonToast,
  IonToolbar
} from '@ionic/react';
import './Account.scss';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import {RouteComponentProps} from 'react-router';
import {Redirect} from "react-router-dom";
import {getGravatarUrl} from "../util/gravatar";
import ImageZoomModal from "../components/ImageZoomModal";
import ChangePhotoModal from "../components/ChangePhotoModal";
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ChangeProfileModal from "../components/ChangeProfileModal";

export interface ToastProps {
  color?:string;
  header?:string;
  message:string;
}

interface OwnProps extends RouteComponentProps { }

interface StateProps {
  isLoggedIn?: boolean;
  name?: string;
  email?: string;
  photoURL?: string;
  organization?: string;
}

interface DispatchProps {
}

interface AccountProps extends OwnProps, StateProps, DispatchProps { }

const Account: React.FC<AccountProps> = ({ name, email, photoURL, organization, isLoggedIn, history }) => {

  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation(['translation'], {i18n} );

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
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
  const openPhotoModal = () => {
    setShowPhotoModal(true);
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
  const closePhotoModal = () => {
    setShowPhotoModal(false);
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
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('registration.pages.account')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <div className="ion-padding-top ion-text-center">
            <img src={getGravatarUrl(email)} alt="avatar" />
            <h2>{ name }</h2>
            <h3>{ email }</h3>
            <h3>{ organization }</h3>
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
        {/* eslint-disable-next-line react/jsx-no-undef */}
        <ChangeProfileModal showModal={showProfileModal} name={name} organization={organization} closeModal={closeProfileModal} showToast={showToast}/>
        <ChangePasswordModal showModal={showPasswordModal} closeModal={closePasswordModal} showToast={showToast}/>
        <ChangePhotoModal showModal={showPhotoModal} closeModal={closePhotoModal} photo={photoURL} showToast={showToast}/>
        <ChangeEmailModal showModal={showEmailModal} closeModal={closeEmailModal} email={email}  showToast={showToast}/>
        <IonToast isOpen={openToast} header={toastHeader} message={toastMessage} color={toastColor||'success'} duration={2000} onDidDismiss={() => setOpenToast(false)} />
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    name: state.user.name,
    email: state.user.email,
    organization: state.user.organization,
    photoURL: state.user.photoURL,
    isLoggedIn: state.user.isLoggedIn
  }),
  mapDispatchToProps: {
  },
  component: Account
})
