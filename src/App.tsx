import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonLoading, IonRouterOutlet, IonSplitPane} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import Intercom from 'react-intercom';

import Menu from './components/Menu';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
/* Firebase */
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import {firebaseConfig} from './FIREBASE_CONFIG';

import MainTabs from './pages/MainTabs';
import {connect} from './data/connect';
import {AppContextProvider} from './data/AppContext';
import {loadOrganizations, loadUserData, logoutUser, setAcceptedTerms, setIsLoggedIn} from './data/user/user.actions';
import {loadTrainingData, loadTrainingSessions} from './data/training/training.actions';
import AcceptTerms from './pages/AcceptTerms';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import {useTranslation} from "react-i18next";
import i18n from "./i18n";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
  loading: boolean;
}

interface DispatchProps {
  loadLessonData: typeof loadTrainingData;
  loadUserData: typeof loadUserData;
  loadTrainingSessions: typeof loadTrainingSessions;
  loadOrganizations: typeof loadOrganizations;
  logoutUser: typeof logoutUser;
  setIsLoggedIn: typeof setIsLoggedIn;
  setAcceptedTerms: typeof setAcceptedTerms;
}

interface IonicAppProps extends StateProps, DispatchProps { }

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().enablePersistence()
    .then(function() {
      console.log('Offline persistence enabled')
    })
    .catch(function(err) {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });
}

const IonicApp: React.FC<IonicAppProps> = ({ darkMode, loading, loadLessonData, loadUserData, loadTrainingSessions, loadOrganizations, logoutUser, setIsLoggedIn, setAcceptedTerms}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [intercomUser, setIntercomUser] = useState()

  useEffect(() => {
    const getUserIdHash = firebase.functions().httpsCallable('getUserIdHash');
    firebase.auth().useDeviceLanguage();
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        console.log("We are authenticated now!");
        setIsLoggedIn(true);
        loadUserData();
        loadTrainingSessions();
        if (process.env.NODE_ENV === 'production') {
          getUserIdHash().then(function (result) {
            setIntercomUser({
              user_id: user.uid,
              phone: user.phoneNumber || undefined,
              email: user.email || undefined,
              name: user.displayName || undefined,
              user_hash: result.data.hash
            });
          });
        }
      } else {
        console.log("We did not authenticate.");
        setIsLoggedIn(false);
        setAcceptedTerms(false);
        setIntercomUser(undefined);
      }
    });
    loadLessonData();
    loadOrganizations();
  }, [loadLessonData, loadTrainingSessions, loadUserData, loadOrganizations, setAcceptedTerms, setIsLoggedIn]);

  // @ts-ignore
  return (
      <IonApp className={`${darkMode ? 'dark-theme' : ''}`}>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main" animated={false}>
              <Redirect exact path="/" to="/tabs" />
              <Route path="/tabs" component={MainTabs} />
              <Route path="/account" component={Account} />
              <Route path="/terms" component={AcceptTerms} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/termsOfUse" component={Terms} />
              <Route path="/privacyPolicy" component={Privacy} />
              <Route path="/logout" render={() => {
                logoutUser();
                return <Redirect to="/login" />
              }} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>

          <IonLoading
            isOpen={loading}
            message={t('menu.pleaseWait')}
          />
        <div className="app">
          <Intercom appID="ywg09h0a" alignment={'right'} { ...intercomUser } />
        </div>
      </IonApp>
  )
}

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    loading: state.user.loading
  }),
  // @ts-ignore
  mapDispatchToProps: { loadLessonData: loadTrainingData, loadUserData, loadTrainingSessions, loadOrganizations, logoutUser, setIsLoggedIn, setAcceptedTerms },
  component: IonicApp
});
