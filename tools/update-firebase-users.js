const admin = require('firebase-admin');
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-wash-training.firebaseio.com'
});

// Get a database reference to our users
const userRef = admin.firestore().collection('users');

let users = [];
userRef
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      })
    });
    async.forEachSeries(users, function(user, cb) {
      admin.auth().getUser(user.id)
        .then(function(userRecord) {
          if (!userRecord || !userRecord.uid) {
            return cb();
          }
          Object.assign(user, {
            email: userRecord.email,
            name: userRecord.name || userRecord.displayName || userRecord.email || 'unknown'
          });
          console.log(user);
          return userRef
            .doc(user.id)
            .set(user, {merge: true})
            .then(() => {
              return cb();
            })
            .catch(function(error) {
              console.log('Error update user data:', error);
              cb();
            });
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);
          cb();
        });
    });
  });

setTimeout(function() {
  process.exit(0)
}, 600000);

