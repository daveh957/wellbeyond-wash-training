import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import { loadUserData, logoutUser, setisLoggedIn, setUsername } from './data/user/user.actions';
import { loadLessonData } from './data/lessons/lesson.actions';
import { authCheck } from './data/user/userApi';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Support from './pages/Support';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
}

interface DispatchProps {
  loadLessonData: typeof loadLessonData;
  loadUserData: typeof loadUserData;
  logoutUser: typeof logoutUser;
  setisLoggedIn: typeof setisLoggedIn;
  setUsername: typeof setisLoggedIn;
}

interface IonicAppProps extends StateProps, DispatchProps { }

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const IonicApp: React.FC<IonicAppProps> = ({ darkMode,   loadLessonData, loadUserData, logoutUser, setisLoggedIn, setUsername: setUsernameAction }) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        console.log("We are authenticated now!");
        setisLoggedIn(true);
        setUsername(user.uid);
      } else {
        console.log("We did not authenticate.");
        setisLoggedIn(false);
        setUsername(undefined);
      }
    });
    loadUserData();
    loadLessonData();
  }, []);

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
                return <Redirect to="/tabs" />
              }} />
              <Route path="/" render={() => <Redirect to="/tabs" />} exact={true} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
  )
}

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    subjects: state.data.subjects,
    lessons: state.data.lessons
  }),
  // @ts-ignore
  mapDispatchToProps: { loadLessonData, loadUserData, logoutUser, setisLoggedIn, setUsername },
  component: IonicApp
});
