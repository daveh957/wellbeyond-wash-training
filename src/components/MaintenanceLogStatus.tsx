import React, {useEffect, useState} from 'react';
import {MaintenanceLog} from '../models/Maintenance';
import {IonText} from '@ionic/react';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";


interface MaintenanceLogStatusProps {
  log: MaintenanceLog;
}

const MaintenanceLogStatus: React.FC<MaintenanceLogStatusProps> = ({ log}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [completeCount, setCompleteCount] = useState<number>(0);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);
  const [repairsCount, setRepairsCount] = useState<number>(0);

  useEffect(() => {
    if (log) {
      setCompleteCount(log.steps.reduce((count, step) => {
        return count + (step.status === 'completed' ? 1 : 0);
      }, 0));
      setIncompleteCount(log.steps.reduce((count, step) => {
        return count + (step.status === 'incomplete' ? 1 : 0);
      }, 0));
      setRepairsCount(log.steps.reduce((count, step) => {
        return count + (step.status === 'repairs-needed' ? 1 : 0);
      }, 0));
    }
  }, [log]);

  return (
          <p>
            {log.completed ?
              <div>{t('maintenance.logs.completedOn', {date: log.completed})}</div>
              :
              log.started ?
                <div>{t('maintenance.logs.startedOn', {date: log.started})}
                  <br />{t('maintenance.logs.stepCount', {count: log.stepCount, completed: log.completedCount, remaining: ((log.stepCount || 0) - (log.completedCount || 0))})}</div>
                : undefined
            }
            {completeCount ? <div><IonText color="success">{t('maintenance.logs.completedCount', {count: completeCount})}</IonText></div> : undefined}
            {incompleteCount ? <div><IonText color="warning">{t('maintenance.logs.incompleteCount', {count: incompleteCount})}</IonText></div> : undefined}
            {repairsCount ? <div><IonText color="danger">{t('maintenance.logs.repairsCount', {count: repairsCount})}</IonText></div> : undefined}
          </p>
  );
};

export default MaintenanceLogStatus;
