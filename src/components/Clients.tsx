import { useState, useRef } from 'react';
import { Pencil, Plus, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Client } from '../types';
import { useSite } from '../context/SiteContext';

interface Props {
  content: SiteContent;
  dark: boolean;
  onAddClient: (client: Client) => void;
  onUpdateClientAtomic: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

interface ClientEditModalProps {
  client: Client | null;
  onSave: (data: Client) => void;
  onClose: () => void;
  dark: boolean;
}

function ClientEditModal({ client, onSave, onClose, dark }: ClientEditModalProps) {
  const [name, setName] = useState(client?.name ?? '');
  const [image, setImage] = useState(client?.image ?? '');
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    // For existing clients, only send what changed
    if (client) {
      const updates: Partial<Client> = {};
      if (name.trim() !== client.name) updates.name = name.trim();
      if (image !== client.image) updates.image = image;
      
      if (Object.keys(updates).length > 0) {
        onSave({ ...client, ...updates });
      } else {
        onClose();
      }
    } else {
      // New client - send full object
      onSave({
        id: `client-${Date.now()}`,
        name: name.trim(),
        image,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
            {client ? 'Edit Client' : 'Add New Client'}
          </h3>
          <button onClick={onClose} className={`rounded-xl p-2 transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Client Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company Name"
              autoFocus
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
            />
          </div>

          <div>
            <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Logo Image</label>
            <input ref={imageRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <button
              onClick={() => imageRef.current?.click()}
              className={`flex w-full h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${dark
                ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-slate-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-600 hover:bg-slate-100'
                }`}
            >
              {image ? <img src={image} alt="Logo preview" className="h-16 w-full object-contain p-2" /> : <><ImagePlus className="h-6 w-6" /><span>Upload Logo</span></>}
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t pt-6 border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {client ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Clients({ content, dark, onAddClient, onUpdateClientAtomic, onDeleteClient }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);
  const { editMode } = useSite();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <section id="companies" className={`relative py-24 transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-16 text-center transition-all duration-700 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <span className="mb-3 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Associated Companies
          </span>
          <h2 className={`text-3xl font-black sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Trusted by leading brands and enterprise teams.
          </h2>
          <p className={`mt-3 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            A clean proof section keeps the home page professional while showing who the company works with.
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 transition-all duration-700 ${visible || editMode ? 'opacity-100' : 'translate-y-4 opacity-0'}`}>
          {content.clients.map((client, i) => (
            <div
              key={client.id}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${dark
                ? 'border-slate-800 bg-slate-900/60 hover:border-blue-500/50 hover:bg-slate-900'
                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-blue-500/5'
                }`}
              style={{ transitionDelay: editMode ? '0ms' : `${i * 30}ms` }}
            >
              {editMode && (
                <div className="absolute -top-3 -right-3 z-10 hidden items-center gap-1 group-hover:flex">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
                    title="Edit client"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110"
                    title="Delete client"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="flex h-20 w-full items-center justify-center">
                {client.image ? (
                  <img
                    src={client.image}
                    alt={client.name}
                    className={`max-h-16 max-w-full object-contain transition-all ${editMode ? 'opacity-100 scale-105' : 'opacity-75 group-hover:scale-105 group-hover:opacity-100'}`}
                    loading="lazy"
                  />
                ) : (
                  <div className={`flex h-16 w-full items-center justify-center rounded-lg ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <span className="text-xs text-slate-400">No image</span>
                  </div>
                )}
              </div>
              <span className={`mt-4 text-center text-xs font-semibold leading-tight transition-colors ${dark ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'}`}>
                {client.name}
              </span>
            </div>
          ))}

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all hover:bg-blue-50/50 hover:border-blue-500 group ${dark ? 'border-gray-700 hover:bg-blue-900/10' : 'border-gray-200'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${dark ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                <Plus className="h-6 w-6" />
              </div>
              <span className={`text-xs font-bold leading-tight ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Add New Client</span>
            </button>
          )}
        </div>
      </div>

      {(editingClient || isAdding) && (
        <ClientEditModal
          client={editingClient}
          dark={dark}
          onSave={(data) => {
            if (editingClient) {
              const updates: Partial<Client> = {};
              if (data.name !== editingClient.name) updates.name = data.name;
              if (data.image !== editingClient.image) updates.image = data.image;
              onUpdateClientAtomic(data.id, updates);
            } else {
              onAddClient(data);
            }
            setEditingClient(null);
            setIsAdding(false);
          }}
          onClose={() => {
            setEditingClient(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
