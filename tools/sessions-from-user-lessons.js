// eslint-disable-next-line no-undef
const admin = require('firebase-admin');
// eslint-disable-next-line no-undef
const async = require('async');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://wellbeyond-development.firebaseio.com'
});

const lessonSubjects = {};
const organizations = {};
const users = [];

async.series([
  function(cb) {
    const subjRef = admin.firestore().collection('subjects');
    subjRef
      .get()
      .then(subjSnapshot => {
        subjSnapshot.forEach(doc => {
          if (doc.id && doc.data) {
            const subject = doc.data();
            if (subject && subject.lessons && subject.lessons.length) {
              subject.lessons.forEach((l) => {
                if (l.lessonId) {
                  lessonSubjects[l.lessonId] = doc.id;
                }
              });
            }
          }
        });
        cb();
      });
  },
  function(cb) {
    const orgRef = admin.firestore().collection('organizations');
    orgRef
      .get()
      .then(orgSnapshot => {
        orgSnapshot.forEach(org => {
          if (org.id && org.data) {
            organizations[org.id] = org.data();
          }
        });
        cb();
      });
  },
  function(cb) {
    const userRef = admin.firestore().collection('users');
    userRef
      .get()
      .then(userSnapshot => {
        userSnapshot.forEach(user => {
          users.push({
            id: user.id,
            ...user.data()
          });
        });
        cb();
      });
  }
],function() {
  async.forEachSeries(users, function(user, cb) {
    const lessonRef = admin.firestore().collection('users/' + user.id + '/lessons');
    lessonRef
      .get()
      .then(lessonSnapshot => {
        let session;
        lessonSnapshot.forEach(doc => {
          if (doc.id && doc.data) {
            const lesson = doc.data();
            if (lesson.lessonId) {
              session = session || {
                subjectId: lessonSubjects[lesson.lessonId],
                userId: user.id,
                organizationId: user.organizationId || '',
                organization: user.organizationId && organizations[user.organizationId] ? organizations[user.organizationId].name : '',
                community: user.community || '',
                started: lesson.started ? lesson.started.toDate() : new Date(),
                archived: false,
                name: '',
                groupType: 'self',
                groupSizeNum: 1,
                lessons: {}
              };
              if (lessonSubjects[lesson.lessonId] === session.subjectId) {
                session.lessons[lesson.lessonId] = lesson;
              }
            }
          }
        });
        if (session && session.subjectId) {
          session.id = (user && user.id) + ':' + session.subjectId + ':' + session.started.getTime();
          admin
            .firestore()
            .collection('sessions')
            .doc(session.id)
            .set(session, {merge: true})
            .then(() => {
              cb();
            })
            .catch(error => {
              console.log("Error writing document:", error);
              cb(error);
            });
        }
        else {
          cb();
        }
      });
  }, function() {
    // eslint-disable-next-line no-undef
    process.exit(0)
  })
});

setTimeout(function() {
  // eslint-disable-next-line no-undef
  process.exit(0)
}, 600000);

