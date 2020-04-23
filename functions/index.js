const functions = require('firebase-functions');
const crypto = require('crypto');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.getUserHash = functions.https.onCall((data, context) => {
  const secretKey = 'oSQZgcVNTsUwhyEO72AmuwVE8KUu4dy9T0pYz1Sy';
  const identifier = context.auth.token.email;
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(identifier)
    .digest('hex');
  return {email: context.auth.token.email, hash: hash};
});
