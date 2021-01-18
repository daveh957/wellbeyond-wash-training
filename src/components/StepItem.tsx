import React, {useEffect, useState} from 'react';
import {ChecklistStep, MaintenanceLog, MaintenanceStep} from '../models/Maintenance';
import {IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel} from '@ionic/react';
import MaintenanceStepStatus from "./MaintenanceStepStatus";


interface StepItemProps {
  log: MaintenanceLog;
  step: ChecklistStep;
  idx: number;
}

const StepItem: React.FC<StepItemProps> = ({ log, step, idx}) => {

  const [maintenanceStep, setMaintenanceStep] = useState<MaintenanceStep>();

  useEffect(() => {
    if (log && idx < log.steps.length) {
      setMaintenanceStep(log.steps[idx]);
    }
  }, [log, idx, step])

  return (
      <IonCard button className="step-card" routerLink={`/tabs/maintenance/${log.id}/step/${idx}`}>
        <IonCardHeader>
          <IonItem detail={false} lines="none" className="step-item">
            <IonLabel>
              <h2>{step.name}</h2>
            </IonLabel>
          </IonItem>
        </IonCardHeader>

        <IonCardContent>
          {maintenanceStep &&
          <MaintenanceStepStatus maintenanceStep={maintenanceStep} step={step} showNotStarted={true}/>
          }
        </IonCardContent>
      </IonCard>
  );
};

export default StepItem;
