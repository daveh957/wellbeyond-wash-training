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
