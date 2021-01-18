export interface MediaItem {
  url: string;
  caption?: string;
}

export interface ChecklistStep {
  name: string;
  instructions?: string;
  photo?: string;
  photoCaption?: string;
  video?: string;
  videoCaption?: string;
}

export type MaintenanceStepStatus = 'completed' | 'incomplete' | 'repairs-needed';
export interface MaintenanceStep {
  name: string;
  status?: MaintenanceStepStatus;
  completed?: Date;
  completedById?: string;
  completedByName?: string;
  information?: string;
}

export interface SystemType {
  id: string;
  name: string;
  description: string;
  photos: MediaItem[]; // Embedded list
  videos: MediaItem[]; // Embedded list
}

export interface System {
  id: string;
  name: string;
  organizationId: string;
  systemTypeId: string;
  latitude: number;
  longitude: number;
  description: string;
  photos: MediaItem[]; // Embedded list
  videos: MediaItem[]; // Embedded list
}

export interface Checklist {
  id: string;
  name: string;
  organizationId: string;
  systemTypeId: string;
  locale: string;
  frequency: string;
  description: string;
  isPublished: boolean;
  steps: ChecklistStep[]; // Embedded list
}


export interface MaintenanceLog {
  id: string;
  name: string;
  organizationId: string;
  systemId: string;
  checklistId: string;
  userId?: string;
  archived?: boolean;
  started?: Date;
  completed?: Date;
  stepCount?: number;
  completedCount?: number;
  steps: MaintenanceStep[]; // Embedded list
}
