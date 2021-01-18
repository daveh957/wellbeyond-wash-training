import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Lesson, Subject, Topic} from '../../models/Training';
import {getLessonIconUrl} from "../../util/cloudinary";
import {checkIsAdmin} from "../user/userApi";
import {isPlatform} from "@ionic/react";

export const listenForTrainingData = async (collectionPath:string, organizationId:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  if (!isAdmin && collectionPath !== 'topics') {
    query = query.where('organizationId', '==', organizationId);
    query = query.where('isPublished', '==', true);
  }
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
      const trainingData:any ={};
      trainingData[collectionPath] = results;
      cacheImagesAndVideos(trainingData as TrainingData);
      callback(results);
    });
};

interface TrainingData {
  topics?: Topic[];
  subjects?: Subject[];
  lessons?: Lesson[];
}

export const cacheImagesAndVideos = ({topics, subjects, lessons}:TrainingData) => {
  if (isPlatform('hybrid')) {
    return;
  }
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
  if (topics && topics.length) {
    topics.forEach(topic => {
      topic.photo && images.push(topic.photo);
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

export const addVideosToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('video-cache');
  cache.addAll(urls);
}

export const addImagesToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('image-cache');
  cache.addAll(urls);
}


