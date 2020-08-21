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
  api_key: process.env.INTERCOM_API_KEY || 'intercomapikey',
  access_token: process.env.INTERCOM_ACCESS_TOKEN || 'intercomtoken',
  secret_key: process.env.INTERCOM_SECRET_KEY || 'websecret',
  android_verification_secret: process.env.INTERCOM_ANDROID_VERIFICATION_SECRET || 'androidsecret',
  ios_verification_secret: process.env.INTERCOM_IOS_VERIFICATION_SECRET || 'iossecret',
  web_verification_secret: process.env.INTERCOM_WEB_VERIFICATION_SECRET || 'websecret'
}});

// after firebase-functions-test has been initialized
const myFunctions = require('../index.js'); // relative path to functions code

const getUserHash = test.wrap(myFunctions.getUserHash);
const getUserIdHash = test.wrap(myFunctions.getUserIdHash);
const getIntercomTags = test.wrap(myFunctions.getIntercomTags);
const getIntercomCompanies = test.wrap(myFunctions.getIntercomCompanies);
const updateIntercomUser = test.wrap(myFunctions.updateIntercomUser);

describe('updateIntercomUser', () => {
  it('should update Intercom', (done) => {
    const beforeSnap = test.firestore.makeDocumentSnapshot({name: 'test'}, 'users/GQvUrwq2Q2NXUa8yRPVDKhxqAZY2');
    const afterSnap = test.firestore.makeDocumentSnapshot({name: 'test', organizationId: 'GCQVJPBWwNUWJEsAuXpq', community: 'Olpejata'}, 'users/GQvUrwq2Q2NXUa8yRPVDKhxqAZY2');
    const change = test.makeChange(beforeSnap, afterSnap);

    updateIntercomUser(change, {params: {userId: 'GQvUrwq2Q2NXUa8yRPVDKhxqAZY2'}}).then((result) => {
      console.log(result);
      done();
    });
  });
});

describe('getIntercomCompanies', () => {
  it('should return the companies', (done) => {
    getIntercomCompanies().then((companies) => {
      console.log(companies);
      done();
    });
  });
});

describe('getIntercomTags', () => {
  it('should return the tags', (done) => {
    getIntercomTags().then((tags) => {
      console.log(tags);
      done();
    });
  });
});

describe('getUserHash', () => {
  it('should hash an email', () => {
  const hash = getUserHash({}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
  console.log('getUserHash = ' + hash.hash);
  });
});

describe('getUserIdHash', () => {
  it('should hash an id', () => {
    let hash;
    hash = getUserIdHash({}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
    console.log('getUserIdHash = ' + hash.hash);

    hash = getUserIdHash({platform: 'android'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
    console.log('getUserIdHash = ' + hash.hash);

    hash = getUserIdHash({platform: 'ios'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
    console.log('getUserIdHash = ' + hash.hash);

    hash = getUserIdHash({platform: 'web'}, {auth: {token: {uid: 'TMxgSoJjHWgNi9FzmoWM8oiC2JN2', email: 'daveh957@gmail.com'}}});
    console.log('getUserIdHash = ' + hash.hash);
  });
});
