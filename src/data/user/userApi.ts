import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {UserLessons} from "./user.state";
import {LessonProgress} from "../../models/Training";

/**
 * so this function is called when the authentication state changes
 * in the application, a side effect of that is that we need to get
 * the rest of the user data from the user collection, that is
 * done with the _handleAuthedUser callback
 */
export const authCheck = async (_handleAuthedUser: any) => {
  return new Promise(resolve => {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged(async user => {
      if (user != null) {
        console.log("We are authenticated now!");
        return resolve(await _handleAuthedUser(user));
      } else {
        console.log("We did not authenticate.");
        _handleAuthedUser(null);
        return resolve(null);
      }
    });
  });
};

/**
 *
 * @param {*} email
 * @param {*} password
 */
export const loginWithEmail = (email:string, password:string) => {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};
export const sendPasswordResetEmail = (email:string) => {
  return firebase.auth().sendPasswordResetEmail(email);
};
/**
 *
 */
export const logout = () => {
  return firebase.auth().signOut();
};

/**
 *
 * @param email
 * @param password
 */
export const registerWithEmail = async (email: string, password: string) => {
  console.log("in registerWithEmail");
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password).catch(err => {
    console.log(err);
    if (err.code === 'auth/email-already-in-use') {
      loginWithEmail(email, password).catch(err2 => { // Try to login using the provided password instead
        throw(err); // Throw the original error if it failed
      })
    }
    else {
      throw(err);
    }
  });
};

/**
 *
 */
export const getUserProfile = async () => {
  let user = firebase.auth().currentUser;
  console.log(user);

  if (!user || !user.uid) {
    return null;
  }

  var userRef = firebase
    .firestore()
    .collection("users")
    .doc(user ? user.uid : undefined);

  return userRef
    .get()
    .then(doc => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        return {
          ...doc.data(),
          id: user ? user.uid : undefined,
          email: user ? user.email : undefined,
          name: user ? user.displayName : undefined,
          photoURL: user ? user.photoURL : undefined
        };
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!", user ? user.uid : undefined);
        return null;
      }
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
};

export const checkIsAdmin = async () => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return false;
  }

  return firebase
    .firestore()
    .collection("admins")
    .doc(user.uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return (doc.data() || {}).isAdmin;
      } else {
        return false;
      }
    })
    .catch(() => {
      return false;
    });
};

export const getUserLessons = async () => {
  const lessons:UserLessons = {};
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }

  return firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection('lessons')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          const data = doc.data() as LessonProgress;
          lessons[data.lessonId] = data;
        }
      });
      return lessons;
    })
    .catch(error => {
      console.log("Error getting document:", error);
      return lessons;
    });
};

export const updateEmail = async (email: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  return user
    .updateEmail(email)
    .then(() => {
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(user.uid)
        .set({
          // @ts-ignore
          email: email
        }, {merge: true})
        .then(() => {
          return user;
        });
    });
};

export const updateProfile = async (profile: {name?: string, organizationId?: string, organization?: string, community?: string, photoURL?: string, acceptedTerms?: boolean}) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  return user
    .updateProfile({displayName: profile.name, photoURL: profile.photoURL})
    .then(() => {
      let update = {
        email: (user && user.email),
        name: profile.name || (user && user.displayName)
      }
      if (profile.organizationId) {
        // @ts-ignore
        update.organizationId = profile.organizationId;
      }
      if (profile.organization) {
        // @ts-ignore
        update.organization = profile.organization;
      }
      if (profile.community) {
        // @ts-ignore
        update.community = profile.community;
      }
      if (profile.acceptedTerms) {
        // @ts-ignore
        update.acceptedTerms = profile.acceptedTerms;
      }
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(user.uid)
        .set(update, {merge: true})
        .then(() => {
          return user;
        });
    });
};

export const reauthenticateWithPassword = async (password: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.email) {
    return null;
  }
  const cred = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(cred);
}

export const updatePassword = async (password: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.email) {
    return null;
  }
  // @ts-ignore
  user.updatePassword(password)
    .then(() => {
      return user;
    });
};

export const createOrUpdateLessonProgress = async (lesson: LessonProgress) => {
  console.log(lesson);
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  if (!lesson.id) {
    lesson.id = (user && user.uid) + ':' + lesson.lessonId;
  }
  return firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .collection('lessons')
    .doc(lesson.id)
    .set(lesson, {merge: true})
    .then(() => {
      return lesson;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
};

export const listenForOrganizationData = async (callback:any) : Promise<any> => {
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('organizations');
  return query
    .onSnapshot(querySnapshot => {
      let results:any[] = [];
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(results);
    });
};
