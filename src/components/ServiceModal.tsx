import { useState } from 'react';
import { X, Check, ImagePlus, Workflow, ArrowRight } from 'lucide-react';
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
  const [accent, setAccent] = useState(product?.accent || 'from-blue-600 to-cyan-500');

  const bullets = bulletsText.split(',').map((b: string) => b.trim()).filter(Boolean);

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

  // Live Card Preview Component (matching Products card style)
  const CardPreview = () => (
    <div className={`w-full max-w-sm rounded-[2rem] border p-6 transition-all shadow-2xl relative overflow-hidden group ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      {/* Decorative gradient background */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${accent}`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`flex h-14 w-14 mb-5 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-lg`}>
          {icon ? (
            <img src={icon} className="h-8 w-8 object-contain" alt="" />
          ) : (
            <Workflow className="h-8 w-8" />
          )}
        </div>
        
        <h3 className={`text-xl font-black mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>{title || 'Product Title'}</h3>
        <p className={`text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {description || 'Product description will appear here...'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5">
            {(bullets.length > 0 ? bullets : ['Feature 1', 'Feature 2']).slice(0, 2).map((b, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {b}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-widest text-blue-600">
            View <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className={`w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[2.5rem] border shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out] ${dark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
        
        {/* Left Side: Preview Area */}
        <div className={`w-full md:w-[40%] relative flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-gradient-to-br ${dark ? 'from-slate-900 to-slate-950' : 'from-slate-50 to-white'} border-r border-slate-100 dark:border-white/5`}>
          <div className="relative z-10 w-full flex flex-col items-center">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-10 ${dark ? 'bg-white/10 text-white/80' : 'bg-slate-900/5 text-slate-600'}`}>
              Card Live Preview
            </span>
            
            <div className="w-full flex justify-center animate-[float_6s_ease-in-out_infinite]">
              <CardPreview />
            </div>

            <div className="mt-12 w-full space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block ml-1 text-center">Visual Assets</label>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => document.getElementById('svc-icon')?.click()} className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    <ImagePlus className="h-4 w-4 text-blue-400" /> Icon
                  </button>
                  <button onClick={() => document.getElementById('svc-img')?.click()} className="flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    <ImagePlus className="h-4 w-4 text-cyan-400" /> Featured
                  </button>
                </div>
              </div>
              <input type="file" id="svc-icon" className="hidden" onChange={(e) => handleFile(e, setIcon)} />
              <input type="file" id="svc-img" className="hidden" onChange={(e) => handleFile(e, setImage)} />
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className={`text-3xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
                {product ? 'Edit Identity' : 'New Creation'}
              </h3>
              <p className={`text-sm font-bold mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Define the core parameters of your solution</p>
            </div>
            <button onClick={onClose} className={`rounded-full p-2.5 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white underline hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Solution Name"
                  className={`w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Color Accent</label>
                <div className="flex h-[54px] items-center gap-2 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  {accents.map((acc) => (
                    <button
                      key={acc.value}
                      onClick={() => setAccent(acc.value)}
                      className={`h-7 w-7 rounded-lg bg-gradient-to-r ${acc.value} border-2 transition-all ${accent === acc.value ? 'border-white scale-110 shadow-lg ring-2 ring-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      title={acc.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quick Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level impact statement..."
                rows={3}
                className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Core Features (Comma separated)</label>
              <input
                value={bulletsText}
                onChange={(e) => setBulletsText(e.target.value)}
                placeholder="Innovation, Scale, Efficiency"
                className={`w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex gap-4">
              <button onClick={onClose} className={`flex-1 rounded-2xl px-8 py-4 text-sm font-black transition-all ${dark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
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
                className="flex-[1.5] flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
                {product ? 'Synchronize Updates' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
