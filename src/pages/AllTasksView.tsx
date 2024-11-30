import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { format } from 'date-fns';

export function AllTasksView() {
  const projects = useProjectStore((state) => state.projects);
  const showCompleted = useProjectStore((state) => state.showCompleted);
  const toggleCompletedVisibility = useProjectStore((state) => state.toggleCompletedVisibility);

  const allTasks = projects.flatMap(project => 
    project.tasks
      .filter(task => showCompleted || !task.completed)
      .map(task => ({
        ...task,
        projectName: project.name,
        projectColor: project.color
      }))
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <button
            onClick={toggleCompletedVisibility}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            {showCompleted ? 'Hide' : 'Show'} Completed
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allTasks.map((task) => (
                <tr key={task.id} className={task.completed ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                        readOnly
                      />
                      <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ backgroundColor: task.projectColor }}
                      />
                      <span className="text-sm text-gray-900">{task.projectName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(task.dueDate, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}