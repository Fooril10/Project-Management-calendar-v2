import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Project, ColumnConfig } from '../../types/project';
import { ProjectTable } from './ProjectTable';
import { useProjectStore } from '../../store/projectStore';
import { QuickTaskInput } from './QuickTaskInput';
import { TableConfig } from './TableConfig';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const updateTask = useProjectStore((state) => state.updateTask);
  const addTask = useProjectStore((state) => state.addTask);
  const deleteTask = useProjectStore((state) => state.deleteTask);
  const toggleTaskCompletion = useProjectStore((state) => state.toggleTaskCompletion);
  const updateProject = useProjectStore((state) => state.updateProject);

  const handleAddTask = (title: string) => {
    addTask(project.id, {
      title,
      dueDate: new Date(),
      status: project.statusLabels[0] || 'todo',
      tags: [],
    });
  };

  const handleUpdateColumns = (columns: ColumnConfig[]) => {
    updateProject(project.id, { columns });
  };

  const handleUpdateStatusLabels = (statusLabels: string[]) => {
    updateProject(project.id, { statusLabels });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <div className="mt-1 flex gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-sm text-gray-600">
                {project.tasks.length} tasks
              </span>
            </div>
          </div>
        </div>
        <TableConfig
          columns={project.columns}
          statusLabels={project.statusLabels}
          onUpdateColumns={handleUpdateColumns}
          onUpdateStatusLabels={handleUpdateStatusLabels}
        />
      </div>
      <div className="mb-4">
        <QuickTaskInput onAddTask={handleAddTask} />
      </div>
      <ProjectTable 
        project={project}
        onUpdateTask={(taskId, updates) => updateTask(project.id, taskId, updates)}
        onToggleTaskCompletion={(taskId) => toggleTaskCompletion(project.id, taskId)}
        onDeleteTask={(taskId) => deleteTask(project.id, taskId)}
      />
    </div>
  );
}