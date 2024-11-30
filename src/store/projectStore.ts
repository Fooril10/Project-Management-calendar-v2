import { create } from 'zustand';
import { Project, Task, ColumnConfig } from '../types/project';
import { addDays } from 'date-fns';
import * as projectService from '../services/project';
import * as taskService from '../services/task';

const defaultColumns: ColumnConfig[] = [
  { id: 'title', type: 'text', label: 'Title' },
  { id: 'status', type: 'dropdown', label: 'Status' },
  { id: 'dueDate', type: 'date', label: 'Due Date' },
  { id: 'tags', type: 'tags', label: 'Tags' }
];

const defaultStatusLabels = ['todo', 'in-progress', 'completed'];

interface ProjectStore {
  projects: Project[];
  showCompleted: boolean;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'columns' | 'statusLabels'>) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId' | 'completed'>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  toggleProjectVisibility: (projectId: string) => void;
  toggleTaskCompletion: (projectId: string, taskId: string) => Promise<void>;
  toggleCompletedVisibility: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  showCompleted: true,
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectService.getProjects();
      for (const project of projects) {
        const tasks = await taskService.getProjectTasks(project.id);
        project.tasks = tasks;
      }
      set({ projects, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },

  addProject: async (project) => {
    try {
      const projectId = await projectService.addProject({
        ...project,
        tasks: [],
        columns: defaultColumns,
        statusLabels: defaultStatusLabels
      });
      set((state) => ({
        projects: [...state.projects, {
          ...project,
          id: projectId,
          tasks: [],
          columns: defaultColumns,
          statusLabels: defaultStatusLabels
        }]
      }));
    } catch (error) {
      set({ error: 'Failed to add project' });
    }
  },

  updateProject: async (projectId, updates) => {
    try {
      await projectService.updateProject(projectId, updates);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? { ...project, ...updates }
            : project
        )
      }));
    } catch (error) {
      set({ error: 'Failed to update project' });
    }
  },

  deleteProject: async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== projectId)
      }));
    } catch (error) {
      set({ error: 'Failed to delete project' });
    }
  },

  addTask: async (projectId, task) => {
    try {
      const taskId = await taskService.addTask(projectId, {
        ...task,
        projectId,
        completed: false
      });
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: [...project.tasks, { 
                  ...task, 
                  id: taskId, 
                  projectId,
                  completed: false
                }]
              }
            : project
        )
      }));
    } catch (error) {
      set({ error: 'Failed to add task' });
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      await taskService.deleteTask(taskId);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId)
              }
            : project
        )
      }));
    } catch (error) {
      set({ error: 'Failed to delete task' });
    }
  },

  updateTask: async (projectId, taskId, updates) => {
    try {
      await taskService.updateTask(taskId, updates);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId
                    ? { ...task, ...updates }
                    : task
                )
              }
            : project
        )
      }));
    } catch (error) {
      set({ error: 'Failed to update task' });
    }
  },

  toggleProjectVisibility: (projectId) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, isVisible: !project.isVisible }
          : project
      )
    })),

  toggleTaskCompletion: async (projectId, taskId) => {
    const { projects } = get();
    const project = projects.find(p => p.id === projectId);
    const task = project?.tasks.find(t => t.id === taskId);
    
    if (!task) return;

    const completed = !task.completed;
    
    try {
      await taskService.updateTask(taskId, { completed });

      if (completed && task.recurring) {
        const nextDueDate = addDays(task.dueDate, task.recurring.frequency);
        
        if (!task.recurring.endDate || nextDueDate <= task.recurring.endDate) {
          const newTask = {
            ...task,
            dueDate: nextDueDate,
            completed: false
          };
          delete newTask.id;
          await get().addTask(projectId, newTask);
        }
      }

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === taskId
                    ? { ...t, completed }
                    : t
                )
              }
            : p
        )
      }));
    } catch (error) {
      set({ error: 'Failed to toggle task completion' });
    }
  },

  toggleCompletedVisibility: () =>
    set((state) => ({ showCompleted: !state.showCompleted }))
}));