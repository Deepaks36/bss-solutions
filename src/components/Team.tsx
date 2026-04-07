import { useState, useRef, useMemo } from 'react';
import { Plus, Trash2, X, Check, ImagePlus, Calendar, Pencil, TrendingUp } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent, TeamCelebration, CareerMilestone } from '../types';
import { useSite } from '../context/SiteContext';
import { uploadImageFile, deleteMediaFile } from '../utils/upload';

interface Props {
  content: SiteContent;
  dark: boolean;
}

// ── Edit / Add Modal ──────────────────────────────────────────
interface EditModalProps {
  item: TeamCelebration | null;
  year: number;
  orderIndex: number;
  dark: boolean;
  onSave: (data: TeamCelebration) => void;
  onClose: () => void;
}

function CelebrationEditModal({ item, year, orderIndex, dark, onSave, onClose }: EditModalProps) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImageFile(file)));
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const imgToDelete = images[idx];
    if (imgToDelete && imgToDelete.startsWith('/assets/uploads/')) {
      deleteMediaFile(imgToDelete);
    }
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: item?.id ?? `celeb-${Date.now()}`,
      year,
      title: title.trim(),
      description,
      images,
      order_index: item?.order_index ?? orderIndex,
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`shrink-0 flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <h3 className="text-base font-black">{item ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Event Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event name..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Event description..."
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Images</label>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${dark ? 'border-slate-700 hover:border-blue-500 text-slate-500 hover:text-blue-400' : 'border-slate-200 hover:border-blue-500 text-slate-400 hover:text-blue-500'}`}
              >
                <ImagePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || uploading}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Check className="w-4 h-4" />
            {uploading ? 'Uploading...' : item ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MemberEditModalProps {
  item: any | null;
  type: 'leader' | 'member';
  dark: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

function MemberEditModal({ item, type, dark, onSave, onClose }: MemberEditModalProps) {
  const [name, setName] = useState(item?.name ?? '');
  const [role, setRole] = useState(item?.role ?? '');
  const [bio, setBio] = useState(item?.bio ?? '');
  const [image, setImage] = useState(item?.image ?? '');
  const [timeline, setTimeline] = useState<CareerMilestone[]>(item?.timeline ?? []);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const path = await uploadImageFile(file);
        
        // Remove old image from server if it exists.
        if (image && image.startsWith('/assets/uploads/')) {
          deleteMediaFile(image);
        }
        
        setImage(path);
      } catch (_e) {
        // Ignore upload errors.
      }
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: item?.id ?? `leader-${Date.now()}`,
      name,
      role,
      bio,
      image,
      timeline,
      order_index: item?.order_index ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`shrink-0 flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <h3 className="text-base font-black">
            {type === 'leader' ? (item ? 'Edit Leader' : 'Add Leader') : (item ? 'Edit Member' : 'Add Member')}
          </h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Image */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 group">
              <img src={image || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover rounded-2xl border-4 border-blue-600/10" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ImagePlus className="w-6 h-6 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Role</label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Role..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Bio / Message</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Full bio or message..."
              rows={4}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          {type === 'leader' && (
            <div className="space-y-6 pt-6 border-t border-slate-200/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <label className={`text-[10px] font-black uppercase tracking-widest ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Career Timeline</label>
                </div>
                <button
                  onClick={() => setTimeline(prev => [...prev, { id: `m-${Date.now()}`, title: 'New Milestone', body: 'Achievement details...' }])}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 text-blue-600 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600/20 transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div key={item.id} className={`p-4 rounded-xl border ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black text-blue-600 uppercase">Milestone #{idx + 1}</span>
                      <button
                        onClick={() => setTimeline(prev => prev.filter(it => it.id !== item.id))}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      value={item.title}
                      onChange={e => {
                        const newTl = [...timeline];
                        newTl[idx] = { ...newTl[idx], title: e.target.value };
                        setTimeline(newTl);
                      }}
                      placeholder="Title (e.g. 2018 Founding)"
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
                    />
                    <textarea
                      value={item.body}
                      onChange={e => {
                        const newTl = [...timeline];
                        newTl[idx] = { ...newTl[idx], body: e.target.value };
                        setTimeline(newTl);
                      }}
                      placeholder="Achievement details..."
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
                    />
                  </div>
                ))}
                {timeline.length === 0 && (
                  <div className={`text-center py-6 border-2 border-dashed rounded-xl ${dark ? 'border-slate-800 text-slate-600' : 'border-slate-100 text-slate-400'}`}>
                    <p className="text-xs">No career items added yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Check className="w-4 h-4" />
            {item ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Celebration Popup (Modal) ──────────────────────────────────
function CelebrationPopup({
  year, celebrations, dark, onClose, onUpdate, onDelete, addItemToSection
}: {
  year: number;
  celebrations: TeamCelebration[];
  dark: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TeamCelebration>) => void;
  onDelete: (id: string) => void;
  addItemToSection: (section: keyof SiteContent, item: any) => void;
}) {
  const { editMode } = useSite();
  const [editingItem, setEditingItem] = useState<TeamCelebration | null | 'new'>(null);

  const handleSave = (data: TeamCelebration) => {
    if (editingItem === 'new') {
      addItemToSection('teamCelebrations', data);
    } else if (editingItem) {
      onUpdate(data.id, { title: data.title, description: data.description, images: data.images });
    }
    setEditingItem(null);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 lg:p-12 animate-fade-in">
      <div className={`relative w-full max-w-6xl h-full max-h-[92vh] flex flex-col rounded-[3rem] shadow-2xl overflow-hidden border ${dark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'}`}>

        {/* Compact Header */}
        <div className={`shrink-0 flex justify-between items-center px-8 py-4 border-b ${dark ? 'bg-slate-950/50 border-white/5' : 'bg-white/50 border-slate-100'} backdrop-blur-md sticky top-0 z-50`}>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xl font-black tracking-tighter">
              {year} <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ml-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Milestones</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {editMode && (
              <button
                onClick={() => setEditingItem('new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${dark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrolling Content */}
        <div className="flex-1 overflow-y-auto px-8 sm:px-16 pb-20 pt-12 no-scrollbar">
          {celebrations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20">
              <Calendar className={`w-12 h-12 mb-4 ${dark ? 'text-slate-800' : 'text-slate-200'}`} />
              <p className={`text-sm font-medium ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No events recorded.</p>
            </div>
          ) : (
            <div className="space-y-32">
              {celebrations.map((celeb, i) => {
                const [firstImage, ...remainingImages] = celeb.images;
                return (
                  <div key={celeb.id} className="animate-fade-in-up">
                    <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                      {/* Image Container - NO SHADOWS/OVERLAYS */}
                      <div className="flex-1 w-full relative">
                        <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-slate-200/10">
                          {firstImage ? (
                            <img src={firstImage} alt={celeb.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-slate-900 shadow-inner' : 'bg-slate-100'}`}>
                              <ImagePlus className="w-12 h-12 opacity-10" />
                            </div>
                          )}
                        </div>

                        {editMode && (
                          <div className="absolute top-6 right-6 flex gap-2">
                            <button onClick={() => setEditingItem(celeb)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => { 
                              if (confirm('Delete this event?')) {
                                celeb.images.forEach(img => {
                                  if (img.startsWith('/assets/uploads/')) deleteMediaFile(img);
                                });
                                onDelete(celeb.id);
                              }
                            }} className="p-3 bg-red-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 w-full space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-px w-10 bg-blue-600" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Yearly Highlight</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">{celeb.title}</h3>
                        <p className={`text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{celeb.description}</p>
                      </div>
                    </div>

                    {/* Gallery - NO HOVER OVERLAYS */}
                    {remainingImages.length > 0 && (
                      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {remainingImages.map((img, idx) => (
                          <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                            <img src={img} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {editingItem && (
        <CelebrationEditModal
          item={editingItem === 'new' ? null : (editingItem as TeamCelebration)}
          year={year}
          orderIndex={celebrations.length}
          dark={dark}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

// ── Main Team Component ───────────────────────────────────────
export function Team({ content, dark }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);
  const { editMode, updateContent, updateSectionItemAtomic, addItemToSection, deleteItemFromSection } = useSite();
  const [editingModal, setEditingModal] = useState<{ type: 'leader' | 'member'; item: any } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const teamCelebrations = useMemo(() => content.teamCelebrations || [], [content.teamCelebrations]);
  // const teamMembers = useMemo(() => content.teamMembers || [], [content.teamMembers]);
  const displayYears = useMemo(() => {
    const years = Array.from(new Set((content.teamCelebrations || []).map(c => c.year))).sort((a, b) => a - b);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [content.teamCelebrations]);

  return (
    <section id="team" className={`relative py-16 transition-colors duration-300 ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Leadership & Shareholders Section ── */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-16 px-4">
            <div>
              <h2 className={`text-4xl sm:text-5xl font-black mb-2 tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Leadership & Vision</h2>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>The strategic minds driving BSS-Solutions forward.</p>
            </div>
            {editMode && (
              <button
                onClick={() => setEditingModal({ type: 'leader', item: null })}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5 shadow-sm" /> Add Leader
              </button>
            )}
          </div>

          <div className="space-y-40">
            {(content.leaders || []).map((leader, leaderIdx) => {
              const isInfoLeft = leaderIdx % 2 === 0;
              return (
                <div 
                  key={leader.id} 
                  className={`flex flex-col ${isInfoLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-16 transition-all duration-700 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                  {/* Leader Info */}
                  <div className="flex-1 w-full text-left space-y-8">
                    <div>
                      <div className="mb-4 inline-flex items-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                        {leader.role.split(' ')[0]} Perspective
                      </div>

                      <h2 className={`text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-none ${dark ? 'text-white' : 'text-slate-950'}`}>
                        {leader.name}
                      </h2>

                      <div className="flex items-center justify-start gap-4">
                        <div className="h-0.5 w-12 bg-blue-600" />
                        <p className="text-xl font-bold tracking-widest uppercase text-blue-600/80">
                          {leader.role}
                        </p>
                      </div>

                      {editMode && (
                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => setEditingModal({ type: 'leader', item: leader })}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                          >
                            <Pencil className="w-4 h-4" /> Edit Profile
                          </button>
                          <button
                            onClick={() => { 
                              if(confirm('Remove this leader?')) {
                                if (leader.image?.startsWith('/assets/uploads/')) {
                                  deleteMediaFile(leader.image);
                                }
                                deleteItemFromSection('leaders', leader.id);
                              }
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2 bg-red-600/10 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Leader Career Timeline Section (Premium Scrollable Card) */}
                    <div className={`relative mt-12 p-8 sm:p-12 rounded-[3.5rem] border ${dark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100 shadow-3xl shadow-blue-500/5'} backdrop-blur-xl overflow-hidden transition-all duration-500`}>
                      
                      {/* Header inside Card */}
                      <div className="flex items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${dark ? 'bg-slate-800' : 'bg-blue-600 shadow-blue-600/20'}`}>
                            <TrendingUp className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className={`text-lg font-black tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Evolution Journey</h4>
                            <p className={`text-[10px] font-black tracking-widest uppercase opacity-50`}>Milestones & Achievements</p>
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Container */}
                      <div className="relative max-h-[500px] overflow-y-auto pr-4 no-scrollbar space-y-12">
                        <div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px ${dark ? 'bg-slate-800' : 'bg-slate-100'} hidden md:block`} />

                        <div className="space-y-12 relative z-10 py-4">
                          {leader.timeline && leader.timeline.length > 0 ? (
                            leader.timeline.map((item, idx) => {
                              const isEven = idx % 2 === 0;
                              return (
                                <div key={item.id} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                  <div className={`flex-1 w-full flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`group relative max-w-sm p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 ${dark ? 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-800' : 'bg-slate-50/50 border-slate-100 shadow-xl shadow-slate-200/20'}`}>
                                      <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-px bg-blue-600/40 hidden md:block ${isEven ? '-right-8' : '-left-8'}`} />
                                      <div className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-600 border-4 border-white dark:border-slate-900 hidden md:block ${isEven ? '-right-[1.125rem]' : '-left-[1.125rem]'}`} />

                                      <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black ${dark ? 'bg-slate-700' : 'bg-blue-600 shadow-lg shadow-blue-600/20'}`}>
                                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                        </div>
                                        <h4 className={`text-xl font-black leading-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
                                          {item.title}
                                        </h4>
                                      </div>
                                      <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {item.body}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="hidden md:block flex-1" />
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-20">
                               <p className={`text-sm font-bold uppercase tracking-widest opacity-20`}>No items added</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={`absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t ${dark ? 'from-slate-950' : 'from-white'} to-transparent opacity-60`} />
                    </div>
                  </div>

                  {/* Leader Image */}
                  <div className="relative w-full lg:w-[420px] shrink-0 group aspect-square">
                    <div className={`absolute inset-0 rounded-[4rem] rotate-6 transition-transform group-hover:rotate-3 blur-3xl opacity-20 ${dark ? 'bg-blue-400' : 'bg-blue-600'}`} />
                    <div className={`absolute inset-4 rounded-[4rem] -rotate-3 transition-transform group-hover:rotate-0 ${dark ? 'bg-blue-600/10' : 'bg-blue-50'}`} />
                    <div className={`relative h-full w-full overflow-hidden rounded-[4rem] shadow-3xl border-[16px] border-white dark:border-slate-800 ring-1 ring-slate-200/50 dark:ring-slate-700/50 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                      <img
                        src={leader.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'}
                        alt={leader.name}
                        className="h-full w-full object-contain transition-all duration-1000 group-hover:scale-102"
                      />
                      {editMode && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingModal({ type: 'leader', item: leader })}
                            className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                          >
                            <Pencil className="w-6 h-6" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Team Members Section ── */}
        {/* <div className={`mb-32 transition-all duration-700 delay-150 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className={`text-4xl font-black mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>Meet the Team</h3>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>The talented people making vision a reality.</p>
            </div>
            {editMode && (
              <button
                onClick={() => setEditingModal({ type: 'member', item: null })}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Plus className="w-5 h-5" /> Add Member
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="group relative">
                <div className={`relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-4 ${dark ? 'bg-slate-800 ring-1 ring-slate-700' : 'bg-white ring-1 ring-slate-200 shadow-xl shadow-slate-200/50'}`}>
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-white font-black text-2xl mb-1">{member.name}</h4>
                    <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">{member.role}</p>
                    <p className="text-slate-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {editMode && (
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingModal({ type: 'member', item: member })}
                        className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { 
                          if (confirm(`Remove ${member.name}?`)) {
                            if (member.image?.startsWith('/assets/uploads/')) {
                              deleteMediaFile(member.image);
                            }
                            deleteItemFromSection('teamMembers', member.id);
                          }
                        }}
                        className="p-2.5 bg-red-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* ── Culture & Celebrations ── */}
        <div className={`transition-all duration-700 delay-300 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-10">
            <h3 className={`text-2xl font-black mb-2 ${dark ? 'text-white' : 'text-slate-950'}`}>
              <EditableText
                value={content.teamTitle || 'Our Culture & Celebrations'}
                onSave={v => updateContent('teamTitle', v)}
                as="span"
              />
            </h3>
            <p className={`max-w-2xl mx-auto text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Take a look back at our journey, milestones, and the moments that bring our team together.
            </p>
          </div>

          {/* Timeline View - Redesigned to Dot and Line style */}
          <div className="relative mt-20 max-w-5xl mx-auto px-4 pb-20 overflow-x-auto no-scrollbar">
            {/* Continuous Horizontal Line */}
            <div className={`absolute top-[4.5rem] left-0 right-0 h-0.5 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            <div className="relative flex justify-between items-start min-w-[800px] px-10">
              {displayYears.map((year) => (
                <div
                  key={year}
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => setSelectedYear(year)}
                >
                  {/* The Point (Dot) */}
                  <div className={`w-4 h-4 rounded-full border-2 transform transition-all duration-300 z-10 
                    ${dark ? 'bg-slate-900 border-slate-700 group-hover:border-blue-500' : 'bg-white border-slate-300 group-hover:border-blue-500'}
                    group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]
                  `} />

                  {/* Connecting Small Line (Vertical) */}
                  <div className={`w-0.5 h-6 ${dark ? 'bg-slate-800' : 'bg-slate-200'} group-hover:bg-blue-600 transition-colors`} />

                  {/* Year Text */}
                  <div className="mt-2 text-center transition-all duration-300 group-hover:-translate-y-1">
                    <span className={`text-sm font-black tracking-widest ${dark ? 'text-slate-600 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>
                      {year}
                    </span>
                  </div>
                </div>
              ))}

              {editMode && (
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      const y = prompt('Enter year:');
                      if (y && !isNaN(parseInt(y))) {
                        addItemToSection('teamCelebrations', {
                          id: `celeb-${Date.now()}`,
                          year: parseInt(y),
                          title: 'New Event',
                          description: 'Details about the event...',
                          images: [],
                          order_index: 0,
                        });
                      }
                    }}
                    className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${dark ? 'border-slate-700 text-slate-600 hover:text-blue-400 hover:border-blue-500' : 'border-slate-200 text-slate-300 hover:text-blue-600 hover:border-blue-500'}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingModal && (
        <MemberEditModal
          type={editingModal.type as 'leader' | 'member'}
          item={editingModal.item}
          dark={dark}
          onSave={(data) => {
            const section = editingModal.type === 'leader' ? 'leaders' : 'teamMembers';
            if (editingModal.item) {
              updateSectionItemAtomic(section, editingModal.item.id, data);
            } else {
              addItemToSection(section, data);
            }
            setEditingModal(null);
          }}
          onClose={() => setEditingModal(null)}
        />
      )}
      {selectedYear !== null && (
        <CelebrationPopup
          year={selectedYear}
          celebrations={teamCelebrations.filter(c => c.year === selectedYear)}
          dark={dark}
          onClose={() => setSelectedYear(null)}
          onUpdate={(id, updates) => updateSectionItemAtomic('teamCelebrations', id, updates)}
          onDelete={id => deleteItemFromSection('teamCelebrations', id)}
          addItemToSection={addItemToSection}
        />
      )}
    </section>
  );
}
