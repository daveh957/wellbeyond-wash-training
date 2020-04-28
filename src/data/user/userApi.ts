import * as firebase from 'firebase';
import {UserLesson} from "../../models/User";

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
          displayName: user ? user.displayName : undefined
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
      const lessons = new Array<any>();
      querySnapshot.forEach(function(doc) {
        if (doc.exists) {
          lessons.push(doc.data());
        }
      });
      return lessons;
    })
    .catch(error => {
      console.log("Error getting document:", error);
    });
};

export const createOrUpdateUserLesson = async (lesson:UserLesson) => {
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
