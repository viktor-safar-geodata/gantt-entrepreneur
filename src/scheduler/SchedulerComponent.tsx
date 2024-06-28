import { BryntumScheduler } from '@bryntum/scheduler-react';
import './SchedulerComponent.css';
import React from 'react';
import { SchedulerData } from './models';
import { AssignmentModel, EventModel, Scheduler } from '@bryntum/scheduler';

export interface ISchedulerComponentProps {
  schedulerData: SchedulerData;
  groupName: string;
  onEventSelected: (eventObjectId: number) => void;
  startDate: Date;
  endDate: Date;
  currentDate: Date;
}

export interface SchedulerComponentRef {
  filterEvents: (searchValue: string) => void;
}

const SchedulerComponent = React.forwardRef<SchedulerComponentRef, ISchedulerComponentProps>((props, ref) => {
  const scheduler = React.useRef<BryntumScheduler>(null);

  React.useImperativeHandle(
    ref,
    (): SchedulerComponentRef => ({
      filterEvents(searchValue: string) {
        scheduler.current?.instance.eventStore.clearFilters();
        if (searchValue) {
          const toSearch = searchValue.toLowerCase();
          scheduler.current?.instance.eventStore.filter((event: EventModel) => {
            return event.name.toLowerCase().includes(toSearch);
          });
        }
      },
    })
  );

  const handleSchedulerHasChanges = (bryntumEvent: any) => {
    // https://bryntum.com/products/scheduler/docs/guide/Scheduler/data/catching_changes
    const changes = bryntumEvent.source.changes;

    const eventsAdded = changes.events.added as EventModel[];
    console.log('eventsAdded', eventsAdded);

    const eventsUpdated = changes.events.updated as EventModel[];
    console.log('eventsUpdated', eventsUpdated);

    const eventsRemoved = changes.events.removed as EventModel[];
    console.log('eventsRemoved', eventsRemoved);

    alert('Changes detected but no handler implemented. Reverting...');
    scheduler.current?.instance.crudManager.revertChanges();
  };

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
          weekStartDay={1}
          startDate={props.startDate}
          endDate={props.endDate}
          rowHeight={40}
          barMargin={0}
          multiEventSelect={true}
          date={props.currentDate}
          columns={[{ text: props.groupName, field: 'name', width: '15rem' }]} // 'name' is the field name in the resource model
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
});

// If you plan to use stateful React collections for data binding please check this guide
// https://bryntum.com/products/scheduler/docs/guide/Scheduler/integration/react/data-binding

export default SchedulerComponent;
