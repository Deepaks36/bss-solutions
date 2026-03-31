import { useState, useRef } from 'react';
import { X, Check, ImagePlus, Workflow, ArrowRight, Pipette } from 'lucide-react';
import { Service } from '../types';

interface ServiceModalProps {
  product: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
  dark: boolean;
}

const PRESETS = [
  { name: 'Blue',    value: 'from-blue-600 to-cyan-500',      from: '#2563eb', to: '#06b6d4' },
  { name: 'Indigo',  value: 'from-indigo-600 to-violet-500',  from: '#4f46e5', to: '#8b5cf6' },
  { name: 'Emerald', value: 'from-emerald-600 to-teal-500',   from: '#059669', to: '#14b8a6' },
  { name: 'Amber',   value: 'from-amber-500 to-orange-500',   from: '#f59e0b', to: '#f97316' },
  { name: 'Rose',    value: 'from-rose-600 to-pink-500',      from: '#e11d48', to: '#ec4899' },
  { name: 'Purple',  value: 'from-purple-600 to-fuchsia-500', from: '#9333ea', to: '#d946ef' },
];

// Convert two hex colors into an inline gradient style (used when accent is a custom hex pair)
function gradientStyle(accent: string): React.CSSProperties {
  // If it's a Tailwind class string, return empty (handled by className)
  if (accent.startsWith('from-')) return {};
  // Custom format: "hex1|hex2"
  const [from, to] = accent.split('|');
  if (from && to) return { background: `linear-gradient(to right, ${from}, ${to})` };
  return {};
}

function isTailwind(accent: string) {
  return accent.startsWith('from-');
}

