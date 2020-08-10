import {
  isPlatform
} from "@ionic/react";
import {
  authCheck,
  createOrUpdateTrainingSession,
  listenForOrganizationData,
  listenForTrainingSessions,
  listenForUserProfile,
  logout,
  updateProfile
} from './userApi';
import {ActionType} from '../../util/types'
import {TrainingSessions, UserState} from './user.state';
import {LessonProgress, TrainingSession} from "../../models/Training";
import {IntercomUser, Organization, UserProfile} from "../../models/User";
import * as firebase from "firebase/app";
import 'firebase/functions';
import 'firebase/messaging';
import {firebaseConfig} from "../../FIREBASE_CONFIG";

export const loadOrganizations = () => async (dispatch: React.Dispatch<any>) => {
  listenForOrganizationData(function(organizations:Organization[]) {
    dispatch(setOrganizations(organizations));
  });
}

export const setupMessaging = () => async (dispatch: React.Dispatch<any>) =>  {
  if (isPlatform('hybrid')) {
  }
  else {
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey(firebaseConfig.vapidPublicKey);

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(() => {
      messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        console.log(refreshedToken);
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        // setTokenSentToServer(false);
        // Send Instance ID token to app server.
        // sendTokenToServer(refreshedToken);
        // ...
      }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        // showToken('Unable to retrieve refreshed token ', err);
      });
    });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  }
}

const requestNotificationPermission = async (dispatch: React.Dispatch<any>) =>  {
  console.log('Requesting permission...');
  if (isPlatform('hybrid')) {
  }
  else {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        dispatch(setNotificationsOn(true));
        updateProfile({notificationsOn: true}); // Don't wait for it to complete since we have offline support
        getMessagingToken(dispatch);
        // [START_EXCLUDE]
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        // [END_EXCLUDE]
      } else {
        dispatch(setNotificationsOn(false));
        updateProfile({notificationsOn: false}); // Don't wait for it to complete since we have offline support
        console.log('Unable to get permission to notify.');
      }
    });
  }
}

const getMessagingToken = async (dispatch: React.Dispatch<any>) =>  {
// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
  console.log('Retrieving FCM messaging token...');
  if (isPlatform('hybrid')) {
  }
  else {
    const messaging = firebase.messaging();
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        console.log('Token retrieved.');
        console.log(currentToken);
        // sendTokenToServer(currentToken);
        // updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // showToken('Error retrieving Instance ID token. ', err);
      // setTokenSentToServer(false);
    });
  }
}

export const watchAuthState = () => async (dispatch: React.Dispatch<any>) => {
  authCheck((user:any) => {
    if (user != null) {
      dispatch(setIsLoggedIn(true));
      listenForUserProfile((profile:UserProfile) => {
        if (profile) {
          const getUserIdHash = firebase.functions().httpsCallable('getUserIdHash');
          dispatch(setIsRegistered(true));
          dispatch(setAcceptedTerms(!!profile.acceptedTerms));
          dispatch(setNotificationsOn(!!profile.notificationsOn));
          dispatch(setUserProfile(profile));
          if (process.env.NODE_ENV === 'production') {
            getUserIdHash().then(function (result) {
              dispatch(setIntercomUser({
                user_id: profile.id,
                phone: profile.phoneNumber || undefined,
                email: profile.email || undefined,
                name: profile.name || undefined,
                user_hash: result.data.hash
              }));
            });
          }
        }
        else {
          dispatch(setIsRegistered(false));
          dispatch(setAcceptedTerms(false));
        }
      });
      listenForTrainingSessions((sessions:TrainingSessions) => {
        dispatch(setTrainingSessions(sessions));
      });
    } else {
      dispatch(setIsLoggedIn(false));
      dispatch(setIntercomUser(undefined));
    }
  })
}

export const acceptTerms = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setAcceptedTerms(true));
  updateProfile({acceptedTerms: true}); // Don't wait for it to complete since we have offline support
};

export const enableNotifications = (notificationsOn:boolean) => async (dispatch: React.Dispatch<any>) => {
  if (notificationsOn) {
    requestNotificationPermission(dispatch);
  }
  else {
    dispatch(setNotificationsOn(notificationsOn));
    updateProfile({notificationsOn: notificationsOn}); // Don't wait for it to complete since we have offline support
  }
};

export const logoutUser = () => async (dispatch: React.Dispatch<any>) => {
  logout();
  dispatch(resetData());
};

export const startTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  createOrUpdateTrainingSession(session);
  dispatch(setTrainingSession(session));
};

export const updateTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  createOrUpdateTrainingSession(session);
  dispatch(setTrainingSession(session));
};

export const updateTrainingLesson = (session: TrainingSession|undefined, lesson: LessonProgress) => async (dispatch: React.Dispatch<any>) => {
  if (session) {
    session.lessons = session.lessons || {};
    session.lessons[lesson.lessonId] = lesson;
    createOrUpdateTrainingSession(session);
  }
};

export const archiveTrainingSession = (session: TrainingSession) => async (dispatch: React.Dispatch<any>) => {
  session.archived = true;
  createOrUpdateTrainingSession(session);
  dispatch(setSessionArchived(session));
};

export const setLoading = (isLoading: boolean) => ({
  type: 'set-user-loading',
  isLoading
} as const);

export const setData = (data: Partial<UserState>) => ({
  type: 'set-user-data',
  data
} as const);

export const resetData = () => ({
  type: 'reset-user-data'
} as const);

export const setIsLoggedIn = (loggedIn: boolean) => {
  return ({
    type: 'set-is-loggedin',
    loggedIn
  } as const);
};

export const setIsRegistered = (registered: boolean) => {
  return ({
    type: 'set-is-registered',
    registered
  } as const)
};

export const setDarkMode = (darkMode: boolean) => ({
  type: 'set-dark-mode',
  darkMode
} as const);

export const setNotificationsOn = (notificationsOn: boolean) => ({
  type: 'set-notifications-on',
  notificationsOn
} as const);

export const setAcceptedTerms = (acceptedTerms?: boolean) => ({
  type: 'set-accepted-terms',
  acceptedTerms
} as const);

export const setUserProfile = (profile: UserProfile) => ({
  type: 'set-user-profile',
  profile
} as const);

export const setIntercomUser = (intercomUser?: IntercomUser) => ({
  type: 'set-intercom-user',
  intercomUser
} as const);

export const setOrganizations = (organizations: Organization[]) => ({
  type: 'set-organizations',
  organizations
} as const);

export const setTrainingSessions = (sessions: TrainingSessions) => ({
  type: 'set-training-sessions',
  sessions
} as const);

export const setTrainingSession = (session: TrainingSession) => ({
  type: 'set-training-session',
  session
} as const);

export const setSessionArchived = (session: TrainingSession) => ({
  type: 'set-session-archived',
  session
} as const);

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof resetData>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setIsRegistered>
  | ActionType<typeof setDarkMode>
  | ActionType<typeof setNotificationsOn>
  | ActionType<typeof setAcceptedTerms>
  | ActionType<typeof setUserProfile>
  | ActionType<typeof setIntercomUser>
  | ActionType<typeof setOrganizations>
  | ActionType<typeof setTrainingSessions>
  | ActionType<typeof setTrainingSession>
  | ActionType<typeof setSessionArchived>
