import {Checklist, MaintenanceLog, System,} from '../../models/Maintenance';

export interface MaintenanceState {
  systems: System[];
  checklists: Checklist[];
  maintenanceLogs: MaintenanceLogs;
}

export interface MaintenanceLogs {
  [id: string]: MaintenanceLog;
}
