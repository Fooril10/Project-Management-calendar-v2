import React from 'react';
import { Project, Task, ColumnConfig } from '../../types/project';
import { DateRangeCell } from './DateRangeCell';
import { TaskOptionsMenu } from './TaskOptionsMenu';

interface ProjectTableProps {
  project: Project;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function ProjectTable({ project, onUpdateTask, onToggleTaskCompletion, onDeleteTask }: ProjectTableProps) {
  const renderCell = (task: Task, column: ColumnConfig) => {
    // Special built-in columns first
    if (column.id === 'status') {
      return (
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            {project.statusLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <TaskOptionsMenu onDeleteTask={() => onDeleteTask(task.id)} />
        </div>
      );
    }

    switch (column.type) {
      case 'text':
        if (column.id === 'title') {
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTaskCompletion(task.id)}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={task.title}
                onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
                className={`flex-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              />
            </div>
          );
        }
        return (
          <input
            type="text"
            value={task[column.id] || ''}
            onChange={(e) => onUpdateTask(task.id, { [column.id]: e.target.value })}
            className="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
          />
        );
      case 'dropdown':
        return (
          <select
            value={task[column.id] || ''}
            onChange={(e) => onUpdateTask(task.id, { [column.id]: e.target.value })}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          >
            <option value="">Select an option</option>
            {column.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!task[column.id]}
            onChange={(e) => onUpdateTask(task.id, { [column.id]: e.target.checked })}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={task[column.id] || ''}
            onChange={(e) => onUpdateTask(task.id, { [column.id]: e.target.value })}
            className="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
          />
        );
      case 'date':
        return (
          <DateRangeCell
            task={task}
            onUpdate={(updates) => onUpdateTask(task.id, updates)}
          />
        );
      case 'tags':
        return (
          <div className="flex flex-wrap gap-1">
            {(task[column.id] || []).map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
              >
                {tag}
              </span>
            ))}
            <button
              onClick={() => {
                const tag = window.prompt('Enter tag name');
                if (tag) {
                  onUpdateTask(task.id, { 
                    [column.id]: [...(task[column.id] || []), tag]
                  });
                }
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              + Add Tag
            </button>
          </div>
        );
    }

    return task[column.id] || '';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {project.columns.map((column) => (
                <th
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {project.tasks.map((task) => (
              <tr key={task.id} className={task.completed ? 'bg-gray-50' : ''}>
                {project.columns.map((column) => (
                  <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                    {renderCell(task, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}