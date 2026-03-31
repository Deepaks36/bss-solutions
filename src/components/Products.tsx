import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Workflow, ChevronRight } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Service } from '../types';
import { useSite } from '../context/SiteContext';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductEditModal } from './ProductEditModal';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdateServiceAtomic: (id: string, updates: Partial<Service>) => void;
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

function ProductCard({
  item,
  index,
  dark,
  isActive,
  onCardClick,
  onEdit,
  onDelete,
}: {
  item: Service;
  index: number;
  dark: boolean;
  isActive: boolean;
  onCardClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { editMode } = useSite();

  return (
    <div
      data-product-id={item.id}
      onClick={() => { if (!editMode) onCardClick(); }}
      className={`product-card group relative lg:sticky rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer
        ${dark
          ? 'bg-slate-900/95 backdrop-blur-xl border-slate-800 hover:border-blue-500/50 shadow-black/50'
          : 'bg-white/95 backdrop-blur-xl border-slate-100 hover:border-blue-200 shadow-slate-200/50'
        }
        ${isActive
          ? dark ? 'border-blue-500/60 shadow-2xl' : 'border-blue-200 shadow-2xl'
          : ''
        }`}
      style={{
        top: `calc(10vh + ${index * 1.5}rem)`,
        transitionDelay: `${index * 40}ms`,
        boxShadow: dark ? '0 -10px 40px -15px rgba(0,0,0,0.5)' : '0 -10px 40px -15px rgba(0,0,0,0.05)',
      }}
    >
      {/* Edit/Delete buttons */}
      {editMode && (
        <div className="absolute top-5 right-5 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-2 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-xl bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all hover:scale-110"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row h-full">
        {/* Left accent panel with icon */}
        <div className={`sm:w-[120px] shrink-0 flex items-center justify-center p-5 sm:p-8 ${dark ? 'bg-slate-800/60' : 'bg-slate-50/80'}`}>
          <div className={`h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent || 'from-blue-600 to-cyan-500'} text-white shadow-xl group-hover:rotate-6 transition-transform duration-500`}>
            {item.icon ? (
              <img
                src={item.icon}
                className="h-8 w-8 object-contain"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <Workflow className="h-8 w-8" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className={`font-black text-xl sm:text-2xl leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
              {item.title}
            </h3>
            {item.type && (
              <span className={`shrink-0 mt-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {item.type}
              </span>
            )}
          </div>
          <p className={`text-sm leading-relaxed mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.bullets?.slice(0, 3).map((b, i) => (
                <span key={i} className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {b}
                </span>
              ))}
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-1 transition-transform`}>
              View <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Products({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const products = content.products;
  const activeProduct = products.find(p => p.id === activeId) || products[0] || null;

  // IntersectionObserver — same pattern as WhyChooseUs cards
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the most visible card
        let best: { id: string; ratio: number } | null = null;
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.productId;
          if (!id) return;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio };
          }
        });
        if (best && (best as any).ratio > 0) {
          setActiveId((best as any).id);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-10% 0px -40% 0px' }
    );

    const cards = document.querySelectorAll('.product-card[data-product-id]');
    cards.forEach(card => observerRef.current!.observe(card));

    // Set first as default
    if (!activeId && products.length > 0) setActiveId(products[0].id);

    return () => observerRef.current?.disconnect();
  }, [products]);

  const handleSaveEdit = (updatedProduct: Service) => {
    if (isAdding) {
      onAddService(updatedProduct);
      setIsAdding(false);
      return;
    }
    if (!editingProduct) return;
    const updates: Partial<Service> = {};
    (Object.keys(updatedProduct) as (keyof Service)[]).forEach(k => {
      if (JSON.stringify(updatedProduct[k]) !== JSON.stringify((editingProduct as any)[k])) {
        (updates as any)[k] = updatedProduct[k];
      }
    });
    if (Object.keys(updates).length > 0) onUpdateServiceAtomic(updatedProduct.id, updates);
    setEditingProduct(null);
  };

  return (
    <section id="products" className={`py-16 transition-colors duration-300 relative ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div ref={ref} className={`mb-16 text-center transition-all duration-1000 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-blue-600 shadow-sm mb-6">
            <Workflow className="h-4 w-4" />
            Flagship Products
          </span>
          <h2 className={`text-4xl font-black tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Our Core <span className="text-blue-600">Solutions.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

          {/* LEFT: Scrolling stacked cards (2/3 width) — mirrors WhyUs right column */}
          <div className="lg:w-2/3 flex flex-col gap-12">
            {products.map((item, i) => (
              <ProductCard
                key={item.id}
                item={item}
                index={i}
                dark={dark}
                isActive={activeId === item.id}
                onCardClick={() => setSelectedProduct(item)}
                onEdit={() => setEditingProduct(item)}
                onDelete={() => onDeleteService(item.id)}
              />
            ))}

            {editMode && (
              <button
                onClick={() => setIsAdding(true)}
                className={`sticky flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all hover:border-blue-500 group min-h-[200px]
                  ${dark ? 'bg-slate-900/80 border-slate-700 hover:bg-blue-900/10 backdrop-blur-md text-slate-400' : 'bg-white/80 border-slate-200 backdrop-blur-md text-slate-500'}`}
                style={{ top: `calc(10vh + ${products.length * 1.5}rem)` }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${dark ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600 shadow-sm'}`}>
                  <Plus className="h-8 w-8" />
                </div>
                <span className={`font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>Add New Product</span>
              </button>
            )}
          </div>

          {/* RIGHT: Sticky product name only */}
          <div className="hidden lg:block lg:w-1/3 lg:sticky lg:top-32">
            {activeProduct && (
              <div key={activeProduct.id} className="animate-[fadeInUp_0.5s_ease-out]">
                <h2 className={`text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {activeProduct.title.split(' ').map((word, i, arr) => (
                    <span key={i} className={`block ${i === arr.length - 1 ? `text-transparent bg-clip-text bg-gradient-to-r ${activeProduct.accent || 'from-blue-600 to-cyan-500'}` : ''}`}>
                      {word}
                    </span>
                  ))}
                </h2>
                <div className={`w-20 h-2 rounded-full mt-8 bg-gradient-to-r ${activeProduct.accent || 'from-blue-600 to-cyan-500'}`} />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Detail modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          dark={dark}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Edit / Add modal */}
      {(editingProduct || isAdding) && (
        <ProductEditModal
          product={editingProduct}
          dark={dark}
          onSave={handleSaveEdit}
          onClose={() => { setEditingProduct(null); setIsAdding(false); }}
        />
      )}
    </section>
  );
}
