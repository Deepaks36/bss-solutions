import { useState } from 'react';
import { X, Check, ImagePlus } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
  product: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
  dark: boolean;
}

export function ServiceModal({ product, onSave, onClose, dark }: ServiceModalProps) {
  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [bulletsText, setBulletsText] = useState(product?.bullets?.join(', ') ?? '');
  const [icon, setIcon] = useState(product?.icon ?? '');
  const [image, setImage] = useState(product?.image ?? '');
  const [accent, setAccent] = useState(product?.accent ?? 'from-blue-600 to-cyan-500');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const accents = [
    { name: 'Blue', value: 'from-blue-600 to-cyan-500' },
    { name: 'Indigo', value: 'from-indigo-600 to-violet-500' },
    { name: 'Emerald', value: 'from-emerald-600 to-teal-500' },
    { name: 'Amber', value: 'from-amber-500 to-orange-500' },
    { name: 'Rose', value: 'from-rose-600 to-pink-500' },
    { name: 'Purple', value: 'from-purple-600 to-fuchsia-500' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border p-8 shadow-2xl ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-inherit pb-2 z-10">
          <h3 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
            {product ? 'Edit Product/Service' : 'Add New Item'}
          </h3>
          <button onClick={onClose} className={`rounded-xl p-2 transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Icon</label>
              <input type="file" accept="image/*" id="modal-icon" onChange={(e) => handleFile(e, setIcon)} className="hidden" />
              <button 
                onClick={() => document.getElementById('modal-icon')?.click()} 
                className={`flex w-full h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${dark 
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-slate-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-600 hover:bg-slate-100'}`}
              >
                {icon ? <img src={icon} alt="Icon" className="h-12 w-12 object-contain" /> : <><ImagePlus className="h-6 w-6" /><span>Icon</span></>}
              </button>
            </div>

            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Dashboard/Featured Image</label>
              <input type="file" accept="image/*" id="modal-image" onChange={(e) => handleFile(e, setImage)} className="hidden" />
              <button 
                onClick={() => document.getElementById('modal-image')?.click()} 
                className={`flex w-full h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${dark 
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-slate-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-600 hover:bg-slate-100'}`}
              >
                {image ? <img src={image} alt="Featured" className="h-full w-full object-cover rounded-xl" /> : <><ImagePlus className="h-6 w-6" /><span>Image</span></>}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product/Service Name"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full detailed description..."
                rows={4}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Features (Comma-separated)</label>
              <input
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                placeholder="Feature 1, Feature 2, Feature 3"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-2 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Accent Theme</label>
              <div className="grid grid-cols-6 gap-2">
                {accents.map((acc) => (
                  <button
                    key={acc.value}
                    onClick={() => setAccent(acc.value)}
                    className={`h-8 rounded-lg bg-gradient-to-r ${acc.value} border-2 transition-all ${accent === acc.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    title={acc.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t pt-6 border-slate-100 dark:border-slate-800">
          <button onClick={onClose} className={`rounded-xl px-6 py-3 text-sm font-bold transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave({
                  id: product?.id ?? `s-${Date.now()}`,
                  title: title.trim(),
                  description: description.trim(),
                  bullets: bulletsText.split(',').map((b: string) => b.trim()).filter(Boolean),
                  icon,
                  image,
                  accent
                });
              }
            }}
            disabled={!title.trim()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {product ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
