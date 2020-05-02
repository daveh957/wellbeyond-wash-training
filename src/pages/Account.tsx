import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonItem, IonAlert } from '@ionic/react';
import './Account.scss';
import { useTranslation } from "react-i18next";
import i18n from '../i18n';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';
import {Redirect} from "react-router-dom";
import {getGravatarUrl} from "../util/gravatar";
import * as selectors from "../data/selectors";

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

  const clicked = (text: string) => {
    console.log(`Clicked ${text}`);
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
              <IonItem onClick={() => clicked('Update Picture')}>Change Photo</IonItem>
              <IonItem onClick={() => setShowAlert(true)}>Change Email</IonItem>
              <IonItem onClick={() => clicked('Change Password')}>Change Password</IonItem>
            </IonList>
          </div>
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
