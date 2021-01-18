import {MaintenanceActions} from './maintenance.actions';
import {MaintenanceLogs, MaintenanceState} from './maintenance.state';

export const maintenanceReducer = (state: MaintenanceState, action: MaintenanceActions): MaintenanceState => {
  switch (action.type) {
    case 'set-maintenance-data': {
      return {...state, ...action.data};
    }
    case 'set-maintenance-systems': {
      return {...state, systems: action.systems};
    }
    case 'set-maintenance-checklists': {
      return {...state, checklists: action.checklists};
    }
    case 'set-maintenance-logs': {
      return {...state, maintenanceLogs: action.maintenanceLogs};
    }
    case 'set-maintenance-log': {
      let maintenanceLogs = Object.assign({}, state.maintenanceLogs);
      if (action.log.id) {
        maintenanceLogs[action.log.id] = action.log;
      }
      return { ...state, maintenanceLogs: maintenanceLogs };
    }
    case 'set-maintenance-log-archived': {
      let maintenanceLogs = {...state.maintenanceLogs} as MaintenanceLogs;
      if (action.log.id) {
        delete maintenanceLogs[action.log.id];
      }
      return { ...state, maintenanceLogs: maintenanceLogs};
    }
  }
}
