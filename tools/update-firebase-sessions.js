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
      if (!session || !session.lessons || session.completed) {
        return cb();
      }
      let sessionCompleted = true, completedTs = 0;
      Object.values(session.lessons).forEach(value => {
        sessionCompleted = sessionCompleted && value.completed;
        completedTs = value.completed ? Math.max(completedTs, value.completed.toDate().getTime()) : 0;
      });
      if (!sessionCompleted) {
        return cb();
      }
      session.completed = new Date(completedTs);
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
  process.exit(0)
}, 600000);

