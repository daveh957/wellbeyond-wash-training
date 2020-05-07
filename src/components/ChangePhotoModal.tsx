import React from 'react';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar,} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface ChangePhotoProps {
  showModal: boolean,
  closeModal(): void
  photo: string
}

const ChangePhotoModal: React.FC<ChangePhotoProps> = ({showModal, closeModal, photo}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  return (
    <IonModal isOpen={showModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              {t('buttons.close')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('resources.lessons.imageZoom')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      </IonContent>
    </IonModal>
  );
};

export default ChangePhotoModal;
