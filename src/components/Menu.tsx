import React from 'react';
import {RouteComponentProps, useLocation, withRouter} from 'react-router';

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonToggle
} from '@ionic/react';
import {fingerPrint, globe, logIn, logOut, moonOutline, notificationsOutline, person} from 'ionicons/icons';
import {useTranslation} from "react-i18next";
import i18n from '../i18n';

import {connect} from '../data/connect';
import {enableNotifications, setDarkMode} from '../data/user/user.actions';

import './Menu.css'
import {Subject} from "../models/Training";
import * as selectors from "../data/selectors";

const routes = {
  loggedInPages: [
    { title: 'menu.account', path: '/account', icon: person },
    { title: 'menu.logout', path: '/logout', icon: logOut }
  ],
  loggedOutPages: [
    { title: 'menu.login', path: '/login', icon: logIn },
    // { title: 'menu.signup', path: '/signup', icon: personAdd }
  ],
  aboutPages: [
    { title: 'menu.terms', path: '/termsOfUse', icon: globe },
    { title: 'menu.privacy', path: '/privacyPolicy', icon: fingerPrint }
  ]
};

interface Pages {
  title: string,
  path: string,
  src?: string,
  icon: string,
  routerDirection?: string
}
interface StateProps {
  darkMode: boolean;
  notificationsOn: boolean;
  isLoggedIn?: boolean;
  menuEnabled: boolean;
  subjects: Subject[]
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode
  enableNotifications: typeof enableNotifications
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps { }

const Menu: React.FC<MenuProps> = ({ darkMode, notificationsOn, isLoggedIn, menuEnabled, subjects, setDarkMode, enableNotifications }) => {
  const location = useLocation();
  const { t } = useTranslation(['translation'], {i18n} );

  function renderlistItems(list: Pages[]) {
    return list
      .filter(route => !!route.path)
      .map(p => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem detail={false} routerLink={p.path} routerDirection="none" className={location.pathname.startsWith(p.path) ? 'selected' : undefined}>
            <IonIcon slot="start" src={p.src} icon={p.src ? undefined: p.icon} />
            <IonLabel>{t(p.title)}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  function renderSubjects() {
    return subjects
      .map(subject => (
        <IonMenuToggle key={subject.id} auto-hide="false">
          <IonItem detail={false} routerLink={'/tabs/subjects/'+subject.id} routerDirection="none" className={location.pathname.endsWith(subject.id) ? 'selected' : undefined}>
            <IonIcon slot="start" src={subject.photo}/>
            <IonLabel>{subject.name}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu  type="overlay" disabled={!menuEnabled} contentId="main">
      <IonContent forceOverscroll={false}>
        {isLoggedIn && <IonList lines="none">
          <IonListHeader>{t('menu.training')}</IonListHeader>
          {renderSubjects()}
        </IonList>}
        <IonList lines="none">
          <IonListHeader>{t('menu.account')}</IonListHeader>
          {isLoggedIn ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
          <IonItem>
            <IonIcon slot="start" icon={moonOutline}></IonIcon>
            <IonLabel>{t('menu.darkMode')}</IonLabel>
            <IonToggle checked={darkMode} onClick={() => setDarkMode(!darkMode)} />
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={notificationsOutline}></IonIcon>
            <IonLabel>{t('menu.notificationsOn')}</IonLabel>
            <IonToggle checked={notificationsOn} onClick={() => enableNotifications(!notificationsOn)} />
          </IonItem>
        </IonList>

        <IonList lines="none">
        <IonListHeader>{t('menu.about')}</IonListHeader>
        {renderlistItems(routes.aboutPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

/*
 */

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    notificationsOn: state.user.notificationsOn,
    isLoggedIn: state.user.isLoggedIn,
    menuEnabled: state.data.menuEnabled,
    subjects: selectors.getSubjectsForOrganization(state)
  }),
  mapDispatchToProps: ({
    setDarkMode,
    enableNotifications,
  }),
  component: withRouter(Menu)
})
