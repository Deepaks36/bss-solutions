import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useSite } from '../context/SiteContext';
import { SiteContent, Client } from '../types';
import { EditableText } from './EditableText';

interface Props {
  content: SiteContent;
  dark: boolean;
  onAddClient: (client: Client) => void;
  onUpdateClient: (id: string, field: keyof Client, value: string) => void;
  onDeleteClient: (id: string) => void;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

function ClientEditModal({
  client,
  onSave,
  onClose,
  dark,
}: {
  client: Client | null;
  onSave: (data: { name: string; image: string }) => void;
  onClose: () => void;
  dark: boolean;
}) {
  const [name, setName] = useState(client?.name ?? "");
  const [image, setImage] = useState(client?.image ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${dark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {client ? "Edit Client" : "Add New Client"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image upload */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium">Client Image</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-sm transition-colors ${dark
              ? 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-blue-500/50 hover:bg-gray-800'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-500/50 hover:bg-gray-100'
              }`}
          >
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="h-16 w-auto rounded object-contain"
              />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                Click to upload image
              </>
            )}
          </button>
        </div>

        {/* Name input */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium">Client Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter client name"
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${dark
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name: name.trim(), image });
              }
            }}
            disabled={!name.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {client ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Clients({ content, dark, onAddClient, onUpdateClient, onDeleteClient, onUpdate }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);
  const { editMode } = useSite(); // Use useSite for editMode
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (data: { name: string; image: string }) => {
    if (editingClient) {
      onUpdateClient(editingClient.id, 'name', data.name);
      onUpdateClient(editingClient.id, 'image', data.image);
    } else {
      onAddClient({
        id: `c${Date.now()}`,
        name: data.name,
        image: data.image,
      });
    }
    setEditingClient(null);
    setIsAdding(false);
  };

  return (
    <section id="clients" className={`py-24 transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
            Clients
          </span>
          <EditableText
            value={content.testimonialsTitle}
            onSave={(val) => onUpdate('testimonialsTitle', val)}
            as="h2"
            dark={dark}
            className={`text-3xl font-bold sm:text-4xl ${dark ? 'text-white' : 'text-gray-900'}`}
          />
          <EditableText
            value={content.servicesSubtitle}
            onSave={(val) => onUpdate('servicesSubtitle', val)}
            as="p"
            dark={dark}
            className={`text-lg mt-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
          />
        </div>

        {/* Client Grid */}
        <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {content.clients.map((client, i) => (
            <div
              key={client.id}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${dark
                ? 'bg-gray-900/60 border-gray-800 hover:border-blue-500/50 hover:bg-gray-900 hover:shadow-blue-900/10'
                : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-blue-500/5'
                }`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {/* Admin overlay */}
              {editMode && (
                <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="rounded-full bg-blue-600 p-1.5 text-white shadow-lg transition-colors hover:bg-blue-700"
                    aria-label="Edit client"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDeleteClient(client.id)}
                    className="rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-colors hover:bg-red-600"
                    aria-label="Delete client"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="h-20 w-full flex items-center justify-center">
                {client.image ? (
                  <img
                    src={client.image}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain opacity-70 transition-all group-hover:opacity-100 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className={`flex h-16 w-full items-center justify-center rounded-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <span className={`mt-4 text-center text-xs font-semibold leading-tight transition-colors ${dark ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600 group-hover:text-blue-600'}`}>
                {client.name}
              </span>
            </div>
          ))}

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition-all hover:-translate-y-1 ${dark
                ? 'border-gray-800 bg-gray-900/40 text-gray-500 hover:border-blue-500/50 hover:bg-gray-900 hover:text-blue-500'
                : 'border-gray-200 bg-white text-gray-400 hover:border-blue-500/50 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
              <div className="rounded-full bg-blue-600/10 p-2 group-hover:bg-blue-600/20 transition-colors">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-bold">Add Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editingClient || isAdding) && (
        <ClientEditModal
          client={editingClient}
          dark={dark}
          onSave={handleSave}
          onClose={() => {
            setEditingClient(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
