import React, {useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {Checklist, MaintenanceLog, System} from '../models/Maintenance';
import {connect} from '../data/connect';
import * as selectors from '../data/selectors';
import './SystemPage.scss';
import {RouteComponentProps} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '../i18n';
import {loadMaintenanceLogs} from "../data/maintenance/maintenance.actions";
import {MaintenanceLogs} from "../data/maintenance/maintenance.state";
import MaintenanceLogItem from '../components/MaintenanceLogItem';
import StartMaintenanceModal from "../components/StartMaintenanceModal";

interface OwnProps extends RouteComponentProps {
  system: System;
  maintenanceLogs?: MaintenanceLogs;
}

interface StateProps {
  checklists: Checklist[];
  defaultLanguage?: string;
}

interface DispatchProps {
  loadMaintenanceLogs: typeof loadMaintenanceLogs
}

interface SystemProps extends OwnProps, StateProps, DispatchProps { }

const SystemPage: React.FC<SystemProps> = ({ system,  maintenanceLogs,  checklists, defaultLanguage, loadMaintenanceLogs}) => {

  const { t } = useTranslation(['translation'], {i18n} );

  const [completedMaintenanceLogs, setCompletedMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [activeMaintenanceLogs, setActiveMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const closeModal = () => {
    setShowModal(false);
  }

  const openModal = () => {
    setShowModal(true);
  }

  useEffect(() => {
    if (system && checklists) {
      // For now, let anyone teach the system
      i18n.changeLanguage(defaultLanguage || 'en');
      loadMaintenanceLogs(system);
    }

  }, [system, checklists, defaultLanguage, loadMaintenanceLogs]);

  useEffect(() => {
    if (system && maintenanceLogs) {
      setActiveMaintenanceLogs(Object.values(maintenanceLogs).filter((l) => l.systemId === system.id && !l.completed).sort((a, b) => {
        return (a.started || new Date()) < (b.started || new Date()) ? -1 : 1;
      }));
      setCompletedMaintenanceLogs(Object.values(maintenanceLogs).filter((l) => l.systemId === system.id && l.completed).sort((a, b) => {
        return (a.completed || new Date()) < (b.completed || new Date()) ? -1 : 1;
      }));
    }
  }, [system, maintenanceLogs]);

  return (
    <IonPage id="system-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{system ? system.name : t('resources.systems.name')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      { system && checklists && activeMaintenanceLogs && completedMaintenanceLogs &&
        <IonContent fullscreen={true}>
          <IonList>
            <IonListHeader>
              <h2>{t('maintenance.logs.listhdr')}</h2>
            </IonListHeader>

            <IonItemGroup>
              <IonItemDivider color="light">
                <IonLabel>
                  <h3>{t('maintenance.logs.activehdr')}</h3>
                </IonLabel>
              </IonItemDivider>
              {
                activeMaintenanceLogs.length ?
                  activeMaintenanceLogs.map((ml: MaintenanceLog) => {
                    return (<MaintenanceLogItem system={system} checklists={checklists} log={ml} key={ml.id}/>)
                  }) :
                  <IonItem lines="none">
                    <small>{t('maintenance.logs.noactive')}</small>
                  </IonItem>
              }
            </IonItemGroup>
            <IonItemGroup>
              <IonItemDivider color="light">
                <IonLabel>
                  <h3>{t('maintenance.logs.recenthdr')}</h3>
                </IonLabel>
              </IonItemDivider>
              {
                completedMaintenanceLogs.length ?
                  completedMaintenanceLogs.slice(0,3).map((ml: MaintenanceLog) => {
                    return (<MaintenanceLogItem system={system} checklists={checklists} log={ml} key={ml.id}/>)
                  }) :
                  <IonItem lines="none">
                    <small>{t('maintenance.logs.norecent')}</small>
                  </IonItem>
              }
            </IonItemGroup>

            {
              activeMaintenanceLogs.length || completedMaintenanceLogs.length ?
                <IonItem>
                  <em>{t('maintenance.messages.swipeInstructions')}</em>
                </IonItem> : undefined
            }
          </IonList>
          <IonRow>
            <IonCol>
              <IonButton expand="block" fill="solid" color="primary" onClick={openModal}>{t('maintenance.buttons.start')}</IonButton>
            </IonCol>
          </IonRow>
          <StartMaintenanceModal showModal={showModal} closeModal={closeModal} system={system} checklists={checklists} />
        </IonContent>
      }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    loadMaintenanceLogs
  },
  mapStateToProps: (state, ownProps) => ({
    system: selectors.getSystem(state, ownProps),
    checklists: selectors.getChecklistsForSystem(state, ownProps),
    maintenanceLogs: selectors.getMaintenanceLogs(state),
    userId: selectors.getUserId(state),
    organization: selectors.getUserOrganization(state),
    community: selectors.getUserCommunity(state),
  }),
  component: SystemPage
});

