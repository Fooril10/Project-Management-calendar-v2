import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { ProjectDetail } from '../components/projects/ProjectDetail';
import { ProjectHeader } from '../components/projects/ProjectHeader';
import { AddProjectModal } from '../components/projects/AddProjectModal';
import { TaskVisibilityToggle } from '../components/shared/TaskVisibilityToggle';
import { Plus } from 'lucide-react';

export function ProjectsView() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const projects = useProjectStore((state) => state.projects);
  const showCompleted = useProjectStore((state) => state.showCompleted);
  const toggleCompletedVisibility = useProjectStore((state) => state.toggleCompletedVisibility);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const filteredProjects = projects.map(project => ({
    ...project,
    tasks: project.tasks.filter(task => showCompleted || !task.completed)
  }));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>
        <div className="flex justify-end">
          <TaskVisibilityToggle
            showCompleted={showCompleted}
            onToggleCompleted={toggleCompletedVisibility}
          />
        </div>
      </div>
      {selectedProject ? (
        <ProjectDetail 
          project={{
            ...selectedProject,
            tasks: selectedProject.tasks.filter(task => showCompleted || !task.completed)
          }}
          onBack={() => setSelectedProjectId(null)} 
        />
      ) : (
        <ProjectGrid 
          projects={filteredProjects}
          onProjectSelect={setSelectedProjectId} 
        />
      )}
      <AddProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}