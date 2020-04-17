import React from 'react';
import { Subject } from '../models/Training';
import { IonCard, IonCardHeader, IonItem, IonLabel, IonCardContent } from '@ionic/react';
import {CloudinaryContext, Image} from "cloudinary-react";
import {cloudinaryConfig} from "../CLOUDINARY_CONFIG";


interface SubjectItemProps {
  subject: Subject;
}

const SubjectItem: React.FC<SubjectItemProps> = ({ subject}) => {
  return (
      <IonCard className="subject-card">
        <IonCardHeader>
          <IonItem button detail={false} lines="none" className="subject-item" routerLink={`/tabs/Subjects/${subject.id}`}>
            <IonLabel>
              <h2>{subject.name}</h2>
            </IonLabel>
          </IonItem>
        </IonCardHeader>

        <IonCardContent>
          <div dangerouslySetInnerHTML={{__html: subject.description}}></div>
        </IonCardContent>
      </IonCard>
  );
};

export default SubjectItem;
