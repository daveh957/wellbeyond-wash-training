import * as firebase from 'firebase';
import {Subject, Lesson} from '../../models/Training';

export const loadData = async (collectionPath:string) : Promise<any> => {
  let results = Array();
  return firebase.firestore().collection(collectionPath)
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
    })
};

export const addVideoToCache = async (url:string) : Promise<any> => {
  const cache = await caches.open('video-cache');
  await cache.add(url);
}

export const addImageToCache = async (url:string) : Promise<any> => {
  const cache = await caches.open('image-cache');
  await cache.add(url);
}
