/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

if ("function" === typeof importScripts) {
  importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

  const env = new URL(location).searchParams.get('env');
  const fbConf = new URL(location).searchParams.get('fbConf');
  if (env && fbConf && firebase) {
    const firebaseConfig = JSON.parse(fbConf);

    console.log('Environment: ', env);
    console.log('Firebase Config: ', firebaseConfig);

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // If you would like to customize notifications that are received in the
    // background (Web app is closed or not in browser focus) then you should
    // implement this optional method.
    messaging.setBackgroundMessageHandler(function(payload) {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      // Customize notification here
      const notificationTitle = 'Background Message Title';
      const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
      };

      return self.registration.showNotification(notificationTitle,
        notificationOptions);
    });
  }
}
