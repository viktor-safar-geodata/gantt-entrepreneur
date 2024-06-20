import { BryntumDateField, BryntumScheduler } from '@bryntum/scheduler-react';
import './SchedulerComponent.css';
import React from 'react';
import { SchedulerData } from './models';
import { AssignmentModel, EventModel, Scheduler, Field, ViewPreset, DateHelper } from '@bryntum/scheduler';

export interface ISchedulerComponentProps {
  schedulerData: SchedulerData;
  groupName: string;
  onEventSelected: (eventObjectId: number) => void;
  startDate: Date;
  endDate: Date;
}

export const SchedulerComponent = (props: ISchedulerComponentProps) => {
  const scheduler = React.useRef<BryntumScheduler>(null);
  const today = new Date();
  const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const [currentDate, setCurrentDate] = React.useState<Date>(weekAgo);

  const handleSchedulerHasChanges = (bryntumEvent: any) => {
    // https://bryntum.com/products/scheduler/docs/guide/Scheduler/data/catching_changes
    const changes = bryntumEvent.source.changes;

    const eventsAdded = changes.events.added as EventModel[];
    console.log('eventsAdded', eventsAdded);

    const eventsUpdated = changes.events.updated as EventModel[];
    console.log('eventsUpdated', eventsUpdated);

    const eventsRemoved = changes.events.removed as EventModel[];
    console.log('eventsRemoved', eventsRemoved);
  };

  const onEventClickHandler = (event: {
    source: Scheduler;
    eventRecord: EventModel;
    assignmentRecord: AssignmentModel;
    event: MouseEvent;
  }) => {
    props.onEventSelected(event.eventRecord.getData('id'));
  };

  const onDateChanged = React.useCallback(
    (event: {
      source: Field | any;
      value: string | number | boolean | any;
      oldValue: string | number | boolean | any;
      valid: boolean;
      event: Event;
      userAction: boolean;
    }) => {
      setCurrentDate(event.value);
    },
    []
  );

  const schedulerViewPreset = new ViewPreset({
    id: 'geodataPreset', // Unique id value provided to recognize your view preset. Not required, but having it you can simply set new view preset by id: scheduler.viewPreset = 'myPreset'
    name: 'Geodata preset', // A human-readable name provided to be used in GUI, e.i. preset picker, etc.

    tickWidth: 60, // Time column width in horizontal mode
    tickHeight: 50, // Time column height in vertical mode
    displayDateFormat: 'HH:mm', // Controls how dates will be displayed in tooltips etc

    shiftIncrement: 1, // Controls how much time to skip when calling shiftNext and shiftPrevious.
    shiftUnit: 'week', // Valid values are 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'.
    defaultSpan: 60, // By default, if no end date is supplied to a view it will show this number of hours

    timeResolution: {
      // Dates will be snapped to this resolution
      unit: 'hour', // Valid values are 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'.
      increment: 1,
    },

    headers: [
      // This defines your header rows from top to bottom
      {
        unit: 'month',
        dateFormat: 'MMM YYYY',
        align: 'start',
      },
      {
        // For each row you can define 'unit', 'increment', 'dateFormat', 'renderer', 'align', and 'thisObj'
        unit: 'day',
        dateFormat: 'ddd DD.M.',
        align: 'start',
      },
      {
        unit: 'hour',
        dateFormat: 'HH:mm',
        align: 'start',
      },
    ],

    columnLinesFor: 1, // Defines header level column lines will be drawn for. Defaults to the last level.
  });

  return (
    <div id="geodata-scheduler-container">
      <BryntumDateField
        label={'Velg dato'}
        editable={true}
        onChange={onDateChanged}
        margin={'0.5rem'}
        format="DD.MM.YYYY"
        width={'15rem'}
        value={currentDate}
      />
      {props.schedulerData && (
        <BryntumScheduler
          ref={scheduler}
          resources={props.schedulerData.resources}
          events={props.schedulerData.events}
          onEventClick={onEventClickHandler}
          weekStartDay={1}
          startDate={props.startDate}
          endDate={props.endDate}
          viewPreset={schedulerViewPreset}
          rowHeight={40}
          barMargin={0}
          multiEventSelect={true}
          date={currentDate}
          columns={[{ text: props.groupName, field: 'name' }]}
          crudManager={{
            listeners: {
              // https://bryntum.com/products/scheduler/docs/api/Scheduler/data/CrudManager#config-listeners
              hasChanges: handleSchedulerHasChanges,
            },
          }}
        />
      )}
    </div>
  );
};

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/scheduler/docs/guide/Scheduler/integration/react/data-binding

export default SchedulerComponent;
