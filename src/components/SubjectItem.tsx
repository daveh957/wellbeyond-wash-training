import React from 'react';
import {Subject} from '../models/Training';
import {IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel} from '@ionic/react';


interface SubjectItemProps {
  subject: Subject;
}

const SubjectItem: React.FC<SubjectItemProps> = ({ subject}) => {
  return (
      <IonCard className="subject-card">
        <IonCardHeader>
          <IonItem button detail={false} lines="none" className="subject-item" routerLink={`/tabs/subjects/${subject.id}`}>
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
