import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus, TrendingUp, Users } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { SiteContent, WhyItem, TimelineItem } from '../types';
import { uploadImageFile } from '../utils/upload';

interface WhyItemEditModalProps {
  item: WhyItem | null;
  onSave: (data: WhyItem) => void;
  onClose: () => void;
  dark: boolean;
}

function WhyItemEditModal({ item, onSave, onClose, dark }: WhyItemEditModalProps) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [image, setImage] = useState(item?.image ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadImageFile(file);
      setImage(path);
    } catch (_e) {
      // Ignore and keep existing image.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`mx-4 w-full max-w-md rounded-2xl border p-6 shadow-2xl ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {item ? 'Edit Why Item' : 'Add Why Item'}
          </h3>
          <button onClick={onClose} className={`rounded-lg p-1.5 transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm transition-colors ${dark
                ? 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500 hover:bg-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-600 hover:bg-gray-100'
                }`}
            >
              {image ? (
                <img src={image} alt="Preview" className="h-24 w-full object-cover rounded-lg" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  Click to upload
                </>
              )}
            </button>
          </div>

          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item Title"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Item Description"
              rows={4}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave({ id: item?.id ?? Date.now().toString(), title: title.trim(), description, image });
              }
            }}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {item ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
  onUpdateWhyItemAtomic: (id: string, updates: Partial<WhyItem>) => void;
  onAddWhyItem: (item: WhyItem) => void;
  onDeleteWhyItem: (id: string) => void;
  onUpdateTimelineItemAtomic?: (id: string, updates: Partial<TimelineItem>) => void;
  onAddTimelineItem?: (item: TimelineItem) => void;
  onDeleteTimelineItem?: (id: string) => void;
}

