/**
 * Application configuration
 */
import { SchedulerConfig } from '@bryntum/scheduler';

const schedulerConfig: Partial<SchedulerConfig> = {
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 0, 7),
  viewPreset: 'weekAndDayLetter',
  rowHeight: 40,
  barMargin: 0,
  multiEventSelect: true,

  columns: [{ text: 'Name', field: 'name' }],
};

export { schedulerConfig };
