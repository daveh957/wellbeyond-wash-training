import React, {useRef} from 'react';

import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import './TrainingPage.scss'

import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {connect} from '../data/connect';
import PrivacyPolicy from "../components/PrivacyPolicy";

interface OwnProps {
}

interface StateProps {
}

interface DispatchProps {
}

type PrivacyPageProps = OwnProps & StateProps & DispatchProps;

const PrivacyPage: React.FC<PrivacyPageProps> = () => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );
  return (
    <IonPage ref={pageRef} id="privacy-policy">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t('menu.privacy')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonCard>
          <IonCardContent>
            <PrivacyPolicy />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: React.memo(PrivacyPage)
});
