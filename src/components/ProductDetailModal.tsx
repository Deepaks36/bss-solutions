import { useState } from 'react';
import { X, Pencil, ImagePlus, Workflow, Save, ArrowRight } from 'lucide-react';
import { Service } from '../types';

interface ProductDetailModalProps {
  product: Service;
  dark: boolean;
  onClose: () => void;
  onEditStart?: () => void;
  isEditing?: boolean;
  isEditMode?: boolean;
  onSaveEdit?: (data: Service) => void;
}

export function ProductDetailModal({ 
  product, 
  dark, 
  onClose, 
  onEditStart,
  isEditing = false,
  isEditMode = false,
  onSaveEdit
}: ProductDetailModalProps) {
  const [editData, setEditData] = useState<Service>(product);
  const [editingDetails, isEditingDetails] = useState(isEditing);

  const details = editData.details ? (typeof editData.details === 'string' ? JSON.parse(editData.details) : editData.details) : null;

  const handleDetailChange = (key: string, value: any) => {
    setEditData({
      ...editData,
      details: JSON.stringify({
        ...details,
        [key]: value
      })
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const features = (details?.keyFeatures || []).map((f: string, i: number) => i === index ? value : f);
    handleDetailChange('keyFeatures', features);
  };

  const addFeature = () => {
    const features = [...(details?.keyFeatures || []), ''];
    handleDetailChange('keyFeatures', features);
  };

  const removeFeature = (index: number) => {
    const features = (details?.keyFeatures || []).filter((_: string, i: number) => i !== index);
    handleDetailChange('keyFeatures', features);
  };

  const handleUseCaseChange = (index: number, value: string) => {
    const useCases = (details?.useCases || []).map((u: string, i: number) => i === index ? value : u);
    handleDetailChange('useCases', useCases);
  };

  const addUseCase = () => {
    const useCases = [...(details?.useCases || []), ''];
    handleDetailChange('useCases', useCases);
  };

  const removeUseCase = (index: number) => {
    const useCases = (details?.useCases || []).filter((_: string, i: number) => i !== index);
    handleDetailChange('useCases', useCases);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Live Card Preview Component
  const CardPreview = () => (
    <div className={`w-full max-w-sm rounded-[2rem] border p-6 transition-all shadow-2xl relative overflow-hidden group ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      {/* Decorative gradient background */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${editData.accent || 'from-blue-600 to-cyan-500'}`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`flex h-14 w-14 mb-5 items-center justify-center rounded-2xl bg-gradient-to-br ${editData.accent || 'from-blue-600 to-cyan-500'} text-white shadow-lg`}>
          {editData.icon ? (
            <img src={editData.icon} className="h-8 w-8 object-contain" alt="" />
          ) : (
            <Workflow className="h-8 w-8" />
          )}
        </div>
        
        <h3 className={`text-xl font-black mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>{editData.title || 'Product Title'}</h3>
        <p className={`text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          {editData.description || 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5">
            {(editData.bullets || ['Feature A', 'Feature B']).slice(0, 2).map((b, i) => (
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-2 md:p-6 animate-[fadeIn_0.3s_ease-out]" onClick={onClose}>
      <div
        className={`relative w-full max-w-7xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out] max-h-[98vh] md:max-h-[92vh] ${dark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-5 right-5 z-[101] rounded-full p-2.5 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white underline hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}>
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Dynamic Preview Area */}
        <div className={`w-full md:w-[42%] relative flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden bg-gradient-to-br ${dark ? 'from-slate-900 to-slate-950' : 'from-slate-50 to-white'} border-r ${dark ? 'border-white/5' : 'border-slate-100'}`}>
          {/* Animated Background Element */}
          <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-br ${editData.accent || 'from-blue-600 to-cyan-500'} blur-3xl`} />
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-8 ${dark ? 'bg-white/10 text-white/80' : 'bg-slate-900/5 text-slate-600'}`}>
              {editingDetails ? 'Live Card Preview' : 'Product Visual'}
            </span>
            
            <div className="w-full flex justify-center perspective-1000">
               {editingDetails ? (
                 <div className="animate-[float_6s_ease-in-out_infinite] scale-105">
                    <CardPreview />
                 </div>
               ) : (
                 <div className="w-full relative group">
                    {editData.image ? (
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                        <img src={editData.image} alt={editData.title} className="w-full aspect-[4/3] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      </div>
                    ) : (
                      <div className={`w-full aspect-[4/3] rounded-3xl flex items-center justify-center bg-gradient-to-br ${editData.accent || 'from-blue-600 to-cyan-500'} shadow-2xl`}>
                        <Workflow className="h-24 w-24 text-white p-4" />
                      </div>
                    )}
                 </div>
               )}
            </div>

            {!editingDetails && editData.detailsImage && (
              <div className="mt-8 w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">Inside the solution</p>
                <img src={editData.detailsImage} className="w-full h-32 object-cover rounded-2xl border border-white/10 shadow-lg " alt="Details" />
              </div>
            )}
            
            {editingDetails && (
              <div className="mt-12 space-y-4 w-full max-w-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Visual Assets</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => document.getElementById('det-icon')?.click()} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    <ImagePlus className="h-4 w-4 text-blue-400" /> Icon
                  </button>
                  <button onClick={() => document.getElementById('det-img')?.click()} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                    <ImagePlus className="h-4 w-4 text-cyan-400" /> Hero
                  </button>
                  <input type="file" id="det-icon" className="hidden" onChange={(e) => handleFile(e, (v) => setEditData({...editData, icon: v}))} />
                  <input type="file" id="det-img" className="hidden" onChange={(e) => handleFile(e, (v) => setEditData({...editData, image: v}))} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Google-Style Content Area */}
        <div className={`w-full md:w-[58%] flex flex-col p-8 md:p-14 overflow-y-auto ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {!editingDetails ? (
            <div className="space-y-10 animate-[fadeInUp_0.5s_ease-out]">
              <header>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${editData.accent || 'from-blue-600 to-cyan-500'}`}>
                    {editData.type || 'Flagship Product'}
                  </span>
                  <div className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-slate-100'}`} />
                </div>
                <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {editData.title}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800" />)}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Trusted by 500+ Clients</span>
                  </div>
                </div>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${dark ? 'text-blue-400' : 'text-blue-600'}`}>Overview</h3>
                  <p className="text-base leading-relaxed font-medium">
                    {editData.description}
                  </p>
                  {details?.description && (
                    <p className={`text-sm leading-relaxed ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
                      {details.description}
                    </p>
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>Core Advantages</h3>
                  <ul className="space-y-4">
                    {(details?.keyFeatures || editData.bullets || []).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4 group">
                        <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${editData.accent || 'from-blue-600 to-cyan-500'} flex items-center justify-center shrink-0`}>
                          <Save className="h-3 w-3 text-white" />
                        </div>
                        <span className={`text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {details?.useCases && details.useCases.length > 0 && (
                <section className="space-y-6">
                  <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>Operational Reach</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {details.useCases.map((useCase: string, idx: number) => (
                      <div key={idx} className={`px-5 py-4 rounded-2xl border ${dark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'} text-xs font-black uppercase tracking-widest text-center transition-all hover:scale-[1.02] hover:bg-blue-600 hover:text-white hover:border-blue-500`}>
                        {useCase}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <footer className="pt-10 border-t border-white/10 mt-auto flex flex-col sm:flex-row gap-4">
                {onEditStart && isEditMode && (
                   <button
                    onClick={() => isEditingDetails(true)}
                    className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <Pencil className="h-4 w-4" />
                    Modify Experience
                  </button>
                )}
                <button className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${editData.accent || 'from-blue-600 to-cyan-500'} text-white font-black text-sm transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02]`}>
                  Request Enterprise Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </footer>
            </div>
          ) : (
            // Edit Mode Form
            <div className="space-y-8 animate-[fadeIn_0.4s_ease-out] pb-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                 <h3 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Product Configuration</h3>
                 <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">Editing Mode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity</label>
                  <input
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    placeholder="E.g. ERP Solution"
                    className={`w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Categorization</label>
                  <input
                    value={editData.type || ''}
                    onChange={(e) => setEditData({...editData, type: e.target.value})}
                    placeholder="E.g. Enterprise Software"
                    className={`w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Card Summary</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={2}
                  placeholder="Short impact statement for the display card..."
                  className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              {details && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Detailed Narrative</label>
                    <textarea
                      value={details.description || ''}
                      onChange={(e) => handleDetailChange('description', e.target.value)}
                      rows={4}
                      placeholder="Deep dive into product capabilities..."
                      className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 ${dark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Distinctions</label>
                      <button onClick={addFeature} className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase">+ Add Point</button>
                    </div>
                    <div className="space-y-3">
                      {(details.keyFeatures || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex gap-3 group">
                          <div className={`p-4 rounded-xl border flex-1 ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                             <input
                              value={feature}
                              onChange={(e) => handleFeatureChange(idx, e.target.value)}
                              placeholder="Feature headline..."
                              className="w-full bg-transparent outline-none text-sm font-bold text-inherit"
                            />
                          </div>
                          <button onClick={() => removeFeature(idx)} className="p-3 text-red-400 hover:text-red-300 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Reach (Use Cases)</label>
                      <button onClick={addUseCase} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase">+ Add Context</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(details.useCases || []).map((useCase: string, idx: number) => (
                        <div key={idx} className="flex gap-2 group">
                          <div className={`px-4 py-3 rounded-xl border flex-1 ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                             <input
                              value={useCase}
                              onChange={(e) => handleUseCaseChange(idx, e.target.value)}
                              placeholder="E.g. Logistics"
                              className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-inherit"
                            />
                          </div>
                          <button onClick={() => removeUseCase(idx)} className="p-2 text-red-400 hover:text-red-300 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 mt-12 bg-inherit sticky bottom-0 border-t border-white/5 pb-2">
                <button
                  onClick={() => isEditingDetails(false)}
                  className={`flex-1 rounded-2xl px-8 py-4 text-sm font-black transition-all ${dark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Discard Changes
                </button>
                <button
                  onClick={() => {
                    if (onSaveEdit) {
                      onSaveEdit(editData);
                      isEditingDetails(false);
                    }
                  }}
                  className="flex items-center justify-center gap-3 flex-[1.5] rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700 hover:scale-[1.02]"
                >
                  <Save className="h-4 w-4" />
                  Apply Architecture
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
