import React, { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar, RefreshCw, Settings, X } from 'lucide-react';
import { Task } from '../../types/project';

interface DateRangeCellProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
}

export function DateRangeCell({ task, onUpdate }: DateRangeCellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const formatDate = (date: Date | undefined): string => {
    if (!date || !isValid(date)) return '';
    return format(date, 'yyyy-MM-dd');
  };

  const handleSingleDateChange = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isValid(date)) {
      onUpdate({
        dueDate: date,
        dateRange: undefined,
        recurring: undefined
      });
    }
  };

  const handleDateRangeChange = (type: 'start' | 'end', dateStr: string) => {
    const date = parseISO(dateStr);
    if (!isValid(date)) return;

    const currentRange = task.dateRange || { start: task.dueDate, end: task.dueDate };
    const newRange = {
      ...currentRange,
      [type]: date
    };
    onUpdate({
      dueDate: newRange.start,
      dateRange: newRange,
      recurring: undefined
    });
  };

  const handleRecurringChange = (frequency: number, endDateStr?: string) => {
    const endDate = endDateStr ? parseISO(endDateStr) : undefined;
    if (endDateStr && !isValid(endDate)) return;

    onUpdate({
      recurring: {
        frequency,
        endDate
      },
      dateRange: undefined
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatDate(task.dueDate)}
          onChange={(e) => handleSingleDateChange(e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {task.recurring ? (
            <RefreshCw className="h-4 w-4" />
          ) : task.dateRange ? (
            <Calendar className="h-4 w-4" />
          ) : (
            <Settings className="h-4 w-4" />
          )}
        </button>
      </div>

      {isSettingsOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Date Settings</h3>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Type</label>
              <select
                className="w-full rounded border border-gray-300 p-1"
                value={task.recurring ? 'recurring' : task.dateRange ? 'range' : 'single'}
                onChange={(e) => {
                  if (e.target.value === 'single') {
                    handleSingleDateChange(formatDate(task.dueDate));
                  } else if (e.target.value === 'range') {
                    handleDateRangeChange('start', formatDate(task.dueDate));
                  } else {
                    handleRecurringChange(7);
                  }
                }}
              >
                <option value="single">Single Date</option>
                <option value="range">Date Range</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            {task.dateRange && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formatDate(task.dateRange.start)}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full mt-1 rounded border border-gray-300 p-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formatDate(task.dateRange.end)}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full mt-1 rounded border border-gray-300 p-1"
                  />
                </div>
              </div>
            )}

            {task.recurring && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Repeat every</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={task.recurring.frequency}
                      onChange={(e) => handleRecurringChange(Number(e.target.value), 
                        task.recurring?.endDate ? formatDate(task.recurring.endDate) : undefined)}
                      className="w-20 rounded border border-gray-300 p-1"
                    />
                    <span className="text-sm text-gray-600">days</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date (optional)</label>
                  <input
                    type="date"
                    value={task.recurring?.endDate ? formatDate(task.recurring.endDate) : ''}
                    onChange={(e) => handleRecurringChange(task.recurring!.frequency, e.target.value)}
                    className="w-full mt-1 rounded border border-gray-300 p-1"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}