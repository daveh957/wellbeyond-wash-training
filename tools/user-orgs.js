// eslint-disable-next-line no-undef
const admin = require('firebase-admin');
// eslint-disable-next-line no-undef
const async = require('async');
// eslint-disable-next-line no-undef
const Intercom = require('intercom-client');

// eslint-disable-next-line no-undef
const client = new Intercom.Client({ token: process.env.INTERCOM_API_KEY });

const makeKey = (src) => {
  return src.toLowerCase().replace(/\s/g, '')
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const tags = {};
const companies = {};
const organizations = [];

async.series([
  function (cb) {
    client.tags.list(function(err, resp) {
      if (err) {
        return cb();
      }
      if (resp) {
        const data = resp.toJSON();
        const records = data.body && data.body.data;
        records.forEach(record => {
          tags[makeKey(record.name)] = record;
        });
        cb();
      }
    });
  },
  function (cb) {
    let more = true;
    let page = 1;
    async.whilst (
      function(cb1) {
        return cb1(null, more);
      },
      function(cb1) {
        let args = {page: page, per_page: 50}
        client.companies.listBy(args, function(err, resp) {
          if (err) {
            more = false;
            return cb1();
          }
          if (resp) {
            const data = resp.toJSON();
            const records = data.body && data.body.data;
            records.forEach(record => {
              companies[makeKey(record.name)] = record;
            });
            if (data.body.pages && data.body.pages.total_pages && data.body.pages.total_pages > page) {
              page++;
            }
            else {
              more = false;
            }
            cb1();
          }
        });
      }, function (err) {
        cb(err);
      });
  },
  function(cb) {
    const orgRef = admin.firestore().collection('organizations');
    orgRef
      .get()
      .then(orgSnapshot => {
        orgSnapshot.forEach(org => {
          if (org.id && org.data) {
            organizations.push({
              id: org.id,
              ...org.data()
            });
          }
        });
        cb();
      });
  }
],function() {
  async.forEachSeries(organizations, function(organization, cb) {
    console.log(organization);
    cb();
  }, function() {
    // eslint-disable-next-line no-undef
    process.exit(0)
  })
});

setTimeout(function() {
  // eslint-disable-next-line no-undef
  process.exit(0)
}, 600000);

