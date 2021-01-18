import {ActionType} from '../../util/types';
import {createOrUpdateMaintenanceLog, listenForMaintenanceData, listenForMaintenanceLogs} from "./maintenanceApi";
import {MaintenanceLogs, MaintenanceState} from "./maintenance.state";
import {Checklist, MaintenanceLog, System} from "../../models/Maintenance";
import React from "react";

const listeners:{systems?:any, checklists?:any, maintenanceLogs?:any} = {};

export const loadMaintenanceData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.systems && typeof listeners.systems === 'function') {
    listeners.systems();
  }
  listenForMaintenanceData('systems', organizationId, (systems: System[]) => {
    dispatch(setSystems(systems));
  }).then(listener => {
    listeners.systems = listener;
  });

  if (listeners.checklists && typeof listeners.checklists === 'function') {
    listeners.checklists();
  }
  listenForMaintenanceData('checklists', organizationId, (checklists: Checklist[]) => {
    dispatch(setChecklists(checklists));
  }).then(listener => {
    listeners.checklists = listener;
  });
});

export const loadMaintenanceLogs = (system:System) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.maintenanceLogs && typeof listeners.maintenanceLogs === 'function') {
    listeners.maintenanceLogs();
  }
  listenForMaintenanceLogs(system, (maintenanceLogs: MaintenanceLogs) => {
    dispatch(setMaintenanceLogs(maintenanceLogs));
  }).then(listener => {
    listeners.maintenanceLogs = listener;
  });
});

export const updateMaintenanceLog = (log: MaintenanceLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = !!log.archived;
  log.started = log.started || new Date();
  log.steps   = log.steps || [];
  log.stepCount = log.steps.length;
  log.completedCount = log.steps.reduce((total:number, step) => {return total + (step.completed ? 1 : 0)}, 0);
  if (log.stepCount === log.completedCount) {
    log.completed = log.completed || new Date();
  }
  if (!log.id) {
    log.id = log.systemId + ':' + log.checklistId + ':' + log.started.getTime();
  }
  createOrUpdateMaintenanceLog(log);
  dispatch(setMaintenanceLog(log));
};

export const archiveMaintenanceLog =(log: MaintenanceLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = true;
  createOrUpdateMaintenanceLog(log);
  dispatch(setMaintenanceLog(log));
  dispatch(setMaintenanceLogArchived(log));
};


export const setData = (data: Partial<MaintenanceState>) => ({
  type: 'set-maintenance-data',
  data
} as const);

export const setSystems = (systems: System[]) => ({
  type: 'set-maintenance-systems',
  systems
} as const);

export const setChecklists = (checklists: Checklist[]) => ({
  type: 'set-maintenance-checklists',
  checklists
} as const);

export const setMaintenanceLog = (log: MaintenanceLog) => ({
  type: 'set-maintenance-log',
  log
} as const);

export const setMaintenanceLogArchived = (log: MaintenanceLog) => ({
  type: 'set-maintenance-log-archived',
  log
} as const);

export const setMaintenanceLogs = (maintenanceLogs: MaintenanceLogs) => ({
  type: 'set-maintenance-logs',
  maintenanceLogs
} as const);


export type MaintenanceActions =
  | ActionType<typeof setData>
  | ActionType<typeof setSystems>
  | ActionType<typeof setChecklists>
  | ActionType<typeof setMaintenanceLogs>
  | ActionType<typeof setMaintenanceLog>
  | ActionType<typeof setMaintenanceLogArchived>
