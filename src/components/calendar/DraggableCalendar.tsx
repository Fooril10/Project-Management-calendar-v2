import React, { useCallback } from 'react';
import { Calendar, View, Localizer } from 'react-big-calendar';
import { format } from 'date-fns';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { CalendarEvent } from '../../types/calendar';
import { useProjectStore } from '../../store/projectStore';

const DnDCalendar = withDragAndDrop(Calendar);

interface DraggableCalendarProps {
  events: CalendarEvent[];
  view: View;
  onView: (view: View) => void;
  hoveredDate: Date | null;
  onHoveredDateChange: (date: Date | null) => void;
  onAddTask: (date: Date) => void;
  localizer: Localizer;
  date: Date;
  onNavigate: (date: Date) => void;
  toolbar?: boolean;
}

export function DraggableCalendar({
  events,
  view,
  onView,
  hoveredDate,
  onHoveredDateChange,
  onAddTask,
  localizer,
  date,
  onNavigate,
  toolbar = true,
}: DraggableCalendarProps) {
  const updateTask = useProjectStore((state) => state.updateTask);

  const moveEvent = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      const { projectId, taskId, isRange } = event.resource;
      if (isRange) {
        const duration = event.end.getTime() - event.start.getTime();
        const newEnd = new Date(start.getTime() + duration);
        updateTask(projectId, taskId, {
          dateRange: { start, end: newEnd },
          dueDate: start,
        });
      } else {
        updateTask(projectId, taskId, { dueDate: start });
      }
    },
    [updateTask]
  );

  const resizeEvent = useCallback(
    ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
      const { projectId, taskId } = event.resource;
      updateTask(projectId, taskId, {
        dateRange: { start, end },
        dueDate: start,
      });
    },
    [updateTask]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: toolbar ? '100%' : 400 }}
        view={view}
        onView={onView}
        views={['month', 'week']}
        draggableAccessor={() => true}
        resizable
        selectable
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        date={date}
        onNavigate={onNavigate}
        toolbar={toolbar}
        eventPropGetter={(event: CalendarEvent) => ({
          style: {
            backgroundColor: event.resource.color,
            fontSize: '0.75rem',
            padding: '2px 4px',
            borderRadius: event.resource.isRange ? '4px' : '12px',
            border: 'none',
            cursor: 'move',
            opacity: event.resource.isRange ? '0.9' : '1',
          },
          className: event.resource.isRange ? 'date-range-event' : '',
        })}
        formats={{
          eventTimeRangeFormat: () => '',
          timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
        }}
        components={{
          event: ({ event }) => {
            const [taskTitle, projectName] = event.title.split(' • ');
            return (
              <div className="overflow-hidden">
                <div className="font-medium truncate">{taskTitle}</div>
                <div className="text-xs opacity-75 truncate">{projectName}</div>
              </div>
            );
          },
          dateCellWrapper: (props) => (
            <div
              className="relative h-full"
              onMouseEnter={() => onHoveredDateChange(props.value)}
              onMouseLeave={() => onHoveredDateChange(null)}
              onClick={() => onAddTask(props.value)}
            >
              {props.children}
            </div>
          ),
        }}
      />
    </DndProvider>
  );
}