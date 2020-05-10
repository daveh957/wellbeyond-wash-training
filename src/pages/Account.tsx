import React, {useState} from 'react';
import {
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
  const closePasswordModal = () => {
    setShowPasswordModal(false);
  }
  const closeEmailModal = () => {
    setShowEmailModal(false);
  }
  const closePhotoModal = () => {
    setShowPhotoModal(false);
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
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <div className="ion-padding-top ion-text-center">
            <img src={getGravatarUrl(email)} alt="avatar" />
            <h2>{ name }</h2>
            <h2>{ email }</h2>
            <IonList inset>
              <IonItem onClick={openPhotoModal}>Change Photo</IonItem>
              <IonItem onClick={openEmailModal}>Change Email</IonItem>
              <IonItem onClick={openPasswordModal}>Change Password</IonItem>
            </IonList>
          </div>
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
