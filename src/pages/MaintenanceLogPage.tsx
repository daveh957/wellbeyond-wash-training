import React from 'react';
import {IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import StepItem from '../components/StepItem';
import {Checklist, MaintenanceLog, System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './MaintenancePage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import BackToSystemLink from "../components/BackToSystem";

interface OwnProps extends RouteComponentProps {
  system: System;
  checklist: Checklist;
  log: MaintenanceLog;
}

interface StateProps {
}

interface DispatchProps { }

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const MaintenanceLogPage: React.FC<SystemProps> = ({ system, checklist,  log}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  return (
    <IonPage id="step-list">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <BackToSystemLink system={system}/>
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && checklist && log ?
        <IonContent fullscreen={true}>
          <IonList>
            {checklist.steps && checklist.steps.map((step, idx) => (
                <StepItem
                  key={log.id + '-step-' + idx}
                  idx={idx}
                  step={step}
                  log={log}
                />
            ))}
          </IonList>
        </IonContent>
        : undefined
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystemForLog(state, ownProps),
    checklist: selectors.getChecklistForLog(state, ownProps),
    log: selectors.getMaintenanceLog(state, ownProps),
  }),
  component: MaintenanceLogPage
});

