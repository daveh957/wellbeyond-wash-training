// eslint-disable-next-line no-undef
const admin = require('firebase-admin');
// eslint-disable-next-line no-undef
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-wash-training.firebaseio.com'
});

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
      if (!session || !session.groupSize || session.groupSizeNum) {
        return cb();
      }
      const sizes = {
        "1-5": 3,
        "6-10": 8,
        "11-20": 15,
        "21-50": 35,
        "50-100" : 75,
        "More than 100": 100,
      }
      session.groupSizeNum = sizes[session.groupSize] || 1;
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
    });
  });

setTimeout(function() {
  // eslint-disable-next-line no-undef
  process.exit(0)
}, 600000);

