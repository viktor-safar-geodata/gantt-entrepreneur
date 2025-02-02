import { EventModel, ResourceModel } from '@bryntum/scheduler';

export interface SchedulerData {
  resources: ResourceModel[];
  events: EventModel[];
}

export const basrapportLayer = 'basrapport';
