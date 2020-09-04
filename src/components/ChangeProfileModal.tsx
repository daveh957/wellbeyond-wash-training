import React from 'react';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar,} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {ToastProps} from "../pages/Account";
import UpdateProfileForm from "./UpdateProfileForm";
import {Organization, UserProfile} from "../models/User";


interface ChangeProfileProps {
  showModal: boolean,
  closeModal(): void,
  showToast(props:ToastProps): void,
  profile?: UserProfile;
  organizations?: Organization[];
}

const ChangeProfileModal: React.FC<ChangeProfileProps> = ({showModal, closeModal, showToast, profile, organizations}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const onSave = () => {
    showToast({message: t('registration.messages.profileChanged')});
    closeModal();
  };

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('registration.modals.changeProfile')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <UpdateProfileForm profile={profile} organizations={organizations} onSave={onSave} saveButtonLabel={t('registration.modals.changeProfile')} />
      </IonContent>
    </IonModal>
  );
};

export default ChangeProfileModal;
