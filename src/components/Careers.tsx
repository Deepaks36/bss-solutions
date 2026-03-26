import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, X, ChevronRight, Pencil, Trash2, Plus, Save } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { JobPosition, SiteContent } from '../types';

interface Props {
    content: SiteContent;
    dark: boolean;
    onUpdate: (key: keyof SiteContent, value: string) => void;
    onUpdatePositionAtomic: (id: string, updates: Partial<JobPosition>) => void;
    onAddPosition: (position: JobPosition) => void;
    onDeletePosition: (id: string) => void;
}

function PositionCard({
    position,
    index,
    dark,
    onUpdatePositionAtomic,
    onDeletePosition,
}: {
    position: JobPosition;
    index: number;
    dark: boolean;
    onUpdatePositionAtomic: (id: string, updates: Partial<JobPosition>) => void;
    onDeletePosition: (id: string) => void;
}) {
    const { ref, visible } = useAnimateOnScroll(0.1);
    const { editMode } = useSite();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(position);

    useEffect(() => {
        setEditData(position);
    }, [position]);

    const handleSave = () => {
        onUpdatePositionAtomic(position.id, {
            title: editData.title,
            department: editData.department,
            location: editData.location,
            type: editData.type,
            description: editData.description
        });
        setIsEditing(false);
    };

    return (
        <div
            ref={ref}
            className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${dark
                    ? 'bg-gray-800/60 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-900/20'
                    : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-100'
                }`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            {isEditing && editMode ? (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        placeholder="Job Title"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={editData.department}
                            onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                            className={`rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            placeholder="Department"
                        />
                        <input
                            type="text"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className={`rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            placeholder="Location"
                        />
                    </div>
                    <input
                        type="text"
                        value={editData.type}
                        onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                        className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        placeholder="Job Type"
                    />
                    <textarea
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                        placeholder="Description"
                        rows={3}
                    />
                    <button
                        onClick={handleSave}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Save className="h-4 w-4" /> Save Changes
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex items-start justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${dark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <Briefcase className="h-6 w-6" />
                        </div>
                        {editMode && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDeletePosition(position.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{position.title}</h3>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${dark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                {position.department}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <MapPin className="h-3 w-3" /> {position.location}
                            </span>
                            <span className={`flex items-center gap-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Clock className="h-3 w-3" /> {position.type}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed line-clamp-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {position.description}
                        </p>
                    </div>
                    <button className={`mt-6 inline-flex items-center text-sm font-semibold transition-all hover:gap-2 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                        View Details <ChevronRight className="h-4 w-4" />
                    </button>
                </>
            )}
        </div>
    );
}

export function Careers({ content, dark, onUpdate, onUpdatePositionAtomic, onAddPosition, onDeletePosition }: Props) {
    const { ref, visible } = useAnimateOnScroll(0.1);
    const { editMode } = useSite();
    const [isAdding, setIsAdding] = useState(false);
    const [newPos, setNewPos] = useState<Partial<JobPosition>>({
        title: '',
        department: '',
        location: '',
        type: '',
        description: ''
    });

    const handleAdd = () => {
        if (!newPos.title) return;
        const position: JobPosition = {
            id: `p${Date.now()}`,
            title: newPos.title || 'New Position',
            department: newPos.department || 'General',
            location: newPos.location || 'Remote',
            type: newPos.type || 'Full-time',
            description: newPos.description || '',
        };
        onAddPosition(position);
        setIsAdding(false);
        setNewPos({ title: '', department: '', location: '', type: '', description: '' });
    };

    return (
        <section id="careers" className={`py-24 relative overflow-hidden ${dark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 relative z-10">
                <div
                    ref={ref}
                    className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <span className={`inline-block text-sm font-bold uppercase tracking-widest mb-3 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
                        <EditableText
                            value={content.careersTagline}
                            onSave={(v) => onUpdate('careersTagline', v)}
                            className=""
                            dark={dark}
                        />
                    </span>
                    <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        <EditableText
                            value={content.careersTitle}
                            onSave={(v) => onUpdate('careersTitle', v)}
                            className=""
                            dark={dark}
                        />
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <EditableText
                            value={content.careersSubtitle}
                            onSave={(v) => onUpdate('careersSubtitle', v)}
                            className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                            multiline
                            dark={dark}
                        />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {content.positions.map((pos, i) => (
                        <PositionCard
                            key={pos.id}
                            position={pos}
                            index={i}
                            dark={dark}
                            onUpdatePositionAtomic={onUpdatePositionAtomic}
                            onDeletePosition={onDeletePosition}
                        />
                    ))}

                    {editMode && (
                        <div className="relative">
                            {isAdding ? (
                                <div className={`rounded-2xl border p-6 bg-card shadow-lg border-blue-500/50 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Add New Position</h3>
                                        <button onClick={() => setIsAdding(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={newPos.title}
                                            onChange={(e) => setNewPos({ ...newPos, title: e.target.value })}
                                            className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            placeholder="Job Title *"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={newPos.department}
                                                onChange={(e) => setNewPos({ ...newPos, department: e.target.value })}
                                                className={`rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                placeholder="Department *"
                                            />
                                            <input
                                                type="text"
                                                value={newPos.location}
                                                onChange={(e) => setNewPos({ ...newPos, location: e.target.value })}
                                                className={`rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                                placeholder="Location"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={newPos.type}
                                            onChange={(e) => setNewPos({ ...newPos, type: e.target.value })}
                                            className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            placeholder="Job Type (e.g. Full-time)"
                                        />
                                        <textarea
                                            value={newPos.description}
                                            onChange={(e) => setNewPos({ ...newPos, description: e.target.value })}
                                            className={`w-full rounded-lg border p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                                            placeholder="Description"
                                            rows={3}
                                        />
                                        <button
                                            onClick={handleAdd}
                                            disabled={!newPos.title || !newPos.department}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            Post Position
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className={`flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group h-full w-full ${dark ? 'border-gray-700 hover:bg-blue-900/10' : 'border-gray-200'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                                        <Plus className="h-6 w-6" />
                                    </div>
                                    <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add New Position</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
