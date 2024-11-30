export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    projectId: string;
    taskId: string;
    color: string;
    isRange: boolean;
  };
}