export function ServiceModal({ product, onSave, onClose, dark }: ServiceModalProps) {
  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [bulletsText, setBulletsText] = useState(product?.bullets?.join(', ') ?? '');
  const [icon, setIcon] = useState(product?.icon ?? '');
  const [image, setImage] = useState(product?.image ?? '');
  const [accent, setAccent] = useState(product?.accent || 'from-blue-600 to-cyan-500');

  // Custom color state — initialise from existing custom accent if present
  const initFrom = !isTailwind(accent) ? accent.split('|')[0] ?? '#2563eb' : '#2563eb';
  const initTo   = !isTailwind(accent) ? accent.split('|')[1] ?? '#06b6d4' : '#06b6d4';
  const [customFrom, setCustomFrom] = useState(initFrom);
  const [customTo, setCustomTo]     = useState(initTo);
  const [useCustom, setUseCustom]   = useState(!isTailwind(accent));

  const fromRef = useRef<HTMLInputElement>(null);
  const toRef   = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const applyCustom = (from: string, to: string) => {
    setCustomFrom(from);
    setCustomTo(to);
    setUseCustom(true);
    setAccent(`${from}|${to}`);
  };

  const selectPreset = (value: string) => {
    setUseCustom(false);
    setAccent(value);
  };

  // Resolved gradient for preview
  const previewGradientClass = isTailwind(accent) ? `bg-gradient-to-r ${accent}` : '';
  const previewGradientStyle = isTailwind(accent) ? {} : gradientStyle(accent);

  const CardPreview = () => (
    <div className={`w-full max-w-sm rounded-[2rem] border p-6 shadow-2xl relative overflow-hidden ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${previewGradientClass}`} style={previewGradientStyle} />
      <div className="relative z-10 flex flex-col h-full">
        <div className={`flex h-14 w-14 mb-5 items-center justify-center rounded-2xl text-white shadow-lg ${previewGradientClass}`} style={previewGradientStyle}>
          {icon ? <img src={icon} className="h-8 w-8 object-contain" alt="" /> : <Workflow className="h-8 w-8" />}
        </div>
        <h3 className={`text-xl font-black mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>{title || 'Service Title'}</h3>
        <p className={`text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {description || 'Service description will appear here...'}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5">
            {(bulletsText.split(',').map(b => b.trim()).filter(Boolean).slice(0, 2).length > 0
              ? bulletsText.split(',').map(b => b.trim()).filter(Boolean).slice(0, 2)
              : ['Feature 1', 'Feature 2']
            ).map((b, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{b}</span>
            ))}
          </div>
          <div className="flex items-center gap-1 font-black text-[9px] uppercase tracking-widest text-blue-600">
            View <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );

  const inputCls = `w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelCls = 'text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className={`w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[2.5rem] border shadow-2xl flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out] ${dark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>

        {/* Left: Live Preview */}
        <div className={`w-full md:w-[40%] flex flex-col items-center justify-center p-8 md:p-12 overflow-y-auto bg-gradient-to-br ${dark ? 'from-slate-900 to-slate-950' : 'from-slate-50 to-white'} border-r ${dark ? 'border-white/5' : 'border-slate-100'}`}>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest mb-8 ${dark ? 'bg-white/10 text-white/80' : 'bg-slate-900/5 text-slate-600'}`}>
            Card Live Preview
          </span>
          <div className="w-full flex justify-center animate-[float_6s_ease-in-out_infinite]">
            <CardPreview />
          </div>
          <div className="mt-10 w-full space-y-4">
            <p className={`${labelCls} block text-center`}>Visual Assets</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => document.getElementById('svc-icon')?.click()} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-colors ${dark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                <ImagePlus className="h-4 w-4 text-blue-400" /> Icon
              </button>
              <button onClick={() => document.getElementById('svc-img')?.click()} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-colors ${dark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                <ImagePlus className="h-4 w-4 text-cyan-400" /> Image
              </button>
            </div>
            <input type="file" id="svc-icon" className="hidden" accept="image/*" onChange={(e) => handleFile(e, setIcon)} />
            <input type="file" id="svc-img"  className="hidden" accept="image/*" onChange={(e) => handleFile(e, setImage)} />
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
                {product ? 'Edit Service' : 'New Service'}
              </h3>
              <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Fill in the details below</p>
            </div>
            <button onClick={onClose} className={`rounded-full p-2.5 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className={labelCls}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Service Name" className={inputCls} />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className={labelCls}>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="High-level impact statement..." rows={3} className={inputCls} />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <label className={labelCls}>Core Features (comma separated)</label>
              <input value={bulletsText} onChange={e => setBulletsText(e.target.value)} placeholder="Innovation, Scale, Efficiency" className={inputCls} />
            </div>

            {/* Color Accent */}
            <div className="space-y-3">
              <label className={labelCls}>Color Accent</label>

              {/* Preset swatches */}
              <div className={`flex flex-wrap gap-2 p-3 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                {PRESETS.map((p) => {
                  const isSelected = !useCustom && accent === p.value;
                  return (
                    <button
                      key={p.value}
                      onClick={() => selectPreset(p.value)}
                      title={p.name}
                      className={`h-8 w-8 rounded-lg bg-gradient-to-r ${p.value} border-2 transition-all ${isSelected ? 'border-white scale-110 shadow-lg ring-2 ring-blue-500' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                    />
                  );
                })}

                {/* Custom color trigger */}
                <button
                  onClick={() => { fromRef.current?.click(); }}
                  title="Custom color"
                  className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-all ${useCustom ? 'border-white scale-110 ring-2 ring-blue-500' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                  style={{ background: `linear-gradient(to right, ${customFrom}, ${customTo})` }}
                >
                  <Pipette className="h-3.5 w-3.5 text-white drop-shadow" />
                </button>
              </div>

              {/* Custom color inputs — shown when custom is active or user wants to tweak */}
              <div className={`grid grid-cols-2 gap-3 p-3 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-lg border-2 border-white/20 cursor-pointer overflow-hidden" style={{ background: customFrom }} onClick={() => fromRef.current?.click()} />
                    <input ref={fromRef} type="color" value={customFrom} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={e => applyCustom(e.target.value, customTo)} />
                  </div>
                  <span className={`text-xs font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>From</span>
                  <span className={`text-xs font-mono ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{customFrom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-lg border-2 border-white/20 cursor-pointer overflow-hidden" style={{ background: customTo }} onClick={() => toRef.current?.click()} />
                    <input ref={toRef} type="color" value={customTo} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={e => applyCustom(customFrom, e.target.value)} />
                  </div>
                  <span className={`text-xs font-bold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>To</span>
                  <span className={`text-xs font-mono ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{customTo}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`pt-6 border-t ${dark ? 'border-white/5' : 'border-slate-100'} flex gap-4`}>
              <button onClick={onClose} className={`flex-1 rounded-2xl px-8 py-4 text-sm font-black transition-all ${dark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!title.trim()) return;
                  onSave({
                    id: product?.id ?? `s-${Date.now()}`,
                    title: title.trim(),
                    description: description.trim(),
                    bullets: bulletsText.split(',').map(b => b.trim()).filter(Boolean),
                    icon,
                    image,
                    accent,
                  });
                }}
                disabled={!title.trim()}
                className="flex-[1.5] flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <Check className="h-5 w-5" />
                {product ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
