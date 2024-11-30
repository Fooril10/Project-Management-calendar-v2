import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarToolbarProps {
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
  onToday: () => void;
  onNavigate: (action: 'PREV' | 'NEXT') => void;
  label: string;
}

export function CalendarToolbar({ view, onViewChange, onToday, onNavigate, label }: CalendarToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            Today
          </button>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange('month')}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            view === 'month'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            view === 'week'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Week
        </button>
      </div>
    </div>
  );
}