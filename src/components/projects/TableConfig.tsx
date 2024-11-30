import React, { useState } from 'react';
import { Settings, Plus, X, Edit2, Check } from 'lucide-react';
import { ColumnConfig } from '../../types/project';
import { DropdownOptionsConfig } from './DropdownOptionsConfig';

interface TableConfigProps {
  columns: ColumnConfig[];
  statusLabels: string[];
  onUpdateColumns: (columns: ColumnConfig[]) => void;
  onUpdateStatusLabels: (labels: string[]) => void;
}

export function TableConfig({ columns, statusLabels, onUpdateColumns, onUpdateStatusLabels }: TableConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newColumnType, setNewColumnType] = useState<ColumnConfig['type']>('text');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [editingColumn, setEditingColumn] = useState<{ id: string; options: string[] } | null>(null);

  const handleAddColumn = () => {
    if (newColumnLabel.trim()) {
      const newColumn: ColumnConfig = {
        id: crypto.randomUUID(),
        type: newColumnType,
        label: newColumnLabel.trim(),
        options: newColumnType === 'dropdown' ? [] : undefined,
      };
      onUpdateColumns([...columns, newColumn]);
      setNewColumnLabel('');
      setNewColumnType('text');
    }
  };

  const handleUpdateColumnOptions = (columnId: string, options: string[]) => {
    onUpdateColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, options }
          : col
      )
    );
  };

  const handleRemoveColumn = (columnId: string) => {
    onUpdateColumns(columns.filter(col => col.id !== columnId));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold mb-4">Table Configuration</h3>
          
          <div className="space-y-6">
            {/* Status Labels Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status Labels</h4>
              <DropdownOptionsConfig
                options={statusLabels}
                onUpdateOptions={onUpdateStatusLabels}
              />
            </div>

            {/* Columns Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Columns</h4>
              <div className="space-y-4 mb-4">
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className="p-3 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{column.label}</span>
                        <span className="ml-2 text-sm text-gray-500">({column.type})</span>
                      </div>
                      {!['title', 'status', 'dueDate'].includes(column.id) && (
                        <button
                          onClick={() => handleRemoveColumn(column.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {column.type === 'dropdown' && (
                      <div className="mt-2">
                        <DropdownOptionsConfig
                          options={column.options || []}
                          onUpdateOptions={(options) => handleUpdateColumnOptions(column.id, options)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={newColumnType}
                  onChange={(e) => setNewColumnType(e.target.value as ColumnConfig['type'])}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="tags">Tags</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="date">Date</option>
                  <option value="checkbox">Checkbox</option>
                </select>
                <input
                  type="text"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                  }}
                  placeholder="Column label"
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={handleAddColumn}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}