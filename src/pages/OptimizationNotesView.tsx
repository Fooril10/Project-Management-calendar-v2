import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { NotesGrid } from '../components/notes/NotesGrid';
import { ProjectNotes } from '../components/notes/ProjectNotes';
import { Note, ProjectNotes as ProjectNotesType } from '../types/notes';

export function OptimizationNotesView() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectNotes, setProjectNotes] = useState<ProjectNotesType>(() => {
    const savedNotes = localStorage.getItem('project-notes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  const projects = useProjectStore((state) => state.projects);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  useEffect(() => {
    localStorage.setItem('project-notes', JSON.stringify(projectNotes));
  }, [projectNotes]);

  const handleAddNote = (projectId: string, text: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      projectId,
      text,
      timestamp: new Date(),
    };

    setProjectNotes(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newNote]
    }));
  };

  const handleDeleteNote = (noteId: string) => {
    setProjectNotes(prev => {
      const newNotes = { ...prev };
      Object.keys(newNotes).forEach(projectId => {
        newNotes[projectId] = newNotes[projectId].filter(note => note.id !== noteId);
      });
      return newNotes;
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        {selectedProject ? (
          <ProjectNotes
            project={selectedProject}
            notes={projectNotes[selectedProject.id] || []}
            onBack={() => setSelectedProjectId(null)}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Optimization Notes</h1>
            <NotesGrid
              projects={projects}
              projectNotes={projectNotes}
              onProjectSelect={setSelectedProjectId}
            />
          </>
        )}
      </div>
    </div>
  );
}