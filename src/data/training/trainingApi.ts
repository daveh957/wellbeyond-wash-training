import * as firebase from 'firebase';
import {Lesson, Subject, TrainingSession} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";
import {checkIsAdmin} from "../user/userApi";

export const loadData = async (collectionPath:string) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let results = Array();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  query = isAdmin ? query : query.where('isPublished', '==', true);
  return query
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return results;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
      return error;
    });
};

export const loadSessionData = async () : Promise<any> => {
  let results = Array();
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return results;
  }
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('sessions').where('userId', '==', user.uid);
  return query
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if (!doc.data().archived) {
          results.push(doc.data());
        }
      });
      return results;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
      return error;
    });
};

export const cacheImagesAndVideos = async (lessons:Lesson[], subjects:Subject[]) => {
  const images:string[] = [];
  const videos:string[] = [];
  if (lessons && lessons.length) {
    lessons.map(lesson => {
      if (lesson.photo) {
        images.push(getLessonIconUrl(lesson.photo, false));
        images.push(getLessonIconUrl(lesson.photo, true));
      }
      if (lesson.pages && lesson.pages.length) {
        lesson.pages.map(page => {
          page.photo && images.push(page.photo);
          page.video && videos.push(page.video);
        });
      }
    });
  }
  if (subjects && subjects.length) {
    subjects.map(subject => {
      subject.photo && images.push(subject.photo);
    });
  }
  addVideosToCache(videos).then(() => {
    addImagesToCache(images);
  });
};

export const addVideoToCache = async (url:string) : Promise<any> => {
  const cache = await caches.open('video-cache');
  await cache.add(url);
}

export const addImageToCache = async (url:string) : Promise<any> => {
  const cache = await caches.open('image-cache');
  await cache.add(url);
}

export const addVideosToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('video-cache');
  await cache.addAll(urls);
}

export const addImagesToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('image-cache');
  await cache.addAll(urls);
}

export const createOrUpdateTrainingSession = async (session:TrainingSession) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return null;
  }
  session.started = session.started || new Date();
  if (!session.id) {
    session.id = (user && user.uid) + ':' + session.subjectId + ':' + session.started.getTime();
  }
  return firebase
    .firestore()
    .collection('sessions')
    .doc(session.id)
    .set(session, {merge: true})
    .then(() => {
      return session;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
}

