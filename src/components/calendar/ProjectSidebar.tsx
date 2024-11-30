import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Eye, EyeOff } from 'lucide-react';

export function ProjectSidebar() {
  const projects = useProjectStore((state) => state.projects);
  const toggleProjectVisibility = useProjectStore((state) => state.toggleProjectVisibility);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => toggleProjectVisibility(project.id)}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
              project.isVisible
                ? 'bg-gray-100 text-gray-900'
                : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
            style={{
              borderLeft: `3px solid ${project.color}`,
            }}
          >
            {project.isVisible ? (
              <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">{project.name}</span>
            <span className="ml-auto text-xs text-gray-500">
              {project.tasks.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}