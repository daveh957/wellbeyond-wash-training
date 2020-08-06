/* eslint-disable no-undef */
// At the top of test/index.test.js
const test = require('firebase-functions-test')({
  apiKey: "AIzaSyDMGiTaLTg9wMsB4cKdlUzf4WYT6qbl_sA",
  authDomain: "wellbeyond-development.firebaseapp.com",
  databaseURL: "https://wellbeyond-development.firebaseio.com",
  projectId: "wellbeyond-development",
  storageBucket: "wellbeyond-development.appspot.com",
  messagingSenderId: "580218664538",
  appId: "1:580218664538:web:70d70df7b060994693ca63",
  measurementId: "G-4MWLG9EX11",
  vapidPublicKey: "BHJpZ40fEe6ot9o-q-bTDdgZD92afqZzCAKmV5O4s453LWeHq0-Hp1PwcpRFBH4zWPb7QKogwcramZvsGwPNQ-M"
}, '../.firebase/wellbeyond-development-private-key.json');

// Mock functions config values
test.mockConfig({ intercom: {
  access_token: process.env.intercom_access_token || 'intercomtoken',
  secret_key: process.env.intercom_secret_key || 'websecret',
  android_verification_secret: process.env.intercom_android_verification_secret || 'androidsecret',
  ios_verification_secret: process.env.intercom_ios_verification_secret || 'iossecret',
  web_verification_secret: process.env.web_ios_verification_secret || 'websecret'
}});

// after firebase-functions-test has been initialized
const myFunctions = require('../index.js'); // relative path to functions code

const getUserHash = test.wrap(myFunctions.getUserHash);
const getUserIdHash = test.wrap(myFunctions.getUserIdHash);

let hash;

hash = getUserHash({}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
console.log('getUserHash = ' + hash.hash);

hash = getUserIdHash({}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
console.log('getUserIdHash = ' + hash.hash);

hash = getUserIdHash({platform: 'android'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
console.log('getUserIdHash = ' + hash.hash);

hash = getUserIdHash({platform: 'ios'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
console.log('getUserIdHash = ' + hash.hash);

hash = getUserIdHash({platform: 'web'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
console.log('getUserIdHash = ' + hash.hash);
