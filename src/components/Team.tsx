import { useState, useRef } from 'react';
import { Plus, Trash2, X, Check, ImagePlus, Calendar, User, Pencil } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent, TeamCelebration } from '../types';
import { useSite } from '../context/SiteContext';

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
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let loaded = 0;
    const results: string[] = [];
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        results[idx] = reader.result as string;
        loaded++;
        if (loaded === files.length) setImages(prev => [...prev, ...results]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

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
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className="text-base font-black">{item ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            <Check className="w-4 h-4" />
            {item ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MemberEditModalProps {
  item: any | null;
  type: 'ceo' | 'member';
  dark: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

function MemberEditModal({ item, type, dark, onSave, onClose }: MemberEditModalProps) {
  const [name, setName] = useState(item?.name ?? item?.ceoName ?? '');
  const [role, setRole] = useState(item?.role ?? item?.ceoRole ?? '');
  const [bio, setBio] = useState(item?.bio ?? item?.ceoMessage ?? '');
  const [image, setImage] = useState(item?.image ?? item?.ceoImage ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (type === 'ceo') {
      onSave({ ceoName: name, ceoRole: role, ceoMessage: bio, ceoImage: image });
    } else {
      onSave({
        id: item?.id ?? `member-${Date.now()}`,
        name,
        role,
        bio,
        image,
        order_index: item?.order_index ?? 0,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className="text-base font-black">{item ? `Edit ${type === 'ceo' ? 'CEO' : 'Member'}` : 'Add Member'}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
            {item ? 'Update' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Celebration Popup ─────────────────────────────────────────
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

  // but we keep each celebration as the unit
  return (
    <>
      <div className="fixed inset-0 z-[300] flex items-start justify-center bg-black/80 backdrop-blur-md overflow-y-auto pt-20 pb-20">
        <div className={`relative w-full max-w-6xl my-8 mx-4 rounded-[3rem] shadow-3xl ${dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

          {/* Sticky Header */}
          <div className={`sticky top-0 z-20 flex justify-between items-center px-8 py-5 rounded-t-[2.5rem] border-b ${dark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h2 className="text-xl font-black flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              {year}
              <span className={`text-xs font-bold tracking-[0.2em] uppercase ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Celebrations</span>
            </h2>
            <div className="flex items-center gap-2">
              {editMode && (
                <button
                  onClick={() => setEditingItem('new')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              )}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all ${dark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content - premium Alternating Layout */}
          <div className="p-8 sm:p-12 space-y-24">
            {celebrations.length === 0 ? (
              <div className="text-center py-16 opacity-40 text-sm">No events for {year} yet.</div>
            ) : (
              celebrations.map((celeb, i) => {
                const isImageLeft = i % 2 === 0;
                const [firstImage, ...remainingImages] = celeb.images;

                return (
                  <div
                    key={celeb.id}
                    className={`flex flex-col ${isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-16 group`}
                  >
                    {/* Main Image Column */}
                    <div className="relative flex-1 w-full shrink-0">
                      <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-200/10 ring-inset">
                        {firstImage ? (
                          <img src={firstImage} alt={celeb.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                             <ImagePlus className="w-12 h-12 opacity-10" />
                          </div>
                        )}
                        
                        {/* Decorative overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {editMode && (
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={() => setEditingItem(celeb)}
                            className="p-3 bg-blue-600 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm('Delete this event?')) onDelete(celeb.id); }}
                            className="p-3 bg-red-600 text-white rounded-2xl shadow-2xl hover:scale-110 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content + Additional Images Column */}
                    <div className="flex-1 w-full space-y-10">
                       <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="h-0.5 w-8 bg-blue-600" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                               {year} Milestone
                             </span>
                          </div>
                          <h4 className={`text-4xl sm:text-5xl font-black tracking-tight leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                            {celeb.title}
                          </h4>
                          <p className={`text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {celeb.description}
                          </p>
                       </div>

                       {/* Remaining Images Grid - Positioned below content as requested */}
                       {remainingImages.length > 0 && (
                          <div className={`grid gap-4 ${remainingImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                             {remainingImages.map((img, idx) => (
                               <div key={idx} className="aspect-[4/3] rounded-[1.5rem] overflow-hidden shadow-xl border border-white/10 ring-1 ring-black/5 hover:ring-blue-500/30 transition-all">
                                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                               </div>
                             ))}
                          </div>
                       )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Edit / Add modal rendered on top */}
      {editingItem !== null && (
        <CelebrationEditModal
          item={editingItem === 'new' ? null : (editingItem as TeamCelebration)}
          year={year}
          orderIndex={celebrations.length}
          dark={dark}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}

// ── Main Team Component ───────────────────────────────────────
export function Team({ content, dark }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);
  const { editMode, updateContent, updateSectionItemAtomic, addItemToSection, deleteItemFromSection } = useSite();
  const [editingModal, setEditingModal] = useState<{ type: 'ceo' | 'member'; item: any } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const teamCelebrations = content.teamCelebrations || [];
  const teamMembers = content.teamMembers || [];
  const years = Array.from(new Set(teamCelebrations.map(c => c.year))).sort((a, b) => b - a);
  const displayYears = years.length > 0 ? years : [new Date().getFullYear()];

  return (
    <section id="team" className={`relative py-24 transition-colors duration-300 ${dark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── CEO Section ── */}
        <div className={`mb-32 transition-all duration-700 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* CEO Image */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] shrink-0 group">
              <div className={`absolute inset-0 rounded-[4rem] rotate-6 transition-transform group-hover:rotate-3 blur-3xl opacity-20 ${dark ? 'bg-blue-400' : 'bg-blue-600'}`} />
              <div className={`absolute inset-4 rounded-[4rem] -rotate-3 transition-transform group-hover:rotate-0 ${dark ? 'bg-blue-600/10' : 'bg-blue-50'}`} />
              <div className="relative h-full w-full overflow-hidden rounded-[4rem] shadow-3xl border-[16px] border-white dark:border-slate-800 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                <img
                  src={content.ceoImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'}
                  alt={content.ceoName}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {editMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingModal({ type: 'ceo', item: content })}
                      className="p-4 bg-blue-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <Pencil className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CEO Info */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div>
                <div className="mb-4 inline-flex items-center rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                  {content.teamTagline || 'Leadership'}
                </div>
                <h2 className={`text-5xl sm:text-7xl font-black mb-2 tracking-tight leading-none ${dark ? 'text-white' : 'text-slate-950'}`}>
                  {content.ceoName || 'John Brilliant'}
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-4">
                   <div className="h-0.5 w-12 bg-blue-600" />
                   <p className="text-xl font-bold tracking-widest uppercase text-blue-600/80">
                     {content.ceoRole || 'Founder & CEO'}
                   </p>
                </div>
              </div>

              <div className={`relative p-12 rounded-[3rem] group overflow-hidden ${dark ? 'bg-slate-800/40 border border-slate-700/50' : 'bg-white shadow-2xl shadow-blue-500/10 border border-slate-100/50 backdrop-blur-xl'}`}>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                   <div className="flex items-start gap-6">
                      <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3 transform group-hover:rotate-0 transition-transform duration-500 ${dark ? 'bg-slate-700' : 'bg-blue-600 shadow-blue-600/20'}`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-4">
                         <p className={`text-xl leading-relaxed font-medium italic ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                            &ldquo;{content.ceoMessage}&rdquo;
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Team Members Section ── */}
        <div className={`mb-32 transition-all duration-700 delay-150 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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
                        onClick={() => { if (confirm(`Remove ${member.name}?`)) deleteItemFromSection('teamMembers', member.id); }}
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
        </div>

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

          {/* Timeline View */}
          <div className="relative mt-16 max-w-4xl mx-auto">
            {/* Connecting Line */}
            <div className={`absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            
            <div className="relative flex justify-between items-center gap-4 px-4 overflow-x-auto no-scrollbar">
              {displayYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="relative group py-12 flex flex-col items-center min-w-[120px] transition-all duration-500"
                >
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 transition-all duration-500 z-10 ${
                    selectedYear === year
                      ? 'bg-blue-600 border-white dark:border-slate-800 scale-150 shadow-[0_0_20px_rgba(37,99,235,0.5)]'
                      : dark
                      ? 'bg-slate-700 border-slate-900 group-hover:border-blue-500'
                      : 'bg-white border-slate-300 group-hover:border-blue-500'
                  }`} />
                  
                  <span className={`text-2xl font-black transition-all duration-500 ${
                    selectedYear === year
                      ? 'text-blue-600 scale-125 -translate-y-8'
                      : dark
                      ? 'text-slate-600 group-hover:text-slate-400'
                      : 'text-slate-300 group-hover:text-slate-500'
                  }`}>
                    {year}
                  </span>
                </button>
              ))}

              {editMode && (
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
                  className="relative py-12 flex flex-col items-center min-w-[80px]"
                >
                  <div className={`w-8 h-8 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${dark ? 'border-slate-700 text-slate-600 hover:text-blue-400 hover:border-blue-500' : 'border-slate-200 text-slate-300 hover:text-blue-600 hover:border-blue-500'}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingModal && (
        <MemberEditModal
          type={editingModal.type}
          item={editingModal.item}
          dark={dark}
          onSave={(data) => {
            if (editingModal.type === 'ceo') {
              Object.entries(data).forEach(([key, val]) => updateContent(key as any, val as string));
            } else {
              if (editingModal.item) updateSectionItemAtomic('teamMembers', editingModal.item.id, data);
              else addItemToSection('teamMembers', data);
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
