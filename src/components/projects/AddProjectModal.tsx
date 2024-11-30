import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [name, setName] = useState('');
  const [hue, setHue] = useState(0);
  const color = hslToHex(hue, 70, 60);
  const addProject = useProjectStore((state) => state.addProject);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && color) {
      addProject({
        name,
        color,
        isVisible: true,
      });
      onClose();
      setName('');
      setHue(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Project Color
              </label>
              <div className="space-y-3">
                <div 
                  className="h-12 rounded-lg"
                  style={{ backgroundColor: color }}
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => setHue(Number(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, 70%, 60%),
                      hsl(60, 70%, 60%),
                      hsl(120, 70%, 60%),
                      hsl(180, 70%, 60%),
                      hsl(240, 70%, 60%),
                      hsl(300, 70%, 60%),
                      hsl(360, 70%, 60%)
                    )`,
                    height: '20px',
                    borderRadius: '10px',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}