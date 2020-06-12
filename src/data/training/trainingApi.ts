import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Lesson, Subject} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";
import {checkIsAdmin} from "../user/userApi";

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


