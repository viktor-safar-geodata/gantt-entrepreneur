import { BryntumScheduler } from '@bryntum/scheduler-react';
import { schedulerConfig } from './SchedulerConfig';
import './SchedulerComponent.css';
import React from 'react';
import { SchedulerData } from './models';

export interface ISchedulerComponentProps {
  schedulerData: SchedulerData;
}

export const SchedulerComponent = (props: ISchedulerComponentProps) => {
  const scheduler = React.useRef<BryntumScheduler>(null);

  return (
    <div id="geodata-scheduler-container">
      {props.schedulerData && (
        <BryntumScheduler
          ref={scheduler}
          {...schedulerConfig}
          resources={props.schedulerData.resources}
          events={props.schedulerData.events}
        />
      )}
    </div>
  );
};

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/scheduler/docs/guide/Scheduler/integration/react/data-binding

export default SchedulerComponent;
