import React, { useState } from 'react';
import { Plus, X, Edit2, Check } from 'lucide-react';

interface DropdownOptionsConfigProps {
  options: string[];
  onUpdateOptions: (options: string[]) => void;
}

export function DropdownOptionsConfig({ options, onUpdateOptions }: DropdownOptionsConfigProps) {
  const [newOption, setNewOption] = useState('');
  const [editingOption, setEditingOption] = useState<{ index: number; value: string } | null>(null);

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      onUpdateOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleEditOption = (index: number, newValue: string) => {
    if (newValue.trim() && !options.includes(newValue.trim())) {
      const newOptions = [...options];
      newOptions[index] = newValue.trim();
      onUpdateOptions(newOptions);
    }
    setEditingOption(null);
  };

  const handleRemoveOption = (option: string) => {
    onUpdateOptions(options.filter(o => o !== option));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <div key={index} className="inline-flex items-center">
            {editingOption?.index === index ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editingOption.value}
                  onChange={(e) => setEditingOption({ index, value: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditOption(index, editingOption.value);
                    if (e.key === 'Escape') setEditingOption(null);
                  }}
                  className="w-24 px-2 py-1 text-sm border rounded"
                  autoFocus
                />
                <button
                  onClick={() => handleEditOption(index, editingOption.value)}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingOption(null)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                {option}
                <button
                  onClick={() => setEditingOption({ index, value: option })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleRemoveOption(option)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddOption();
          }}
          placeholder="New option"
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
        <button
          onClick={handleAddOption}
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}