import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { CalendarView } from './pages/CalendarView';
import { ProjectsView } from './pages/ProjectsView';
import { AllTasksView } from './pages/AllTasksView';
import { OptimizationNotesView } from './pages/OptimizationNotesView';
import { useProjectStore } from './store/projectStore';

function App() {
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => fetchProjects()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/tasks" element={<AllTasksView />} />
            <Route path="/notes" element={<OptimizationNotesView />} />
            <Route path="/" element={<Navigate to="/calendar" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;