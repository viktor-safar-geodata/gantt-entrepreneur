import { BryntumScheduler } from '@bryntum/scheduler-react';
import './SchedulerComponent.css';
import React from 'react';
import { SchedulerData } from './models';
import { AssignmentModel, EventModel, Scheduler, SchedulerConfig } from '@bryntum/scheduler';

export interface ISchedulerComponentProps {
  schedulerData: SchedulerData;
  schedulerConfig: Partial<SchedulerConfig>;
  onEventSelected: (eventObjectId: number) => void;
}

export const SchedulerComponent = (props: ISchedulerComponentProps) => {
  const scheduler = React.useRef<BryntumScheduler>(null);

  const onEventClickHandler = (event: {
    source: Scheduler;
    eventRecord: EventModel;
    assignmentRecord: AssignmentModel;
    event: MouseEvent;
  }) => {
    props.onEventSelected(event.eventRecord.getData('id'));
  };

  return (
    <div id="geodata-scheduler-container">
      {props.schedulerData && (
        <BryntumScheduler
          ref={scheduler}
          config={props.schedulerConfig}
          resources={props.schedulerData.resources}
          events={props.schedulerData.events}
          onEventClick={onEventClickHandler}
        />
      )}
    </div>
  );
};

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/scheduler/docs/guide/Scheduler/integration/react/data-binding

export default SchedulerComponent;
