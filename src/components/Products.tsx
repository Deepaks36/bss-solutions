import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Workflow } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Service } from '../types';
import { useSite } from '../context/SiteContext';
import { ServiceModal } from './ServiceModal';
import { ProductDetailModal } from './ProductDetailModal';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdateServiceAtomic: (id: string, updates: Partial<Service>) => void;
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

export function Products({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [editingProduct, setEditingProduct] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Service[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const PRODUCTS_PER_LOAD = 5;

  // Use the dedicated products section
  const products = content.products;

  // Initialize displayed products
  useEffect(() => {
    setDisplayedProducts(products.slice(0, PRODUCTS_PER_LOAD));
    setActiveProductId(products[0]?.id || null);
  }, [products]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.getAttribute('data-product-id')) {
            const id = entry.target.getAttribute('data-product-id');
            if (id) setActiveProductId(id);
          }
        });

        // Check if the last product card is visible - load more if needed
        const lastCard = document.querySelector('[data-product-id]:last-of-type');
        if (lastCard && entries.some(e => e.target === lastCard && e.isIntersecting)) {
          if (displayedProducts.length < products.length && !isLoadingMore) {
            setIsLoadingMore(true);
            // Simulate loading delay
            setTimeout(() => {
              const nextBatch = products.slice(0, displayedProducts.length + PRODUCTS_PER_LOAD);
              setDisplayedProducts(nextBatch);
              setIsLoadingMore(false);
            }, 300);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const cards = document.querySelectorAll('.product-card-scroll');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [displayedProducts, products, isLoadingMore]);

  // Get active product name for right side
  const activeProduct = displayedProducts.find(p => p.id === activeProductId) || displayedProducts[0];

  return (
    <section id="products" className={`relative py-12 transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`mb-16 text-center transition-all duration-1000 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-blue-600 shadow-sm">
              <Workflow className="h-4 w-4" />
              Flagship Products
            </span>
          </div>
          <h2 className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-5xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Our Core <span className="text-blue-600">Solutions.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative">
          {/* Left Side: Scrolling Stacked Cards */}
          <div className="w-full lg:w-1/2 flex flex-col pb-12" ref={scrollContainerRef}>
            {displayedProducts.map((item, index) => (
              <div
                key={item.id}
                data-product-id={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`product-card-scroll group sticky flex flex-col items-start cursor-pointer transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 rounded-2xl border p-4 mb-8 ${dark
                  ? 'bg-slate-900/90 backdrop-blur-xl border-slate-800 hover:border-blue-500 shadow-xl'
                  : 'bg-white/95 backdrop-blur-xl border-slate-100 hover:border-blue-300 shadow-2xl'
                  }`}
                style={{
                  top: `calc(15vh + ${index * 12}px)`,
                  zIndex: index + 10,
                  marginTop: index === 0 ? '0' : '-80px'
                }}
              >
                {editMode && (
                  <div className="absolute top-5 right-5 flex gap-2 z-[30]">
                    <button onClick={(e) => { e.stopPropagation(); setEditingProduct(item); }} className="p-2 rounded-xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteService(item.id); }} className="p-2 rounded-xl bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="w-full flex flex-col h-full">
                  <div className={`flex h-12 w-12 mb-3 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent || 'from-blue-600 to-cyan-500'} text-white shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                    {item.icon ? (
                      <img
                        src={item.icon}
                        className="h-6 w-6 object-contain"
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Workflow className={`h-6 w-6 fallback-icon ${item.icon ? 'hidden' : ''}`} />
                  </div>
                  <h3 className={`text-lg font-black mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 line-clamp-2 min-h-[40px] ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto text-xs">
                    <div className="flex gap-1">
                      {item.bullets?.slice(0, 2).map((b, i) => (
                        <span key={i} className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="font-black text-[8px] uppercase tracking-widest text-blue-600 group-hover:translate-x-1 transition-transform">
                      View &rarr;
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {editMode && (
              <button
                onClick={() => setIsAdding(true)}
                className={`sticky flex flex-col items-center justify-center border-2 border-dashed rounded-[2rem] p-8 transition-all hover:bg-blue-500/10 hover:border-blue-500 min-h-[200px] ${dark ? 'bg-slate-900/60 backdrop-blur-md border-slate-800 text-slate-400' : 'bg-white/60 backdrop-blur-md border-slate-300 text-slate-500'}`}
                style={{
                  top: `calc(15vh + ${displayedProducts.length * 12}px)`,
                  zIndex: displayedProducts.length + 10,
                  marginTop: '-80px'
                }}
              >
                <Plus className="h-8 w-8 mb-3 text-blue-500" />
                <span className="font-black text-sm uppercase tracking-widest">Add New Product</span>
              </button>
            )}

            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className={`text-sm font-semibold ml-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Loading more...</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Sticky Product Name Tracker */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <div className="sticky top-1/2 -translate-y-1/2 h-[350px] flex flex-col items-start justify-center pl-16">
              <div className="relative w-full">
                {activeProduct && (
                  <div key={activeProduct.id} className="animate-[slideInRight_0.6s_ease-out]">
                    <h2 className={`text-3xl xl:text-4xl font-black tracking-tighter leading-[0.95] ${dark ? 'text-white' : 'text-slate-900'}`}>
                      {activeProduct.title.split(' ').map((word, i, arr) => (
                        <span key={i} className={`block ${i === arr.length - 1 ? 'text-transparent bg-clip-text bg-gradient-to-r ' + (activeProduct.accent || 'from-blue-600 to-cyan-500') : ''}`}>
                          {word}
                        </span>
                      ))}
                    </h2>

                    <div className="mt-8 space-y-3">
                      {activeProduct.bullets?.map((bullet, idx) => (
                        <div key={bullet} className={`flex items-center gap-3 text-base font-bold animate-[fadeInUp_0.5s_ease-out_forwards] opacity-0`} style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                          <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${activeProduct.accent || 'from-blue-600 to-cyan-500'}`} />
                          <span className={dark ? 'text-slate-400' : 'text-slate-500'}>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(editingProduct || isAdding) && !editingProduct?.details && (
        <ServiceModal
          product={editingProduct}
          dark={dark}
          onSave={(data: Service) => {
            if (editingProduct) {
              const updates: Partial<Service> = {};
              if (data.title !== editingProduct.title) updates.title = data.title;
              if (data.description !== editingProduct.description) updates.description = data.description;
              if (data.icon !== editingProduct.icon) updates.icon = data.icon;
              if (data.image !== editingProduct.image) updates.image = data.image;
              if (JSON.stringify(data.bullets) !== JSON.stringify(editingProduct.bullets)) updates.bullets = data.bullets;

              if (Object.keys(updates).length > 0) {
                onUpdateServiceAtomic(data.id, updates);
              }
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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          dark={dark}
          isEditMode={editMode}
          onClose={() => setSelectedProduct(null)}
          onEditStart={() => setEditingProduct(selectedProduct)}
          onSaveEdit={(updatedProduct: Service) => {
            const updates: Partial<Service> = {};
            if (updatedProduct.title !== selectedProduct.title) updates.title = updatedProduct.title;
            if (updatedProduct.description !== selectedProduct.description) updates.description = updatedProduct.description;
            if (updatedProduct.type !== selectedProduct.type) updates.type = updatedProduct.type;
            if (updatedProduct.icon !== selectedProduct.icon) updates.icon = updatedProduct.icon;
            if (updatedProduct.image !== selectedProduct.image) updates.image = updatedProduct.image;
            if (updatedProduct.details !== selectedProduct.details) updates.details = updatedProduct.details;
            if (updatedProduct.detailsImage !== selectedProduct.detailsImage) updates.detailsImage = updatedProduct.detailsImage;
            if (JSON.stringify(updatedProduct.bullets) !== JSON.stringify(selectedProduct.bullets)) updates.bullets = updatedProduct.bullets;

            if (Object.keys(updates).length > 0) {
              onUpdateServiceAtomic(updatedProduct.id, updates);
              setSelectedProduct(updatedProduct);
            }
          }}
        />
      )}

      {editingProduct && editingProduct?.details && (
        <ProductDetailModal
          product={editingProduct}
          dark={dark}
          isEditing={true}
          isEditMode={editMode}
          onClose={() => setEditingProduct(null)}
          onSaveEdit={(updatedProduct: Service) => {
            const updates: Partial<Service> = {};
            if (updatedProduct.title !== editingProduct.title) updates.title = updatedProduct.title;
            if (updatedProduct.description !== editingProduct.description) updates.description = updatedProduct.description;
            if (updatedProduct.type !== editingProduct.type) updates.type = updatedProduct.type;
            if (updatedProduct.icon !== editingProduct.icon) updates.icon = updatedProduct.icon;
            if (updatedProduct.image !== editingProduct.image) updates.image = updatedProduct.image;
            if (updatedProduct.details !== editingProduct.details) updates.details = updatedProduct.details;
            if (updatedProduct.detailsImage !== editingProduct.detailsImage) updates.detailsImage = updatedProduct.detailsImage;
            if (JSON.stringify(updatedProduct.bullets) !== JSON.stringify(editingProduct.bullets)) updates.bullets = updatedProduct.bullets;

            if (Object.keys(updates).length > 0) {
              onUpdateServiceAtomic(updatedProduct.id, updates);
              setEditingProduct(null);
              if (selectedProduct?.id === editingProduct.id) {
                setSelectedProduct(updatedProduct);
              }
            }
          }}
        />
      )}
    </section>
  );
}
