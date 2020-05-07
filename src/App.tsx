import React, {useContext, useEffect, useState} from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, IonLoading} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
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
import * as firebase from 'firebase';
import { firebaseConfig } from './FIREBASE_CONFIG';

import MainTabs from './pages/MainTabs';
import { connect } from './data/connect';
import { AppContextProvider } from './data/AppContext';
import { loadUserData, logoutUser, setIsLoggedIn } from './data/user/user.actions';
import { loadLessonData } from './data/training/training.actions';
import { authCheck } from './data/user/userApi';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Support from './pages/Support';
import HomeOrLogin from "./pages/HomeOrLogin";
import { Lesson, Subject } from './models/Training';
import {useTranslation} from "react-i18next";
import i18n from "./i18n";

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
  isLoggedIn?: boolean;
  loading: boolean;
}

interface DispatchProps {
  loadLessonData: typeof loadLessonData;
  loadUserData: typeof loadUserData;
  logoutUser: typeof logoutUser;
  setIsLoggedIn: typeof setIsLoggedIn;
}

interface IonicAppProps extends StateProps, DispatchProps { }

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().enablePersistence()
    .then(function() {
      console.log('Offline persistence enabled')
    })
    .catch(function(err) {
      if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
        // ...
      } else if (err.code == 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
        // ...
      }
    });
}

const IonicApp: React.FC<IonicAppProps> = ({ darkMode, isLoggedIn, loading, loadLessonData, loadUserData, logoutUser, setIsLoggedIn}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [intercomUser, setIntercomUser] = useState()

  useEffect(() => {
    const getUserIdHash = firebase.functions().httpsCallable('getUserIdHash');
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        console.log("We are authenticated now!");
        loadLessonData();
        setIsLoggedIn(true);
        getUserIdHash().then(function(result) {
          setIntercomUser({
            user_id: user.uid,
            phone: user.phoneNumber || undefined,
            email: user.email || undefined,
            name: user.displayName || undefined,
            user_hash: result.data.hash
          });
        });
      } else {
        console.log("We did not authenticate.");
        setIsLoggedIn(false);
        setIntercomUser(undefined);
      }
      loadUserData();
    });
  }, []);

  // @ts-ignore
  return (
      <IonApp className={`${darkMode ? 'dark-theme' : ''}`}>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/tabs" component={MainTabs} />
              <Route path="/account" component={Account} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/support" component={Support} />
              <Route path="/logout" render={() => {
                logoutUser();
                return <Redirect to="/login" />
              }} />
              <Route path="/" component={HomeOrLogin} exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>

          <IonLoading
            isOpen={loading}
            message={'Please wait...'}
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
    isLoggedIn: state.user.isLoggedIn,
    loading: state.user.loading
  }),
  // @ts-ignore
  mapDispatchToProps: { loadLessonData, loadUserData, logoutUser, setIsLoggedIn },
  component: IonicApp
});
