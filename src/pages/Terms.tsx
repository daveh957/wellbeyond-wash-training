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
import TermsOfService from "../components/TermsOfService";

interface OwnProps {
}

interface StateProps {
}

interface DispatchProps {
}

type TermsPageProps = OwnProps & StateProps & DispatchProps;

const TermsPage: React.FC<TermsPageProps> = () => {

  const pageRef = useRef<HTMLElement>(null);
  const { t } = useTranslation(['translation'], {i18n} );
  return (
    <IonPage ref={pageRef} id="terms-of-use">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t('menu.terms')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonCard>
          <IonCardContent>
            <TermsOfService />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: React.memo(TermsPage)
});
