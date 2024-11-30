import React from 'react';
import { Project } from '../../types/project';
import { useProjectStore } from '../../store/projectStore';
import { Eye, EyeOff } from 'lucide-react';

export function ProjectFilter() {
  const projects = useProjectStore((state) => state.projects);
  const toggleProjectVisibility = useProjectStore((state) => state.toggleProjectVisibility);

  return (
    <div className="flex flex-wrap gap-2">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => toggleProjectVisibility(project.id)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
            project.isVisible
              ? 'bg-gray-100 text-gray-900'
              : 'bg-gray-50 text-gray-400'
          }`}
          style={{
            borderLeft: `3px solid ${project.color}`,
          }}
        >
          {project.isVisible ? (
            <Eye className="h-3 w-3 mr-2" />
          ) : (
            <EyeOff className="h-3 w-3 mr-2" />
          )}
          {project.name}
        </button>
      ))}
    </div>
  );
}