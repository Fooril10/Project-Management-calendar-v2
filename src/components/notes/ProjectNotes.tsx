import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Note } from '../../types/notes';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface ProjectNotesProps {
  project: Project;
  notes: Note[];
  onBack: () => void;
  onAddNote: (projectId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function ProjectNotes({ project, notes, onBack, onAddNote, onDeleteNote }: ProjectNotesProps) {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(project.id, newNote.trim());
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
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
              {notes.length} notes
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddNote();
          }}
          placeholder="Add a new note..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white shadow rounded-lg p-4 flex items-start justify-between"
          >
            <div className="flex-1">
              <p className="text-gray-900">{note.text}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(note.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="ml-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No notes yet. Add your first note above.
          </div>
        )}
      </div>
    </div>
  );
}