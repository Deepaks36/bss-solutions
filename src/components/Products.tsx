import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus, Pencil, Trash2, X, Check, ImagePlus, Workflow } from 'lucide-react';
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

const PRODUCT_REVEAL_FRACTION = 0.6;
const PRODUCT_SCROLL_STEP_VH = 72;
const PRODUCT_SECTION_BASE_VH = 140;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getProductRevealProgress(index: number, total: number, progress: number) {
  const safeTotal = Math.max(total, 1);
  const step = 1 / safeTotal;
  const start = index * step;
  const revealSpan = step * PRODUCT_REVEAL_FRACTION;

  return clamp((progress - start) / revealSpan, 0, 1);
}

function ProductCard({
  card,
  index,
  total,
  progress,
  dark,
  onEdit,
  onDelete,
}: {
  card: Service;
  index: number;
  total: number;
  progress: number;
  dark: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { editMode } = useSite();
  const local = getProductRevealProgress(index, total, progress);

  return (
    <div
      className={`absolute inset-0 rounded-[2.5rem] border p-4 transition-all duration-500 sm:p-5 ${dark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}
      style={{
        opacity: local,
        transform: `translate3d(0, ${(1 - local) * 72}px, 0) scale(${0.94 + 0.06 * local})`,
        zIndex: index + 1,
        pointerEvents: local > 0.95 ? 'auto' : 'none',
        boxShadow: dark
          ? `0 24px 70px rgba(2, 6, 23, ${0.3 * local})`
          : `0 24px 70px rgba(15, 23, 42, ${0.1 * local})`,
      }}
    >
      {editMode && (
        <div className="absolute top-8 right-8 flex gap-2 z-[20]">
          <button onClick={onEdit} className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2.5 rounded-xl bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className={`flex h-full flex-col overflow-hidden rounded-[2rem] border ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${card.accent ?? 'from-blue-600 to-cyan-500'} px-4 py-2 text-xs font-bold text-white shadow-lg`}>
              {card.icon ? <img src={card.icon} className="h-4 w-4 brightness-0 invert" alt="" /> : <Workflow className="h-4 w-4" />}
              Product {index + 1}
            </div>
            <h3 className={`mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-slate-950'}`}>
              {card.title}
            </h3>
            <p className={`mt-6 max-w-xl text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {card.description}
            </p>

            {card.bullets && card.bullets.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {card.bullets.map((bullet) => (
                  <div key={bullet} className={`flex items-center gap-3 text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${card.accent ?? 'from-blue-600 to-cyan-500'}`} />
                    {bullet}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`relative overflow-hidden rounded-[2rem] p-4 ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full rounded-[1.5rem] object-cover shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className={`flex h-full min-h-[300px] flex-col justify-between rounded-[1.5rem] bg-gradient-to-br ${card.accent ?? 'from-blue-600 to-cyan-500'} p-8 text-white shadow-2xl`}>
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md">Feature Highlight</div>
                  <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                    {card.icon ? <img src={card.icon} className="h-5 w-5 brightness-0 invert" alt="" /> : <Workflow className="h-5 w-5" />}
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

        <div className={`flex items-center justify-between border-t px-8 py-5 ${dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-white'}`}>
          <div className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-slate-400">
            Explorer Step {index + 1} / {total}
          </div>
          <div className="flex items-center gap-4">
             <div className="flex gap-1">
                {Array.from({ length: total }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} 
                  />
                ))}
             </div>
             <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const productCount = content.services.length;
  const hasProducts = productCount > 0;
  const sectionHeight = `${PRODUCT_SECTION_BASE_VH + Math.max(productCount - 1, 0) * PRODUCT_SCROLL_STEP_VH}vh`;

  const [editingProduct, setEditingProduct] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!hasProducts) {
      targetRef.current = 0;
      setProgress(0);
      return;
    }

    const scheduleRaf = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      rafRef.current = null;
      setProgress((current) => {
        const delta = targetRef.current - current;
        if (Math.abs(delta) < 0.0005) return targetRef.current;
        scheduleRaf();
        return current + delta * 0.15;
      });
    };

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const totalScrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp((-rect.top + window.innerHeight * 0.12) / totalScrollableDistance, 0, 1);
      targetRef.current = nextProgress;
      scheduleRaf();
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [hasProducts, productCount]);

  return (
    <section
      id="products"
      ref={sectionRef}
      className={`relative overflow-x-clip transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}
      style={{ minHeight: sectionHeight }}
    >
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-20 max-w-3xl transition-all duration-1000 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-blue-600">
            <Workflow className="h-4 w-4" />
            Product Ecosystem
          </span>
          <h2 className={`mt-8 text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Innovative solutions <br />
            <span className="text-blue-600">revealed uniquely.</span>
          </h2>
          <p className={`mt-6 max-w-2xl text-lg leading-8 sm:text-xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Scroll to discover our suite of high-performance products. Our technology adapts to your needs, one step at a time.
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

        <div className="grid gap-16 lg:grid-cols-[350px_1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className={`rounded-[2.5rem] border p-8 ${dark ? 'border-slate-800 bg-slate-900/50 backdrop-blur-xl' : 'border-white bg-white shadow-[0_32px_80px_rgba(15,23,42,0.08)]'}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[0.65rem] font-black uppercase tracking-widest text-emerald-600">
                <Check className="h-3.5 w-3.5" />
                Industry Leading
              </div>
              <h3 className={`mt-6 text-2xl font-black leading-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
                Focused on your <br />digital growth.
              </h3>
              <p className={`mt-4 text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                We build tools that simplify complexity. Watch as each product unfolds its potential while you navigate.
              </p>

              <div className="mt-10 space-y-4">
                {hasProducts ? content.services.map((card, index) => {
                  const local = getProductRevealProgress(index, productCount, progress);
                  return (
                    <div
                      key={card.id}
                      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-500 ${dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-50 bg-slate-50'}`}
                      style={{
                        opacity: 0.4 + local * 0.6,
                        transform: `translateX(${(1 - local) * 20}px)`,
                        borderColor: local > 0.5 ? (dark ? '#3b82f6' : '#bfdbfe') : ''
                      }}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent ?? 'from-blue-600 to-cyan-500'} text-white shadow-lg transition-transform ${local > 0.5 ? 'scale-110 rotate-3' : ''}`}>
                        {card.icon ? <img src={card.icon} className="h-6 w-6 brightness-0 invert" alt="" /> : <Workflow className="h-6 w-6" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`truncate text-sm font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{card.title}</div>
                        <div className={`text-[0.6rem] font-bold uppercase tracking-widest ${local > 0.5 ? 'text-blue-500' : 'text-slate-400'}`}>
                          {local > 0.99 ? 'Fully Discovered' : local > 0.1 ? 'Discovering...' : 'Next Up'}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className={`rounded-2xl border border-dashed px-5 py-8 text-sm ${dark ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    {editMode ? 'No products yet. Use “Add New Product” to create the first card.' : 'Products will appear here soon.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-32 h-[38rem] sm:h-[40rem] lg:h-[42rem]">
              {hasProducts ? content.services.map((card, index) => (
                <ProductCard
                  key={card.id}
                  card={card}
                  index={index}
                  total={productCount}
                  progress={progress}
                  dark={dark}
                  onEdit={() => setEditingProduct(card)}
                  onDelete={() => onDeleteService(card.id)}
                />
              )) : (
                <div className={`flex h-full items-center justify-center rounded-[2.5rem] border border-dashed p-10 text-center ${dark ? 'border-slate-800 bg-slate-900/80 text-slate-400' : 'border-slate-200 bg-white/90 text-slate-500'}`}>
                  <div>
                    <div className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>No product cards available</div>
                    <p className="mt-3 max-w-md text-sm leading-relaxed">
                      {editMode ? 'Add a product to enable the scroll-based reveal sequence for this section.' : 'This section will animate product cards one by one once products are added.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
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
