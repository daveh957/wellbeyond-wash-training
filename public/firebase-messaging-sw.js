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

  }
}
