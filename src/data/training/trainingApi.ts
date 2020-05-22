
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Lesson, LessonProgress, Subject, TrainingSession} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";
import {checkIsAdmin} from "../user/userApi";
import {TrainingSessions} from "./training.state";

export const loadTrainingData = async (collectionPath:string) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let results = Array<LessonProgress>();
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
        } as LessonProgress);
      });
      return results;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
      return error;
    });
};

export const listenForTrainingData = async (collectionPath:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  query = isAdmin ? query : query.where('isPublished', '==', true);
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


export const loadTrainingSessionData = async () : Promise<any> => {
  let results = {} as TrainingSessions;
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
        const data = doc.data() as TrainingSession;
        if (!data.archived) {
          // @ts-ignore id is always defined
          results[data.id] = data;
        }
      });
      return results;
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
      return error;
    });
};


export const listenForTrainingSessionData = async (callback:any) : Promise<any> => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.reject();
  }
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection('sessions').where('userId', '==', user.uid);
  return query
    .onSnapshot(querySnapshot => {
      let results = {} as TrainingSessions;
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data() as TrainingSession;
        if (!data.archived) {
          // @ts-ignore id is always defined
          results[data.id] = data;
        }
      });
      callback(results);
    });
};

export const cacheImagesAndVideos = async (lessons:Lesson[], subjects:Subject[]) => {
  const images:string[] = [];
  const videos:string[] = [];
  if (lessons && lessons.length) {
    lessons.forEach(lesson => {
      if (lesson.photo) {
        images.push(getLessonIconUrl(lesson.photo, false));
        images.push(getLessonIconUrl(lesson.photo, true));
      }
      if (lesson.pages && lesson.pages.length) {
        lesson.pages.forEach(page => {
          page.photo && images.push(page.photo);
          page.video && videos.push(page.video);
        });
      }
    });
  }
  if (subjects && subjects.length) {
    subjects.forEach(subject => {
      subject.photo && images.push(subject.photo);
    });
  }
  addImagesToCache(images).then(() => {
    addVideosToCache(videos).catch(error =>  {
      console.log(error);
    });
  }).catch(error =>  {
    console.log(error);
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

