const firebase = require('firebase');
const admin = require('firebase-admin');
const Intercom = require('intercom-client');
const async = require('async');

const client = new Intercom.Client({ token: process.env.INTERCOM_API_KEY });
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-wash-training.firebaseio.com'
});

let more = true;
let args = {per_page: 100}
async.whilst (
  function(cb) {
    return cb(null, more);
  },
  function(cb) {
    client.contacts.listBy(args, function(err, resp) {
      if (err) {
        more = false;
        return cb();
      }
      if (resp) {
        const data = resp.toJSON();
        const users = data.body && data.body.data;
        async.forEachSeries(users, function(user, cb1) {
          if (!user.id || !user.email || user.role !== 'user') {
            return cb1();
          }
          admin.auth().getUserByEmail(user.email)
          .then(function(userRecord) {
            if (!userRecord || !userRecord.uid) {
              return cb1();
            }
            client.put('contacts/'+user.id,{external_id: userRecord.uid}, function(err, resp) {
              cb1(err);
            })
          })
          .catch(function(error) {
            console.log('Error fetching user data:', error);
            cb1();
          });
        }, function(err) {
          if (data.pages && data.pages.next && data.pages.next.starting_after) {
            args.starting_after = data.pages.next.starting_after;
          }
          else {
            more = false;
          }
          cb();
        })
      }
    });
  }, function (err) {
    process.exit(0);
  });

setTimeout(function() {
  process.exit(0)
}, 600000);

