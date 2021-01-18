import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {Checklist, MaintenanceLog, System} from '../../models/Maintenance';
import {checkIsAdmin} from "../user/userApi";
import {MaintenanceLogs} from "./maintenance.state";

export const listenForMaintenanceData = async (collectionPath:string, organizationId:string, callback:any) : Promise<any> => {
  const isAdmin:boolean = await checkIsAdmin();
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore().collection(collectionPath);
  if (!isAdmin) {
    query = query.where('organizationId', '==', organizationId);
    if (collectionPath === 'checklists') {
      query = query.where('isPublished', '==', true);
    }
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
      const maintenanceData:any ={};
      maintenanceData[collectionPath] = results;
      cacheImagesAndVideos(maintenanceData as MaintenanceData);
      callback(results);
    });
};

export const listenForMaintenanceLogs = async (system:System, callback:any) : Promise<any> => {
  let query:firebase.firestore.Query<firebase.firestore.DocumentData> = firebase.firestore()
    .collection('maintenanceLogs')
    .where('organizationId', '==', system.organizationId)
    .where('systemId', '==', system.id);
  return query
    .onSnapshot(querySnapshot => {
      const results:MaintenanceLogs = {};
      querySnapshot.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.exists) {
          const data = {id: doc.id, ...doc.data()} as MaintenanceLog;
          if (!data.archived) {
            results[doc.id] = data;
          }
        }
      });
      callback(results);
    });
};

export const createOrUpdateMaintenanceLog = async (log:MaintenanceLog) => {
  let user = firebase.auth().currentUser;
  if (!user || !user.uid) {
    return Promise.resolve();
  }
  log.userId  = log.userId  || user.uid;
  return firebase
    .firestore()
    .collection('maintenanceLogs')
    .doc(log.id)
    .set(log, {merge: true})
    .then(() => {
      return log;
    })
    .catch(error => {
      console.log("Error writing document:", error);
    });
}

interface MaintenanceData {
  systems?: System[];
  checklists?: Checklist[];
}

const cacheImagesAndVideos = ({systems, checklists}:MaintenanceData) => {
  const images:string[] = [];
  const videos:string[] = [];
  if (systems && systems.length) {
    systems.forEach(system => {
      if (system.photos && system.photos.length) {
        system.photos.forEach(photo => {
          photo.url && images.push(photo.url);
        });
      }
      if (system.videos && system.videos.length) {
        system.videos.forEach(video => {
          video.url && videos.push(video.url);
        });
      }
    });
  }
  if (checklists && checklists.length) {
    checklists.forEach(checklist => {
      if (checklist.steps && checklist.steps.length) {
        checklist.steps.forEach(step => {
          step.photo && images.push(step.photo);
          step.video && videos.push(step.video);
        });
      }
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

const addVideosToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('video-cache');
  cache.addAll(urls);
}

const addImagesToCache = async (urls:string[]) : Promise<any> => {
  const cache = await caches.open('image-cache');
  cache.addAll(urls);
}


