import React from 'react';
import { Plus } from 'lucide-react';

interface ProjectHeaderProps {
  onNewProject: () => void;
}

export function ProjectHeader({ onNewProject }: ProjectHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      <button
        onClick={onNewProject}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </button>
    </div>
  );
}