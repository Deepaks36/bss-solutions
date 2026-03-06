import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent, WhyItem } from '../types';

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
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
  editMode: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
  onUpdateWhyItem: (id: string, field: keyof WhyItem, value: string) => void;
  onAddWhyItem: (item: WhyItem) => void;
  onDeleteWhyItem: (id: string) => void;
}

function WhyCard({
  item,
  index,
  dark,
  editMode,
  onEdit,
  onDelete,
}: {
  item: WhyItem;
  index: number;
  dark: boolean;
  editMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { ref, visible } = useAnimateOnScroll(0.1);

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        } ${dark
          ? 'bg-gray-800/60 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-900/20'
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-100/50'
        }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="h-48 overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      <div className="p-6">
        <h3 className={`font-bold text-lg mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
        <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
      </div>
    </div>
  );
}

export function WhyChooseUs({ content, dark, editMode, onUpdate, onUpdateWhyItem, onAddWhyItem, onDeleteWhyItem }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const [editingItem, setEditingItem] = useState<WhyItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (data: WhyItem) => {
    if (editingItem) {
      onUpdateWhyItem(data.id, 'title', data.title);
      onUpdateWhyItem(data.id, 'description', data.description);
      onUpdateWhyItem(data.id, 'image', data.image);
    } else {
      onAddWhyItem(data);
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  return (
    <section
      id="why"
      className={`py-24 transition-colors duration-300 ${dark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            <EditableText
              value={content.whyTitle}
              onSave={(v) => onUpdate('whyTitle', v)}
              as="span"
              editMode={editMode}
              dark={dark}
            />
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.whyItems.map((item, i) => (
            <WhyCard
              key={item.id}
              item={item}
              index={i}
              dark={dark}
              editMode={editMode}
              onEdit={() => setEditingItem(item)}
              onDelete={() => onDeleteWhyItem(item.id)}
            />
          ))}

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className={`flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group min-h-[300px] ${dark ? 'border-gray-700 hover:bg-blue-900/10' : 'border-gray-200'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                <Plus className="h-8 w-8" />
              </div>
              <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add Why Us Item</span>
            </button>
          )}
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
    </section>
  );
}
