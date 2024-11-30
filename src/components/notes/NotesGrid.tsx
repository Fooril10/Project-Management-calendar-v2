import React from 'react';
import { Project } from '../../types/project';
import { ProjectNotes } from '../../types/notes';
import { Lightbulb } from 'lucide-react';

interface NotesGridProps {
  projects: Project[];
  projectNotes: ProjectNotes;
  onProjectSelect: (projectId: string) => void;
}

export function NotesGrid({ projects, projectNotes, onProjectSelect }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectSelect(project.id)}
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          style={{ borderLeft: `4px solid ${project.color}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {(projectNotes[project.id] || []).length} notes
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {(projectNotes[project.id] || [])
              .slice(0, 2)
              .map((note) => (
                <p key={note.id} className="text-sm text-gray-600 truncate">
                  {note.text}
                </p>
              ))}
            {(projectNotes[project.id] || []).length > 2 && (
              <p className="text-sm text-gray-500">
                +{(projectNotes[project.id] || []).length - 2} more notes
              </p>
            )}
            {(projectNotes[project.id] || []).length === 0 && (
              <p className="text-sm text-gray-500 italic">No notes yet</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}