import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { SiteContent, Technology } from '../types';

interface TechnologyEditModalProps {
  tech: Technology | null;
  onSave: (data: Technology) => void;
  onClose: () => void;
  dark: boolean;
}

function TechnologyEditModal({ tech, onSave, onClose, dark }: TechnologyEditModalProps) {
  const [name, setName] = useState(tech?.name ?? '');
  const [image, setImage] = useState(tech?.image ?? '');
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
            {tech ? 'Edit Technology' : 'Add New Technology'}
          </h3>
          <button onClick={onClose} className={`rounded-lg p-1.5 transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Logo / Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm transition-colors ${dark
                  ? 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500 hover:bg-gray-800'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-600 hover:bg-gray-100'
                }`}
            >
              {image ? (
                <img src={image} alt="Preview" className="h-12 w-auto object-contain" />
              ) : (
                <>
                  <ImagePlus className="h-5 w-5" />
                  Click to upload
                </>
              )}
            </button>
          </div>

          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Technology Name"
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
              if (name.trim()) {
                onSave({ id: tech?.id ?? Date.now().toString(), name: name.trim(), image });
              }
            }}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {tech ? 'Update' : 'Add'}
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
  onUpdateTechnology: (id: string, field: keyof Technology, value: string) => void;
  onAddTechnology: (tech: Technology) => void;
  onDeleteTechnology: (id: string) => void;
}

export function About({ content, dark, editMode, onUpdate, onUpdateTechnology, onAddTechnology, onDeleteTechnology }: Props) {
  const { ref: textRef, visible: textVisible } = useAnimateOnScroll(0.1);
  const { ref: imgRef, visible: imgVisible } = useAnimateOnScroll(0.1);
  const { ref: techRef, visible: techVisible } = useAnimateOnScroll(0.1);

  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveTech = (data: Technology) => {
    if (editingTech) {
      onUpdateTechnology(data.id, 'name', data.name);
      onUpdateTechnology(data.id, 'image', data.image);
    } else {
      onAddTechnology(data);
    }
    setEditingTech(null);
    setIsAdding(false);
  };

  return (
    <section
      id="about"
      className={`py-24 ${dark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text */}
          <div
            ref={textRef}
            className={`transition-all duration-700 ${textVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <span className={`inline-block text-sm font-bold uppercase tracking-widest mb-3 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
              World&apos;s exceptional IT-based corporation!
            </span>
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <EditableText
                value={content.aboutTitle}
                onSave={(v) => onUpdate('aboutTitle', v)}
                as="span"
                editMode={editMode}
                dark={dark}
              />
            </h2>
            <div className={`text-lg leading-relaxed mb-8 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              <EditableText
                value={content.aboutBody}
                onSave={(v) => onUpdate('aboutBody', v)}
                as="p"
                multiline
                editMode={editMode}
                dark={dark}
              />
            </div>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-blue-600/30"
            >
              Get Started
            </a>
          </div>

          {/* Image */}
          <div
            ref={imgRef}
            className={`transition-all duration-700 delay-200 ${imgVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/10 blur-xl" />
              <EditableImage
                src="https://keenitsolutions.com/products/wordpress/braintech/wp-content/uploads/2020/12/about.png"
                alt="About BSS"
                onSave={(_v) => {/* Save to state/server */ }}
                editMode={editMode}
                className="relative rounded-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div
          ref={techRef}
          className={`transition-all duration-700 ${techVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className={`text-center text-sm font-bold uppercase tracking-widest mb-8 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
            Technology Index — What We Use For Our Valued Customers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {content.technologies.map((tech, i) => (
              <div
                key={tech.id}
                className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default ${dark ? 'bg-gray-800/60 border-gray-700 hover:border-blue-500' : 'bg-gray-50 border-gray-100 hover:border-blue-200'
                  }`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {editMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingTech(tech)}
                      className="p-1 rounded bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDeleteTechnology(tech.id)}
                      className="p-1 rounded bg-red-600 text-white shadow-lg shadow-red-600/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <img src={tech.image} alt={tech.name} className="w-10 h-10 object-contain mb-1" />
                <span className={`text-xs font-bold text-center ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{tech.name}</span>
              </div>
            ))}

            {editMode && (
              <button
                onClick={() => setIsAdding(true)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group ${dark ? 'border-gray-700 hover:bg-blue-900/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}
              >
                <Plus className="h-6 w-6 text-blue-600" />
                <span className="text-[10px] font-bold">Add Tech</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {(editingTech || isAdding) && (
        <TechnologyEditModal
          tech={editingTech}
          dark={dark}
          onSave={handleSaveTech}
          onClose={() => {
            setEditingTech(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
