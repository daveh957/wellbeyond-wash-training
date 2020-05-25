const admin = require('firebase-admin');
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-wash-training.firebaseio.com'
});

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("users");

function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      async.forEachSeries(listUsersResult.users, function(userRecord, cb) {
        let user = userRecord.toJSON();
        admin.firestore().collection('users')
          .doc(user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              return cb();
            }
            admin.firestore().collection('admins')
              .doc(user.uid)
              .get()
              .then(doc => {
                if (doc.exists) {
                  return cb();
                }
                console.log('user not found', user);
                if (!user.email.match(/^sarah\+/)) {
                  return cb();
                }
                admin.auth().deleteUser(user.uid)
                  .then(function() {
                    console.log('Successfully deleted user');
                    cb();
                  })
                  .catch(function(error) {
                    console.log('Error deleting user:', error);
                    cb(error);
                  });
              })
              .catch((err) => {
                console.log('ERROR ', err);
                cb(err);
              });
          })
          .catch((err) => {
            console.log('ERROR ', err);
            cb(err);
          });
      }, function(err) {
        if (!err && listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      });
    })
    .catch(function(error) {
      console.log('Error listing users:', error);
    });
}
// Start listing users from the beginning, 1000 at a time.
listAllUsers();

setTimeout(function() {
  process.exit(0)
}, 600000);

