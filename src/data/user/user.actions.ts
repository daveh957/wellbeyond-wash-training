import React from 'react';
import {isPlatform} from "@ionic/react";
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
import {Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken} from '@capacitor/core';
import {FCM} from '@capacitor-community/fcm';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import 'firebase/messaging';

declare var intercom: any;

const { PushNotifications, LocalNotifications } = Plugins;
const fcm = new FCM();
export const loadOrganizations = () => async (dispatch: React.Dispatch<any>) => {
  await listenForOrganizationData(function(organizations:Organization[]) {
    dispatch(setOrganizations(organizations));
  });
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
            getMessagingToken();
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
        if (notification.title && notification.body) {
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.title,
                body: notification.body,
                id: notification.id  ? parseInt(notification.id) : Date.now(),
                schedule: { at: new Date(Date.now() + 2000) },
                actionTypeId: "",
                extra: null
              }
            ]
          }).then((notifs) => {
            console.log('scheduled notifications', notifs);
          });
        }
        else if (notification.data && notification.data.title && notification.data.message) {
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.data.title,
                body: notification.data.message,
                id: notification.data.instance_id ? parseInt(notification.data.instance_id) : Date.now(),
                schedule: { at: new Date(Date.now() + 2000) },
                actionTypeId: "",
                extra: null
              }
            ]
          }).then((notifs) => {
            console.log('scheduled notifications', notifs);
          });
        }
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
        getMessagingToken();
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

const getMessagingToken = async () =>  {
// Get Instance ID token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
  console.log('Retrieving FCM messaging token...');
  if (isPlatform('hybrid')) {
    fcm
      .getToken()
      .then((r) => {
        console.log(`Token ${r.token}`);
        try {
          intercom.registerForPush();
          intercom.sendPushTokenToIntercom(r.token);
        }
        catch (err) {
          console.log(err);
        }
      })
      .catch((err) => console.log(err));
  }
  else {
    const messaging = firebase.messaging();
    messaging.getToken().then((currentToken) => {
      if (currentToken) {
        console.log(`Token ${currentToken}`);
        messaging.onMessage((payload) => {
          console.log('Message received. ');
          console.log(payload);
          // ...
        });
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
      }
    })
    .catch((err) => console.log(err));
  }
}

export const watchAuthState = () => async (dispatch: React.Dispatch<any>) => {
  await authCheck((user:any) => {
    if (user != null) {
      dispatch(setIsLoggedIn(true));
      listenForUserProfile((profile:UserProfile) => {
        if (profile) {
          const getUserIdHash = firebase.functions().httpsCallable('getUserIdHash');
          dispatch(setIsRegistered(true));
          dispatch(setAcceptedTerms(!!profile.acceptedTerms));
          dispatch(setNotificationsOn(!!profile.notificationsOn));
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
            if (profile.intercomCompany) {
              intercomUser.company = profile.intercomCompany;
            }
            if (profile.intercomTag) {
              intercomUser.tag = profile.intercomTag;
            }
            console.log('Intercom User: ', intercomUser);
            // @ts-ignore
            if (isPlatform('hybrid')) {
              intercom.setUserHash(result.data.hash);
              intercom.registerIdentifiedUser({userId: profile.id});
              const userUpdate:any = {
                userId: profile.id,
                phone: profile.phoneNumber || null,
                email: profile.email || null,
                name: profile.name || null
              };
              if (profile.intercomCompany) {
                userUpdate.company = {id: profile.intercomCompany};
              }
              if (profile.intercomTag) {
                userUpdate.tag = {id: profile.intercomTag};
              }
              intercom.updateUser(userUpdate);
              intercom.setLauncherVisibility('VISIBLE');
              if (profile.notificationsOn) {
                intercom.registerForPush();
              }
            }
            dispatch(setIntercomUser(intercomUser));
            if (profile.notificationsOn) {
              requestNotificationPermission(dispatch);
            }
          });
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
      if (isPlatform('hybrid')) {
        intercom.registerUnidentifiedUser();
        intercom.setLauncherVisibility('VISIBLE');
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
    dispatch(setTrainingSession(session));
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
