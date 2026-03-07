import { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { SiteContent, Service } from '../types';

interface ServiceEditModalProps {
  service: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
  dark: boolean;
}

function ServiceEditModal({ service, onSave, onClose, dark }: ServiceEditModalProps) {
  const [title, setTitle] = useState(service?.title ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [icon, setIcon] = useState(service?.icon ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setIcon(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`mx-4 w-full max-w-md rounded-2xl border p-6 shadow-2xl ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button onClick={onClose} className={`rounded-lg p-1.5 transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Icon / Image</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm transition-colors ${dark
                ? 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-blue-500 hover:bg-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-blue-600 hover:bg-gray-100'
                }`}
            >
              {icon ? (
                <img src={icon} alt="Preview" className="h-12 w-auto object-contain" />
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
              placeholder="Service Title"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Service Description"
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
                onSave({ id: service?.id ?? Date.now().toString(), title: title.trim(), description, icon });
              }
            }}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {service ? 'Update Service' : 'Add Service'}
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
  onUpdateService: (id: string, field: keyof Service, value: string) => void;
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

function ServiceCard({
  service,
  dark,
  onEdit,
  onDelete,
  delay,
}: {
  service: Service;
  dark: boolean;
  onEdit: () => void;
  onDelete: () => void;
  delay: number;
}) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        } ${dark
          ? 'bg-gray-900/60 border-gray-700/60 hover:border-blue-500/50 hover:shadow-blue-900/20'
          : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-100/50'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {editMode && (
        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className={`p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className={`p-2 rounded-lg bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${dark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
        <img src={service.icon} alt={service.title} className="w-10 h-10 object-contain" />
      </div>

      <h3 className={`text-xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
      <p className={`text-sm leading-relaxed mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>

      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    </div>
  );
}

export function Services({ content, dark, onUpdate, onUpdateService, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (data: Service) => {
    if (editingService) {
      onUpdateService(data.id, 'title', data.title);
      onUpdateService(data.id, 'description', data.description);
      onUpdateService(data.id, 'icon', data.icon);
    } else {
      onAddService(data);
    }
    setEditingService(null);
    setIsAdding(false);
  };

  return (
    <section
      id="services"
      className={`py-24 transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className={`inline-block text-sm font-bold uppercase tracking-widest mb-3 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
            <EditableText
              value={content.servicesTagline}
              onSave={(v) => onUpdate('servicesTagline', v)}
              as="span"
              dark={dark}
            />
          </span>
          <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <EditableText
              value={content.servicesTitle}
              onSave={(v) => onUpdate('servicesTitle', v)}
              as="span"
              dark={dark}
            />
          </h2>
          <div className="max-w-2xl mx-auto">
            <EditableText
              value={content.servicesSubtitle}
              onSave={(v) => onUpdate('servicesSubtitle', v)}
              as="p"
              multiline
              dark={dark}
              className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              dark={dark}
              onEdit={() => setEditingService(service)}
              onDelete={() => onDeleteService(service.id)}
              delay={i * 60}
            />
          ))}

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className={`flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group min-h-[250px] ${dark ? 'border-gray-700 hover:bg-blue-900/10' : 'border-gray-200'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                <Plus className="h-8 w-8" />
              </div>
              <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add New Service</span>
            </button>
          )}
        </div>
      </div>

      {(editingService || isAdding) && (
        <ServiceEditModal
          service={editingService}
          dark={dark}
          onSave={handleSave}
          onClose={() => {
            setEditingService(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
