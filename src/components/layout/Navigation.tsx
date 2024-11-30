import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Layout, ListTodo, Lightbulb } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Layout className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ProjectHub</span>
            </div>
            <div className="ml-6 flex space-x-8">
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <Layout className="h-4 w-4 mr-2" />
                Projects
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <ListTodo className="h-4 w-4 mr-2" />
                All Tasks
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-indigo-500 text-gray-900'
                      : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Optimization Notes
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}