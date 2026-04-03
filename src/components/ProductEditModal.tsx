import { useState } from 'react';
import { X, Check, ImagePlus, Workflow, ArrowRight, Plus } from 'lucide-react';
import { Service } from '../types';
import { uploadImageFile } from '../utils/upload';

interface Props {
  product: Service | null;
  dark: boolean;
  onSave: (data: Service) => void;
  onClose: () => void;
}

const ACCENTS = [
  { name: 'Blue', value: 'from-blue-600 to-cyan-500' },
  { name: 'Indigo', value: 'from-indigo-600 to-violet-500' },
  { name: 'Emerald', value: 'from-emerald-600 to-teal-500' },
  { name: 'Amber', value: 'from-amber-500 to-orange-500' },
  { name: 'Rose', value: 'from-rose-600 to-pink-500' },
  { name: 'Purple', value: 'from-purple-600 to-fuchsia-500' },
];

function handleFileRead(
  e: React.ChangeEvent<HTMLInputElement>,
  cb: (previewUrl: string, file: File) => void
) {
  const file = e.target.files?.[0];
  if (!file) return;
  cb(URL.createObjectURL(file), file);
}

export function ProductEditModal({ product, dark, onSave, onClose }: Props) {
  const initDetails = product?.details
    ? (typeof product.details === 'string' ? JSON.parse(product.details) : product.details)
    : { description: '', keyFeatures: [], useCases: [] };

  const [main, setMain] = useState<Service>({
    id: product?.id ?? `p-${Date.now()}`,
    title: product?.title ?? '',
    description: product?.description ?? '',
    icon: product?.icon ?? '',
    image: product?.image ?? '',
    images: product?.images ?? [],
    accent: product?.accent ?? 'from-blue-600 to-cyan-500',
    bullets: product?.bullets ?? [],
    type: product?.type ?? '',
    details: product?.details ?? '',
    detailsImage: product?.detailsImage ?? '',
  });

  const [bulletsText, setBulletsText] = useState((product?.bullets ?? []).join(', '));
  const [galleryImages, setGalleryImages] = useState<string[]>(product?.images ?? []);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailsImageFile, setDetailsImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>(
    (product?.images ?? []).map(() => null)
  );
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState(initDetails);

  const updateDetail = (key: string, value: any) => setDetails((d: any) => ({ ...d, [key]: value }));

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    let loaded = 0;
    const results: string[] = [];
    files.forEach((file, idx) => {
      results[idx] = URL.createObjectURL(file);
      loaded++;
      if (loaded === files.length) {
        setGalleryImages(prev => [...prev, ...results]);
      }
    });
    setGalleryFiles(prev => [...prev, ...files]);
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
    setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!main.title.trim()) return;
    setSaving(true);
    let iconPath = main.icon;
    let imagePath = main.image;
    let detailsImagePath = main.detailsImage || '';
    let galleryPaths = [...galleryImages];

    try {
      if (iconFile) iconPath = await uploadImageFile(iconFile);
      if (imageFile) imagePath = await uploadImageFile(imageFile);
      if (detailsImageFile) detailsImagePath = await uploadImageFile(detailsImageFile);

      if (galleryFiles.length > 0) {
        galleryPaths = await Promise.all(
          galleryFiles.map((file, index) => {
            if (file) return uploadImageFile(file);
            return Promise.resolve(galleryImages[index]);
          })
        );
      }

    const bullets = bulletsText.split(',').map(b => b.trim()).filter(Boolean);
    onSave({
      ...main,
      icon: iconPath,
      image: imagePath,
      detailsImage: detailsImagePath,
      images: galleryPaths,
      bullets,
      details: JSON.stringify(details),
    });
    } finally {
      setSaving(false);
    }
  };

  // Mini card preview
  const CardPreview = () => (
    <div className={`w-full rounded-2xl border p-4 shadow-xl relative overflow-hidden ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
      <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${main.accent}`} />
      <div className="relative z-10">
        <div className={`h-9 w-9 mb-3 flex items-center justify-center rounded-xl bg-gradient-to-br ${main.accent} text-white shadow`}>
          {main.icon ? <img src={main.icon} className="h-5 w-5 object-contain" alt="" /> : <Workflow className="h-5 w-5" />}
        </div>
        <h3 className={`text-sm font-black mb-1 truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{main.title || 'Product Title'}</h3>
        <p className={`text-[10px] leading-relaxed line-clamp-2 mb-3 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {main.description || 'Description...'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {(bulletsText.split(',').map(b => b.trim()).filter(Boolean).slice(0, 2)).map((b, i) => (
              <span key={i} className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{b}</span>
            ))}
          </div>
          <div className="flex items-center gap-0.5 text-[8px] font-black uppercase text-blue-600">
            View <ArrowRight className="h-2.5 w-2.5" />
          </div>
        </div>
      </div>
    </div>
  );

  const inputCls = `w-full rounded-xl border px-3 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500/40 ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`;
  const labelCls = `block text-[9px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-3 md:p-6 animate-[fadeIn_0.25s_ease-out]">
      <div
        className={`relative w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.25s_ease-out] max-h-[95vh] ${dark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Main Card Editor */}
        <div className={`w-full md:w-1/2 flex flex-col p-6 md:p-8 overflow-y-auto border-r ${dark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-base font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Main Card</h3>
              <p className={`text-[10px] mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Displayed on the products list</p>
            </div>
            <button onClick={onClose} className={`rounded-full p-2 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Live preview */}
          <div className="mb-6">
            <p className={labelCls}>Live Preview</p>
            <CardPreview />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Title</label>
                <input value={main.title} onChange={e => setMain(m => ({ ...m, title: e.target.value }))} placeholder="Product name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Type / Category</label>
                <input value={main.type || ''} onChange={e => setMain(m => ({ ...m, type: e.target.value }))} placeholder="e.g. ERP" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Short Description</label>
              <textarea value={main.description} onChange={e => setMain(m => ({ ...m, description: e.target.value }))} rows={2} placeholder="Brief impact statement..." className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Features (comma separated)</label>
              <input value={bulletsText} onChange={e => setBulletsText(e.target.value)} placeholder="Feature A, Feature B, Feature C" className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Color Accent</label>
              <div className="flex gap-2 flex-wrap">
                {ACCENTS.map(acc => (
                  <button
                    key={acc.value}
                    onClick={() => setMain(m => ({ ...m, accent: acc.value }))}
                    className={`h-7 w-7 rounded-lg bg-gradient-to-r ${acc.value} border-2 transition-all ${main.accent === acc.value ? 'border-white scale-110 ring-2 ring-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    title={acc.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Icon</label>
                <button
                  onClick={() => document.getElementById('edit-icon')?.click()}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold transition-colors ${dark ? 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {main.icon ? <img src={main.icon} className="h-5 w-5 object-contain" alt="" /> : <ImagePlus className="h-4 w-4 text-blue-400" />}
                  {main.icon ? 'Change' : 'Upload Icon'}
                </button>
                <input type="file" id="edit-icon" className="hidden" accept="image/*" onChange={e => handleFileRead(e, (v, file) => { setIconFile(file); setMain(m => ({ ...m, icon: v })); })} />
              </div>
              <div>
                <label className={labelCls}>Hero Image</label>
                <button
                  onClick={() => document.getElementById('edit-img')?.click()}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold transition-colors ${dark ? 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {main.image ? <img src={main.image} className="h-5 w-5 object-cover rounded" alt="" /> : <ImagePlus className="h-4 w-4 text-cyan-400" />}
                  {main.image ? 'Change' : 'Upload Image'}
                </button>
                <input type="file" id="edit-img" className="hidden" accept="image/*" onChange={e => handleFileRead(e, (v, file) => { setImageFile(file); setMain(m => ({ ...m, image: v })); })} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Gallery Images</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/10">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById('edit-gallery-imgs')?.click()}
                  className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center text-[10px] font-bold gap-1 ${dark ? 'border-white/10 text-slate-500 hover:border-blue-500 hover:text-blue-400' : 'border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600'}`}
                >
                  <ImagePlus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <input
                type="file"
                id="edit-gallery-imgs"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleGalleryFiles}
              />
            </div>
          </div>
        </div>

        {/* Right: Detail Card Editor */}
        <div className={`w-full md:w-1/2 flex flex-col p-6 md:p-8 overflow-y-auto`}>
          <div className="mb-6">
            <h3 className={`text-base font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Detail Card</h3>
            <p className={`text-[10px] mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Shown in the product detail modal</p>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <label className={labelCls}>Detailed Description</label>
              <textarea
                value={details.description || ''}
                onChange={e => updateDetail('description', e.target.value)}
                rows={3}
                placeholder="In-depth product narrative..."
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Key Features</label>
                <button onClick={() => updateDetail('keyFeatures', [...(details.keyFeatures || []), ''])} className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {(details.keyFeatures || []).map((f: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={f}
                      onChange={e => {
                        const arr = [...(details.keyFeatures || [])];
                        arr[i] = e.target.value;
                        updateDetail('keyFeatures', arr);
                      }}
                      placeholder="Feature..."
                      className={inputCls}
                    />
                    <button onClick={() => updateDetail('keyFeatures', (details.keyFeatures || []).filter((_: string, j: number) => j !== i))} className="text-red-400 hover:text-red-300 px-1">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {!(details.keyFeatures?.length) && (
                  <button onClick={() => updateDetail('keyFeatures', [''])} className={`w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-[10px] font-bold transition-colors ${dark ? 'border-white/10 text-slate-500 hover:border-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-400'}`}>
                    <Plus className="h-3.5 w-3.5" /> Add Key Features
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelCls}>Use Cases</label>
                <button onClick={() => updateDetail('useCases', [...(details.useCases || []), ''])} className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-widest">
                  + Add
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(details.useCases || []).map((u: string, i: number) => (
                  <div key={i} className="flex gap-1.5">
                    <input
                      value={u}
                      onChange={e => {
                        const arr = [...(details.useCases || [])];
                        arr[i] = e.target.value;
                        updateDetail('useCases', arr);
                      }}
                      placeholder="e.g. Logistics"
                      className={inputCls}
                    />
                    <button onClick={() => updateDetail('useCases', (details.useCases || []).filter((_: string, j: number) => j !== i))} className="text-red-400 hover:text-red-300 px-0.5">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {!(details.useCases?.length) && (
                  <button onClick={() => updateDetail('useCases', [''])} className={`col-span-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-[10px] font-bold transition-colors ${dark ? 'border-white/10 text-slate-500 hover:border-indigo-500' : 'border-slate-200 text-slate-400 hover:border-indigo-400'}`}>
                    <Plus className="h-3.5 w-3.5" /> Add Use Cases
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Details Image</label>
              <button
                onClick={() => document.getElementById('edit-details-img')?.click()}
                className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold transition-colors ${dark ? 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {main.detailsImage ? <img src={main.detailsImage} className="h-5 w-5 object-cover rounded" alt="" /> : <ImagePlus className="h-4 w-4 text-indigo-400" />}
                {main.detailsImage ? 'Change Details Image' : 'Upload Details Image'}
              </button>
              <input type="file" id="edit-details-img" className="hidden" accept="image/*" onChange={e => handleFileRead(e, (v, file) => { setDetailsImageFile(file); setMain(m => ({ ...m, detailsImage: v })); })} />
            </div>
          </div>

          {/* Actions */}
          <div className={`flex gap-3 pt-5 mt-5 border-t ${dark ? 'border-white/5' : 'border-slate-100'}`}>
            <button
              onClick={onClose}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-black transition-all ${dark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!main.title.trim() || saving}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-black text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-[1.02] disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
