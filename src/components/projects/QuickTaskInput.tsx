import React, { useState } from 'react';

interface QuickTaskInputProps {
  onAddTask: (title: string) => void;
}

export function QuickTaskInput({ onAddTask }: QuickTaskInputProps) {
  const [title, setTitle] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type task title and press Enter..."
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      autoFocus
    />
  );
}