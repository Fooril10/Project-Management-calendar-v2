export interface RecurringSchedule {
  frequency: number;
  endDate?: Date;
}

export interface ColumnConfig {
  id: string;
  type: 'text' | 'tags' | 'dropdown' | 'number' | 'date' | 'checkbox';
  label: string;
  options?: string[]; // For dropdown type
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: string; // Changed from enum to string to support custom statuses
  dueDate: Date;
  dateRange?: {
    start: Date;
    end: Date;
  };
  recurring?: RecurringSchedule;
  tags: string[];
  completed: boolean;
  [key: string]: any; // Allow dynamic custom fields
}

export interface Project {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
  isVisible: boolean;
  columns: ColumnConfig[];
  statusLabels: string[];
}