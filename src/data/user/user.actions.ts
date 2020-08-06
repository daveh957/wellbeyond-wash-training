import {
  isPlatform
} from "@ionic/react";
import {
  authCheck,
  createOrUpdateLessonProgress,
  createOrUpdateTrainingSession,
  listenForOrganizationData,
  listenForTrainingSessions,
  listenForUserLessons,
  listenForUserProfile,
  logout,
  updateProfile
} from './userApi';
import {ActionType} from '../../util/types'
import {TrainingSessions, UserLessons, UserState} from './user.state';
import {LessonProgress, TrainingSession} from "../../models/Training";
import {IntercomUser, Organization, UserProfile} from "../../models/User";
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';
import { FCM } from '@capacitor-community/fcm';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/messaging';
import {firebaseConfig} from "../../FIREBASE_CONFIG";

declare var intercom: any;

const { PushNotifications } = Plugins;
const fcm = new FCM();

export const loadOrganizations = () => async (dispatch: React.Dispatch<any>) => {
  listenForOrganizationData(function(organizations:Organization[]) {
    dispatch(setOrganizations(organizations));
  });
}

export const setupMessaging = () => async (dispatch: React.Dispatch<any>) =>  {
  if (isPlatform('hybrid')) {
    intercom.setLauncherVisibility('VISIBLE');
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
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then( result => {
      if (result.granted) {
        console.log('Notification permission granted.');
        dispatch(setNotificationsOn(true));
        updateProfile({notificationsOn: true}); // Don't wait for it to complete since we have offline support
        PushNotifications.register() // Register with Apple / Google to receive push via APNS/FCM
          .then(() => {
            getMessagingToken(dispatch);
          })
          .catch((err) => alert(JSON.stringify(err)));
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
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
    fcm
      .getToken()
      .then((r) => {
        console.log(`Token ${r.token}`)
        // Subscribe to a specific topic
        fcm
          .subscribeTo({ topic: 'test' })
          .then((r) => {
            console.log(`subscribed to test topic`)
          })
          .catch((err) => {
            console.log(err)
          });
      })
      .catch((err) => console.log(err));
    //
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
          dispatch(setUserProfile(profile));
          const platform = isPlatform('ios') ? 'ios' : (isPlatform('android') ? 'android' : 'web');
          getUserIdHash({platform: platform}).then(function (result) {
            console.log('userId: '+ profile.id + ', userIdHash: ' + result.data.hash);
            const intercomUser:IntercomUser = {
              user_id: profile.id,
              phone: profile.phoneNumber || undefined,
              email: profile.email || undefined,
              name: profile.name || undefined,
              user_hash: result.data.hash
            };
            // @ts-ignore
            if (isPlatform('hybrid')) {
              intercom.registerIdentifiedUser(intercomUser);
            }
            dispatch(setIntercomUser(intercomUser));
          });
          if (profile.notificationsOn) {
            getMessagingToken(dispatch);
          }
        }
        else {
          dispatch(setIsRegistered(false));
          dispatch(setAcceptedTerms(false));
        }
      });
      listenForUserLessons((lessons:UserLessons) => {
        dispatch(setUserLessons(lessons));
      });
      listenForTrainingSessions((sessions:TrainingSessions) => {
        dispatch(setTrainingSessions(sessions));
      });
    } else {
      dispatch(setIsLoggedIn(false));
      if (isPlatform('hybrid')) {
        intercom.registerUnidentifiedUser();
      }
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
  else {
    dispatch(setUserLesson(lesson));
    createOrUpdateLessonProgress(lesson); // Don't wait for it to complete since we have offline support
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

export const setUserLessons = (lessons: UserLessons) => ({
  type: 'set-user-lessons',
  lessons
} as const);

export const setUserLesson = (lesson: LessonProgress) => ({
  type: 'set-user-lesson',
  lesson
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
  | ActionType<typeof setUserLessons>
  | ActionType<typeof setUserLesson>
  | ActionType<typeof setUserProfile>
  | ActionType<typeof setIntercomUser>
  | ActionType<typeof setOrganizations>
  | ActionType<typeof setTrainingSessions>
  | ActionType<typeof setTrainingSession>
  | ActionType<typeof setSessionArchived>
