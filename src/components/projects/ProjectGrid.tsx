import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';

interface ProjectGridProps {
  projects: Project[];
  onProjectSelect: (projectId: string) => void;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  let h = 0;
  
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * ((g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else {
    h = 60 * (4 + (r - g) / (max - min));
  }
  
  if (h < 0) h += 360;
  
  return h;
}

export function ProjectGrid({ projects, onProjectSelect }: ProjectGridProps) {
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editHue, setEditHue] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const handleStartEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
    setEditHue(hexToHsl(project.color));
  };

  const handleSaveEdit = (projectId: string) => {
    const color = hslToHex(editHue, 70, 60);
    updateProject(projectId, { name: editName, color });
    setEditingProject(null);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDeleteClick = (projectId: string) => {
    setShowDeleteConfirm(projectId);
  };

  const handleConfirmDelete = (projectId: string) => {
    deleteProject(projectId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          style={{ borderLeft: `4px solid ${project.color}` }}
        >
          {editingProject === project.id ? (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Project name"
                  autoFocus
                />
              </div>
              <div>
                <div 
                  className="h-8 rounded-md mb-2"
                  style={{ backgroundColor: hslToHex(editHue, 70, 60) }}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={editHue}
                  onChange={(e) => setEditHue(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, 70%, 60%),
                      hsl(60, 70%, 60%),
                      hsl(120, 70%, 60%),
                      hsl(180, 70%, 60%),
                      hsl(240, 70%, 60%),
                      hsl(300, 70%, 60%),
                      hsl(360, 70%, 60%)
                    )`,
                    height: '20px',
                    borderRadius: '10px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleCancelEdit()}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSaveEdit(project.id)}
                  className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100"
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : showDeleteConfirm === project.id ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Are you sure you want to delete this project and all its tasks?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmDelete(project.id)}
                  className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(project);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(project.id);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => onProjectSelect(project.id)}
                className="mt-2 w-full text-left"
              >
                <p className="text-sm text-gray-600">
                  {project.tasks.length} tasks
                </p>
                <div className="mt-4 flex gap-2">
                  {Object.entries(
                    project.tasks.reduce((acc, task) => ({
                      ...acc,
                      [task.status]: (acc[task.status] || 0) + 1,
                    }), {} as Record<string, number>)
                  ).map(([status, count]) => (
                    <span
                      key={status}
                      className={`px-2 py-1 rounded-full text-xs ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {count} {status}
                    </span>
                  ))}
                </div>
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}