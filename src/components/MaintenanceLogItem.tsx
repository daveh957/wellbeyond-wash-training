import React, {useEffect, useState} from 'react';
import {Checklist, MaintenanceLog, System} from '../models/Maintenance';
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
  IonText
} from '@ionic/react';
import {checkmark} from 'ionicons/icons';
import {useTranslation} from "react-i18next";
import i18n from "../i18n";
import {connect} from "../data/connect";
import {archiveMaintenanceLog} from "../data/maintenance/maintenance.actions";

interface DispatchProps {
  archiveMaintenanceLog: typeof archiveMaintenanceLog
}

interface MaintenanceLogItemProps extends DispatchProps {
  system: System;
  checklists: Checklist[];
  log: MaintenanceLog;
}

const MaintenanceLogItem: React.FC<MaintenanceLogItemProps> = ({ system, checklists, log, archiveMaintenanceLog}) => {

  const { t } = useTranslation(['translation'], {i18n} );
  const [resumeLink, setResumeLink] = useState<string>();
  const [checklist, setChecklist] = useState<Checklist>();
  const [completeCount, setCompleteCount] = useState<number>(0);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);
  const [repairsCount, setRepairsCount] = useState<number>(0);

  useEffect(() => {
    if (log && checklists) {
      setChecklist(checklists.find((cl) => cl.id === log.checklistId));
      setResumeLink('/tabs/maintenance/' + log.id);
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
  }, [log, checklists]);

  const archiveLog = () => {
    log && archiveMaintenanceLog(log);
  }

  return (
    <IonItemSliding>
      <IonItemOptions side="start">
        <IonItemOption color="danger" onClick={archiveLog}>{t('maintenance.buttons.archive')}</IonItemOption>
      </IonItemOptions>
      <IonItem>
        <IonLabel className="ion-text-wrap">
          <h2>{checklist ? checklist.name : 'maintenance.checklist.notfound'}</h2>
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
        </IonLabel>
        <IonNote slot={'end'}>
          {log.completed &&
            <IonIcon icon={checkmark} color="success"/>
          }
        </IonNote>

      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="primary" routerLink={resumeLink}>{t('maintenance.buttons.' + (log.completed ? 'review' : 'resume'))}</IonItemOption>
      </IonItemOptions>
    </IonItemSliding>);
};

export default connect({
  mapDispatchToProps: {
    archiveMaintenanceLog
  },
  component: MaintenanceLogItem
});
