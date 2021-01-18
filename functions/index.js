/* eslint-disable no-unused-vars,no-undef */
const functions = require('firebase-functions');
const crypto = require('crypto');
const async = require('async');
const Intercom = require('intercom-client');
const INTERCOM_ACCESS_TOKEN = functions.config().intercom.access_token;
const INTERCOM_SECRET_KEY = functions.config().intercom.secret_key;
const admin = require('firebase-admin');
admin.initializeApp();

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

exports.getIntercomTags = functions.https.onCall((data, context) => {
  const apiKey = functions.config().intercom.api_key;
  const client = new Intercom.Client({ token: apiKey });
  return client.tags.list().then((resp) => {
    if (!resp) {
      console.log(err || 'No response from tags list');
      return []
    }
    const data = resp.toJSON();
    const records = data.body && data.body.data;
    return records || []
  }).catch((err) => {
    console.log(err);
    return [];
  });
});

exports.getIntercomCompanies = functions.https.onCall((data, context) => {
  const apiKey = functions.config().intercom.api_key;
  const client = new Intercom.Client({ token: apiKey });
  let more = true;
  let page = 1;
  let companies = [];

  return new Promise ( (resolve, reject) => {
    async.whilst (
      function(cb) {
        return cb(null, more);
      },
      function(cb) {
        let args = {page: page, per_page: 50}
        client.companies.listBy(args, function(err, resp) {
          if (err) {
            more = false;
            return cb();
          }
          if (resp) {
            const data = resp.toJSON();
            const records = data.body && data.body.data;
            companies = companies.concat(records);
            if (data.body.pages && data.body.pages.total_pages && data.body.pages.total_pages > page) {
              page++;
            }
            else {
              more = false;
            }
            cb();
          }
        });
      }, function () {
        resolve(companies);
      });
  });
});

function doIntercomUpdate (userId, organizationId, community) {

  const apiKey = functions.config().intercom.api_key;
  const client = new Intercom.Client({ token: apiKey });
  const result = {};
  let organization;
  let contact;
  let tag;
  let company;

  return new Promise ( (resolve, reject) => {
    async.series([
      function (cb) {
        // Retrieve the organization record from Firebase
        admin.firestore().collection('organizations').doc(organizationId).get().then(doc => {
          if (doc.exists) {
            organization = {
              id: doc.id,
              ...doc.data()
            };
          }
          else {
            console.log('Organization not found');
          }
          return cb();
        })
          .catch(error => {
            console.log("Error getting organization:", error);
            cb();
          });
      },
      function (cb) {
        // Read the intercom user (retry up to 12 times)
        let retries = 0;
        async.whilst(function(cb1) {
          return cb1(null, !contact && retries < 12);
        }, function(cb1) {
          if (retries) {
            console.log('Retrying contact search in Intercom');
          }
          client.post('/contacts/search', {query: {field: 'external_id', operator: '=', value: userId}}, function(err, resp) {
            if (err || !resp) {
              console.log(err || 'No response reading intercom contact');
              return cb1(err);
            }
            contact = resp && resp.body && resp.body.data && resp.body.data.length ? resp.body.data[0] : undefined;
            if (contact) {
              return cb1();
            }
            retries++;
            console.log('No results from contact search in Intercom');
            setTimeout(cb1, 15000);
          });
        }, function () {
          cb();
        });
      },
      function (cb) {
        // Update the user's tag for the organization
        if (!organization || !organization.intercomTag || !contact) {
          return cb();
        }
        client.post('/contacts/' + contact.id + '/tags', {id: organization.intercomTag}, function(err, resp) {
          if (err || !resp) {
            console.log(err || 'No response updating intercom tag');
            return cb();
          }
          tag = resp.body;
          cb();
        });
      },
      function (cb) {
        // Update the user's company for the community or organization organization
        if (!organization || !contact) {
          return cb();
        }
        let companyId;
        if (community) {
          const found = organization.communities && organization.communities.find((c) => {
            return c.name === community;
          });
          if (found) {
            companyId = found.intercomCompany;
          }
        }
        companyId = companyId || organization.intercomCompany;
        if (!companyId) {
          return cb();
        }
        client.post('/contacts/' + contact.id + '/companies', {id: companyId}, function(err, resp) {
          if (err || !resp) {
            console.log(err || 'No response updating intercom company');
            return cb();
          }
          company = resp.body;
          cb();
        });
      }
    ], function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log({contact: contact, company: company, tag: tag});
      }
      resolve({contact: contact, company: company, tag: tag});
    });
  });
}

exports.updateIntercomUser = functions.firestore.document('users/{userId}').onWrite((change, context) => {
  const before = change.before.data() || {};
  const after = change.after.data() || {};
  const userId = context.params.userId;

  console.log({before: before, after: after, userId: userId})

  if (!after.organizationId || after.organizationId === before.organizationId) {
      console.log('No update to organization')
      return Promise.resolve(); // No change to the fields we want to sync
  }
  return doIntercomUpdate(userId, after.organizationId, after.community)
});


exports.setMaintenanceSteps = functions.firestore.document('maintenanceLogs/{logId}').onCreate((snap, context) => {
  const newValue = snap.data() || {};

  if (newValue.checklistId) {
    // Copy the
    admin.firestore().collection('checklists').doc(newValue.checklistId).get().then(doc => {
      if (doc.exists) {
        const checklist = {
          id: doc.id,
          ...doc.data()
        };
        return admin.firestore().collection('maintenanceLogs').doc(logId).update({"steps": checklist.steps.map(step => {
          return {name: step.name};
        })});
      }
      else {
        console.log('Checklist not found');
      }
      return cb();
    }).catch(error => {
      console.log("Error getting checklist:", error);
    });
  }
});
