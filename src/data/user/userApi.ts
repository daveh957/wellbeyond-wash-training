import * as firebase from 'firebase';
import {UserLesson} from "../../models/User";
import {UserLessons} from "./user.state";

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
    .createUserWithEmailAndPassword(email, password)
    .then(newUser => {
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(newUser.user.uid)
        .set({
          // @ts-ignore
          email: newUser.user.email

        })
        .then(() => {
          return { ...newUser };
        });
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
          photoURL: user ? user.photoURL : undefined,
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
          const data = doc.data() as UserLesson;
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

export const createOrUpdateUserLesson = async (lesson:UserLesson) => {
  console.log(lesson);
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  if (!lesson.id) {
    lesson.id = user.uid + ':' + lesson.lessonId;
  }
  return firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection('lessons')
    .doc(lesson.id)
    .set(lesson, { merge: true })
    .then(() => {
      return lesson;
    })
    .catch(error => {
      console.log("Error writing document:", error);
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
        })
        .then(() => {
          return user;
        });
    });
};

export const updateProfile = async (profile: {name?: string, organization?: string, photoURL?: string}) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  return user
    .updateProfile({displayName: profile.name, photoURL: profile.photoURL})
    .then(() => {
      if (!profile.organization) {
        return user;
      }
      return firebase
        .firestore()
        .collection("users")
        // @ts-ignore
        .doc(user.uid)
        .set({
          // @ts-ignore
          organization: profile.organization
        })
        .then(() => {
          return user;
        });
    });
};

export const updatePassword = async (password: string) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  return user
    .updatePassword(password)
    .then(() => {
      return user;
    });
};
