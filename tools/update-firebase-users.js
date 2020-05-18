const admin = require('firebase-admin');
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-wash-training.firebaseio.com'
});

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("users");

// Attach an asynchronous callback to read the data at our posts reference
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


setTimeout(function() {
  process.exit(0)
}, 600000);

