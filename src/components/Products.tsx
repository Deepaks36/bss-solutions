import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ImagePlus, Workflow, ChevronRight } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Service } from '../types';
import { useSite } from '../context/SiteContext';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdateServiceAtomic: (id: string, updates: Partial<Service>) => void;
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

interface ProductEditModalProps {
  product: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
  dark: boolean;
}

function ProductEditModal({ product, onSave, onClose, dark }: ProductEditModalProps) {
  const [title, setTitle] = useState(product?.title ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [icon, setIcon] = useState(product?.icon ?? '');
  const [image, setImage] = useState(product?.image ?? '');
  const [accent, setAccent] = useState(product?.accent ?? 'from-blue-600 to-cyan-500');
  const [bullets, setBullets] = useState(product?.bullets?.join(', ') ?? '');

  const iconRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-inherit pb-2 z-10">
          <h3 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className={`rounded-xl p-2 transition-colors ${dark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Product Icon</label>
              <input ref={iconRef} type="file" accept="image/*" onChange={(e) => handleFile(e, setIcon)} className="hidden" />
              <button
                onClick={() => iconRef.current?.click()}
                className={`flex w-full h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${dark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-600 hover:bg-slate-100'
                  }`}
              >
                {icon ? <img src={icon} alt="Icon" className="h-12 w-12 object-contain" /> : <><ImagePlus className="h-6 w-6" /><span>Icon</span></>}
              </button>
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Showcase Image (Optional)</label>
              <input ref={imageRef} type="file" accept="image/*" onChange={(e) => handleFile(e, setImage)} className="hidden" />
              <button
                onClick={() => imageRef.current?.click()}
                className={`flex w-full h-32 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-colors ${dark
                  ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500 hover:bg-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-600 hover:bg-slate-100'
                  }`}
              >
                {image ? <img src={image} alt="Showcase" className="h-full w-full object-cover rounded-xl" /> : <><ImagePlus className="h-6 w-6" /><span>Image</span></>}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product Name"
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={3}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Key Features (Comma separated)</label>
              <input
                value={bullets}
                onChange={(e) => setBullets(e.target.value)}
                placeholder="Feature 1, Feature 2..."
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Accent Theme</label>
              <div className="grid grid-cols-3 gap-2">
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

        <div className="mt-8 flex items-center justify-end gap-3 border-t pt-6 border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onSave({
                  id: product?.id ?? `p-${Date.now()}`,
                  title: title.trim(),
                  description: description.trim(),
                  icon,
                  image,
                  accent,
                  bullets: bullets.split(',').map(s => s.trim()).filter(Boolean)
                });
              }
            }}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Products({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const productCount = content.services.length;
  const hasProducts = productCount > 0;

  const safeActiveIndex = hasProducts ? Math.max(0, Math.min(activeIndex, productCount - 1)) : 0;

  useEffect(() => {
    if (!hasProducts || editMode || editingProduct || isAdding) return;

    // Auto change products
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const safeCurrent = Math.max(0, Math.min(current, productCount - 1));
        return (safeCurrent + 1) % productCount;
      });
    }, 6000); // changes every 6 seconds

    return () => clearInterval(interval);
  }, [hasProducts, productCount, editMode, editingProduct, isAdding, safeActiveIndex]);

  const activeProduct = hasProducts ? content.services[safeActiveIndex] : null;

  return (
    <section id="products" className={`relative py-32 transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`mb-20 max-w-3xl transition-all duration-1000 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-blue-600">
            <Workflow className="h-4 w-4" />
            Product Ecosystem
          </span>
          <h2 className={`mt-8 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Innovative solutions <br />
            <span className="text-blue-600">revealed uniquely.</span>
          </h2>
          <p className={`mt-6 max-w-2xl text-lg leading-8 sm:text-xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Discover our suite of high-performance products. Our technology adapts to your needs.
          </p>

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-8 flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </button>
          )}
        </div>

        <div
          className="grid gap-6 grid-cols-1 lg:grid-cols-[340px_1fr] lg:gap-10 items-start"
        >
          {/* Left Side: Product List */}
          <div className={`relative flex flex-col overflow-hidden rounded-[2rem] border ${dark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white/40'} shadow-sm h-[300px] lg:h-full lg:min-h-[400px]`}>
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-3 custom-scrollbar">
              {hasProducts ? content.services.map((item, index) => {
                const isActive = index === safeActiveIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`group relative flex w-full items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all duration-300 ${isActive
                        ? (dark ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-blue-500 bg-blue-50 shadow-md')
                        : (dark ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300')
                      }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.accent ?? 'from-blue-600 to-cyan-500'} text-white shadow-sm transition-all duration-500 ${isActive ? 'scale-110 shadow-blue-500/40' : 'group-hover:scale-105'}`}>
                        {item.icon ? <img src={item.icon} className="h-5 w-5 brightness-0 invert" alt="" /> : <Workflow className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold leading-tight transition-colors ${isActive ? (dark ? 'text-blue-400' : 'text-blue-700') : (dark ? 'text-slate-200' : 'text-slate-900')}`}>
                          {item.title}
                        </div>
                        <div className={`mt-0.5 text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                          {isActive ? 'Active' : 'Details'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-blue-500' : '-translate-x-2 opacity-0 text-slate-400 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </button>
                )
              }) : (
                <div className={`rounded-3xl border border-dashed p-8 text-center text-sm ${dark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
                  {editMode ? 'No products yet. Use "Add New Product" to create one.' : 'Products will appear here soon.'}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="relative">
            {activeProduct ? (
              <div
                key={activeProduct.id}
                className={`animate-[fadeIn_0.5s_ease-out_forwards] relative flex h-full min-h-[400px] flex-col justify-center overflow-hidden rounded-[2rem] border p-6 sm:p-8 transition-all duration-500 ${dark ? 'border-slate-800 bg-slate-900 shadow-xl' : 'border-slate-100 bg-white shadow-2xl'}`}
              >
                {editMode && (
                  <div className="absolute top-6 right-6 flex gap-2 z-[20]">
                    <button onClick={() => setEditingProduct(activeProduct)} className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDeleteService(activeProduct.id)} className="p-2.5 rounded-xl bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-8 w-full items-center">
                  <div className="flex flex-col justify-center">
                    <div className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${activeProduct.accent ?? 'from-blue-600 to-cyan-500'} px-4 py-2 text-xs font-bold text-white shadow-lg`}>
                      {activeProduct.icon ? <img src={activeProduct.icon} className="h-4 w-4 brightness-0 invert" alt="" /> : <Workflow className="h-4 w-4" />}
                      Featured Product
                    </div>
                    <h3 className={`mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>
                      {activeProduct.title}
                    </h3>
                    <p className={`mt-4 text-base xl:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activeProduct.description}
                    </p>

                    {activeProduct.bullets && activeProduct.bullets.length > 0 && (
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeProduct.bullets.map((bullet) => (
                          <div key={bullet} className={`flex items-center gap-3 text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${activeProduct.accent ?? 'from-blue-600 to-cyan-500'}`} />
                            {bullet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`mt-8 lg:mt-0 relative overflow-hidden rounded-[1.5rem] p-3 ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    {activeProduct.image ? (
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.title}
                        className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className={`flex aspect-[4/3] w-full flex-col justify-between rounded-2xl bg-gradient-to-br ${activeProduct.accent ?? 'from-blue-600 to-cyan-500'} p-6 text-white shadow-xl`}>
                        <div className="flex items-center justify-between">
                          <div className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md">Feature Highlight</div>
                          <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                            {activeProduct.icon ? <img src={activeProduct.icon} className="h-5 w-5 brightness-0 invert" alt="" /> : <Workflow className="h-5 w-5" />}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10">
                            <div className="text-[0.6rem] uppercase tracking-[0.3em] text-white/60">Core Performance</div>
                            <div className="mt-2 text-2xl font-black">Scalable Architecture</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 text-center">
                              <div className="text-2xl font-black">99.9%</div>
                              <div className="text-[0.6rem] uppercase tracking-widest text-white/60">Uptime</div>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 text-center">
                              <div className="text-2xl font-black">24/7</div>
                              <div className="text-[0.6rem] uppercase tracking-widest text-white/60">Support</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {(editingProduct || isAdding) && (
        <ProductEditModal
          product={editingProduct}
          dark={dark}
          onSave={(data) => {
            if (editingProduct) {
              onUpdateServiceAtomic(data.id, data);
            } else {
              onAddService(data);
              setActiveIndex(productCount); // Select the newly added product
            }
            setEditingProduct(null);
            setIsAdding(false);
          }}
          onClose={() => {
            setEditingProduct(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
