import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface Props {
  value: string;
  editMode: boolean;
  onSave: (v: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  multiline?: boolean;
}

export function EditableField({ value, editMode, onSave, tag = 'span', className = '', multiline = false }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const Tag = tag;

  if (editMode && editing) {
    return (
      <span className="inline-flex flex-col gap-1 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-500 bg-blue-50 text-gray-900 text-sm resize-y outline-none"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-500 bg-blue-50 text-gray-900 text-sm outline-none"
          />
        )}
        <span className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
          >
            <Check className="w-3 h-3" /> Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white text-xs rounded-lg hover:bg-gray-500 transition-colors"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
        </span>
      </span>
    );
  }

  if (editMode) {
    return (
      <span className="group relative inline-block">
        <Tag className={className}>{value}</Tag>
        <button
          onClick={() => setEditing(true)}
          className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700 shadow-md"
          title="Edit"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </span>
    );
  }

  return <Tag className={className}>{value}</Tag>;
}