function TimelineItemCard({
  item,
  dark,
  editMode,
  onEdit,
  onDelete
}: {
  item: TimelineItem,
  dark: boolean,
  editMode: boolean,
  onEdit: () => void,
  onDelete: () => void
}) {
  const { ref, visible } = useAnimateOnScroll(0.1);

  return (
    <div
      ref={ref}
      className={`relative pl-8 pb-12 last:pb-0 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
    >
      {/* Line */}
      <div className={`absolute left-[11px] top-2 bottom-0 w-0.5 ${dark ? 'bg-gray-800' : 'bg-gray-100'} group-last:hidden`} />

      {/* Dot */}
      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 flex items-center justify-center transition-transform hover:scale-125 z-10 ${dark ? 'bg-gray-950 border-blue-600' : 'bg-white border-blue-600'}`}>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
      </div>

      <div className={`p-6 rounded-2xl border transition-all hover:shadow-xl ${dark ? 'bg-gray-900/50 border-gray-800 hover:border-blue-500/30' : 'bg-white border-gray-100 hover:border-blue-200 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-blue-600 tracking-tighter">{item.year}</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${dark ? 'bg-blue-600/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              Growth: {item.growth}
            </div>
          </div>
          {editMode && (
            <div className="flex gap-2">
              <button onClick={onEdit} className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={onDelete} className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>

        <p className={`mb-6 text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>

        <div className="flex flex-wrap gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${dark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold whitespace-nowrap">
              <span className={dark ? 'text-white' : 'text-gray-900'}>{item.clients}+</span>
              <span className={`ml-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Clients</span>
            </span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${dark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold whitespace-nowrap">
              <span className={dark ? 'text-white' : 'text-gray-900'}>{item.growth}</span>
              <span className={`ml-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Expansion</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItemEditModal({
  item,
  dark,
  onSave,
  onClose
}: {
  item: TimelineItem | null,
  dark: boolean,
  onSave: (data: TimelineItem) => void,
  onClose: () => void
}) {
  const [year, setYear] = useState(item?.year ?? '');
  const [clients, setClients] = useState(item?.clients ?? 0);
  const [growth, setGrowth] = useState(item?.growth ?? '');
  const [description, setDescription] = useState(item?.description ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`mx-4 w-full max-w-md rounded-2xl border p-6 shadow-2xl ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {item ? 'Edit Progress' : 'Add Milestone'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-50">Year</label>
              <input
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className={`w-full p-2.5 rounded-xl border text-sm ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50'}`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-50">Clients Acquired</label>
              <input
                type="number"
                value={clients}
                onChange={e => setClients(parseInt(e.target.value) || 0)}
                className={`w-full p-2.5 rounded-xl border text-sm ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-50">Growth Rate / Milestone</label>
            <input
              value={growth}
              onChange={e => setGrowth(e.target.value)}
              placeholder="e.g. 2x Growth"
              className={`w-full p-2.5 rounded-xl border text-sm ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-50">Brief Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className={`w-full p-2.5 rounded-xl border text-sm ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50'}`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500">Cancel</button>
          <button
            onClick={() => onSave({ id: item?.id ?? Date.now().toString(), year, clients, growth, description })}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            {item ? 'Update' : 'Add Milestone'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WhyCard({
  item,
  index,
  dark,
  onEdit,
  onDelete,
}: {
  item: WhyItem;
  index: number;
  dark: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();

  return (
    <div
      ref={ref}
      className={`group relative rounded-[2rem] overflow-hidden border transition-all duration-700 hover:shadow-2xl lg:sticky flex flex-col
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} 
        ${dark
          ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700 hover:border-blue-500/50 shadow-black/50'
          : 'bg-white/95 backdrop-blur-xl border-gray-100 hover:border-blue-200 shadow-gray-200/50'
        }`}
      style={{
        top: `calc(10vh + ${index * 1.5}rem)`,
        transitionDelay: `${index * 50}ms`,
        boxShadow: dark ? '0 -10px 40px -15px rgba(0,0,0,0.5)' : '0 -10px 40px -15px rgba(0,0,0,0.05)'
      }}
    >
      <div className="flex flex-col sm:flex-row h-full">
        <div className={`sm:w-1/3 h-40 sm:h-auto sm:min-h-[180px] overflow-hidden relative shrink-0 flex items-center justify-center p-6 ${dark ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
          />
          {editMode && (
            <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-110"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-110"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-center w-full">
          <h3 className={`font-bold text-xl sm:text-2xl mb-3 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
          <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export function WhyChooseUs({
  content,
  dark,
  onUpdate,
  onUpdateWhyItemAtomic,
  onAddWhyItem,
  onDeleteWhyItem,
  onUpdateTimelineItemAtomic,
  onAddTimelineItem,
  onDeleteTimelineItem
}: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode, updateSectionItemAtomic, addItemToSection, deleteItemFromSection } = useSite();
  const [editingItem, setEditingItem] = useState<WhyItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);

  const handleSave = (data: WhyItem) => {
    if (editingItem) {
      const updates: Partial<WhyItem> = {};
      if (data.title !== editingItem.title) updates.title = data.title;
      if (data.description !== editingItem.description) updates.description = data.description;
      if (data.image !== editingItem.image) updates.image = data.image;

      if (Object.keys(updates).length > 0) {
        onUpdateWhyItemAtomic(data.id, updates);
      }
    } else {
      onAddWhyItem(data);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  return (
    <section
      id="why"
      className={`py-24 transition-colors duration-300 relative ${dark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          <div
            ref={ref}
            className={`lg:w-1/3 lg:sticky lg:top-32 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-8 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
              <EditableText
                value={content.whyTitle}
                onSave={(v) => onUpdate('whyTitle', v)}
                as="span"
                dark={dark}
              />
            </h2>
            <div className={`w-20 h-2 rounded-full mb-8 bg-blue-600`}></div>
            <p className={`text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover the core advantages that set us apart. We combine innovation, expertise, and dedication to deliver exceptional results.
            </p>
          </div>

          <div className="lg:w-2/3 flex flex-col gap-12 lg:pb-[20vh]">
            {content.whyItems.map((item, i) => (
              <WhyCard
                key={item.id}
                item={item}
                index={i}
                dark={dark}
                onEdit={() => setEditingItem(item)}
                onDelete={() => onDeleteWhyItem(item.id)}
              />
            ))}

            {editMode && (
              <button
                onClick={() => setIsAdding(true)}
                className={`flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group min-h-[300px] sticky ${dark ? 'bg-gray-800/80 border-gray-700 hover:bg-blue-900/10 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}
                style={{ top: `calc(10vh + ${content.whyItems.length * 1.5}rem)` }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                  <Plus className="h-8 w-8" />
                </div>
                <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add Why Us Item</span>
              </button>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-32 pt-24 border-t border-gray-800/10">
          <div className="text-center mb-16">
            <h3 className={`text-3xl sm:text-4xl font-black mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Our Growth Journey</h3>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              From humble beginnings to a global technology partner, our journey is defined by innovation and client success.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {content.timelineItems?.map((item) => (
                <TimelineItemCard
                  key={item.id}
                  item={item}
                  dark={dark}
                  editMode={editMode}
                  onEdit={() => setEditingTimeline(item)}
                  onDelete={() => {
                    if (onDeleteTimelineItem) onDeleteTimelineItem(item.id);
                    else deleteItemFromSection('timelineItems', item.id);
                  }}
                />
              ))}

              {editMode && (
                <button
                  onClick={() => setIsAddingTimeline(true)}
                  className={`mt-8 flex items-center justify-center gap-3 w-full p-8 rounded-2xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group ${dark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}
                >
                  <Plus className="w-6 h-6 text-blue-600" />
                  <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-800'}`}>Add Growth Milestone</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {(editingItem || isAdding) && (
        <WhyItemEditModal
          item={editingItem}
          dark={dark}
          onSave={handleSave}
          onClose={() => {
            setEditingItem(null);
            setIsAdding(false);
          }}
        />
      )}

      {(editingTimeline || isAddingTimeline) && (
        <TimelineItemEditModal
          item={editingTimeline}
          dark={dark}
          onSave={(data) => {
            if (editingTimeline) {
              if (onUpdateTimelineItemAtomic) onUpdateTimelineItemAtomic(editingTimeline.id, data);
              else updateSectionItemAtomic('timelineItems', editingTimeline.id, data);
            } else {
              if (onAddTimelineItem) onAddTimelineItem(data);
              else addItemToSection('timelineItems', data);
            }
            setEditingTimeline(null);
            setIsAddingTimeline(false);
          }}
          onClose={() => {
            setEditingTimeline(null);
            setIsAddingTimeline(false);
          }}
        />
      )}
    </section>
  );
}
