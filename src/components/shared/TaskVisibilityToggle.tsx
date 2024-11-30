import React from 'react';
import { EyeOff } from 'lucide-react';

interface TaskVisibilityToggleProps {
  showCompleted: boolean;
  onToggleCompleted: () => void;
}

export function TaskVisibilityToggle({ showCompleted, onToggleCompleted }: TaskVisibilityToggleProps) {
  return (
    <button
      onClick={onToggleCompleted}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
        showCompleted
          ? 'bg-gray-100 text-gray-900'
          : 'bg-gray-50 text-gray-400'
      }`}
    >
      <EyeOff className="h-3 w-3 mr-2" />
      Completed Tasks
    </button>
  );
}