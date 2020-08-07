// eslint-disable-next-line no-undef
const admin = require('firebase-admin');
// eslint-disable-next-line no-undef
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-development.firebaseio.com'
});

const organizations = {};
const users = {};

async.series([
  function(cb) {
    const orgRef = admin.firestore().collection('organizations');
    orgRef
      .get()
      .then(orgSnapshot => {
        orgSnapshot.forEach(org => {
          if (org.id && org.data) {
            organizations[org.id] = org.data();
          }
        });
        cb();
      });
  },
  function(cb) {
    const userRef = admin.firestore().collection('users');
    userRef
      .get()
      .then(userSnapshot => {
        userSnapshot.forEach(user => {
          users[user.id] = {
            id: user.id,
            ...user.data()
          };
        });
        cb();
      });
  }
],function() {
  const sessionRef = admin.firestore().collection('sessions');
  const sessions = [];
  sessionRef
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        sessions.push({
          id: doc.id,
          ...doc.data()
        })
      });
      async.forEachSeries(sessions, function(session, cb) {
        if (!session || !session.userId || (session.organizationId && session.organization)) {
          return cb();
        }
        const user = users[session.userId];
        if (!user) {
          return cb();
        }
        session.organizationId = user.organizationId || '';
        session.community = user.community || '';
        session.organization = user.organizationId && organizations[user.organizationId] ? organizations[user.organizationId].name : '';
        return sessionRef
          .doc(session.id)
          .set(session, {merge: true})
          .then(() => {
            return cb();
          })
          .catch(function (error) {
            console.log('Error update user data:', error);
            cb();
          });
      }, function() {
        // eslint-disable-next-line no-undef
        process.exit(0);
      });
    });

});

setTimeout(function() {
  // eslint-disable-next-line no-undef
  process.exit(0)
}, 600000);

