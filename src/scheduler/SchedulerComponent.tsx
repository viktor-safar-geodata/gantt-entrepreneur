import { BryntumScheduler } from '@bryntum/scheduler-react';
import './SchedulerComponent.css';
import React from 'react';
import { SchedulerData } from './models';
import { AssignmentModel, EventModel, Scheduler } from '@bryntum/scheduler';

export interface ISchedulerComponentProps {
  schedulerData: SchedulerData;
  onEventSelected: (eventObjectId: number) => void;
  startDate: Date;
  endDate: Date;
  listeners?: object;
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
          resources={props.schedulerData.resources}
          events={props.schedulerData.events}
          onEventClick={onEventClickHandler}
          startDate={props.startDate}
          endDate={props.endDate}
          viewPreset={'weekAndDayLetter'}
          rowHeight={40}
          barMargin={0}
          multiEventSelect={true}
          columns={[{ text: 'Name', field: 'name' }]}
          listeners={props.listeners}
        />
      )}
    </div>
  );
};

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/scheduler/docs/guide/Scheduler/integration/react/data-binding

export default SchedulerComponent;
