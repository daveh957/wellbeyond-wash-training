/* eslint-disable no-unused-vars,no-undef */
const functions = require('firebase-functions');
const crypto = require('crypto');
const Intercom = require('intercom-client');
const INTERCOM_ACCESS_TOKEN = functions.config().intercom.access_token;
const INTERCOM_SECRET_KEY = functions.config().intercom.secret_key;

/**
 *
 * @type {HttpsFunction & Runnable<any>}
 */
exports.getUserHash = functions.https.onCall((data, context) => {
  const identifier = context.auth.token.email;
  const hash = crypto
    .createHmac('sha256', INTERCOM_SECRET_KEY)
    .update(identifier)
    .digest('hex');
  return {email: context.auth.token.email, hash: hash};
});
exports.getUserIdHash = functions.https.onCall((data, context) => {
  const platform = (data && data.platform) || 'web';
  const identifier = context.auth.token.uid;
  const secret = functions.config().intercom[platform+'_verification_secret'] || INTERCOM_SECRET_KEY;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(identifier)
    .digest('hex');
  return {hash: hash};
});
/*
exports.updateIntercom = functions.database.ref('/users/{userId}').onWrite((change, context) => {
  if (!change.after.exists()) {
    return null; // Don't propagate deletes
  }
  const before = change.before.exists() ? change.before.val() : {};
  const after = change.after.val();

  if (!after.organization || after.organization === before.organization) {
    if (!after.organizationId || after.organizationId === before.organizationId) {
      if (!after.community || after.community === before.community) {
        return null; // No change to the fields we want to sync
      }
    }
  }
});
 */
