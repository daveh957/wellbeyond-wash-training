import React from 'react';
import {System} from '../models/Maintenance';
import {IonCard, IonCardContent, IonCardHeader, IonLabel} from '@ionic/react';


interface SystemItemProps {
  system: System;
}

const SystemItem: React.FC<SystemItemProps> = ({ system}) => {
  return (
      <IonCard button className="system-card" routerLink={`/tabs/systems/${system.id}`}>
        <IonCardHeader>
            <IonLabel>
              <h2>{system.name}</h2>
            </IonLabel>
        </IonCardHeader>

        <IonCardContent>
          <div dangerouslySetInnerHTML={{__html: system.description}}></div>
        </IonCardContent>
      </IonCard>
  );
};

export default SystemItem;
