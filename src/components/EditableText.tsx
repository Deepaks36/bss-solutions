import React, { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useCurrentSection } from '../context/SectionContext';

interface EditableTextProps {
    value: string;
    onSave: (value: string) => void;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'blockquote';
    className?: string;
    multiline?: boolean;
    dark?: boolean; // Keep optional if needed for coloring, or get from context if added there
}

export function EditableText({
    value,
    onSave,
    as: Tag = 'p',
    className = '',
    multiline = false,
    dark = false,
}: EditableTextProps) {
    const { editMode, activeEditingSection } = useSite();
    const sectionId = useCurrentSection();
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value);
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    const isThisSectionEditing = editMode && (activeEditingSection === null || activeEditingSection === sectionId);

    useEffect(() => {
        setText(value);
    }, [value]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    if (!isThisSectionEditing) {
        return <Tag className={className}>{value}</Tag>;
    }

    if (editing) {
        return (
            <div className="relative w-full">
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={() => {
                            onSave(text);
                            setEditing(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setText(value);
                                setEditing(false);
                            }
                        }}
                        className={`w-full rounded-md border-2 border-blue-500 p-2 outline-none ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                            }`}
                        rows={4}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={() => {
                            onSave(text);
                            setEditing(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSave(text);
                                setEditing(false);
                            }
                            if (e.key === 'Escape') {
                                setText(value);
                                setEditing(false);
                            }
                        }}
                        className={`w-full rounded-md border-2 border-blue-500 p-2 outline-none ${dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                            }`}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="group relative inline-block max-w-full">
            <Tag className={className}>{value}</Tag>
            <button
                onClick={() => setEditing(true)}
                className="absolute -top-2 -right-6 rounded-full bg-blue-600 p-1.5 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                aria-label="Edit text"
            >
                <Pencil className="h-3 w-3" />
            </button>
        </div>
    );
}
