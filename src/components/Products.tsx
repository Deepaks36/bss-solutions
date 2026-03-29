import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Workflow } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Service } from '../types';
import { useSite } from '../context/SiteContext';
import { ServiceModal } from './ServiceModal';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdateServiceAtomic: (id: string, updates: Partial<Service>) => void;
  onAddService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

// Full Detail Modal
function ProductDetailModal({ product, dark, onClose }: { product: Service; dark: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]" onClick={onClose}>
      <div
        className={`relative w-full max-w-4xl rounded-[2rem] border shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out] ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-6 right-6 z-[101] rounded-full p-2 transition-colors ${dark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900'}`}>
          <X className="h-5 w-5" />
        </button>

        <div className={`md:w-2/5 relative flex items-center justify-center p-8 bg-gradient-to-br ${product.accent ?? 'from-blue-600 to-cyan-500'} text-white`}>
          {product.image ? (
            <div className="w-full relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover rounded-xl shadow-2xl transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                  (e.target as HTMLImageElement).parentElement?.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          ) : null}
          <div className={`text-center ${product.image ? 'hidden' : ''}`}>
            <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl mb-6 overflow-hidden">
              {product.icon ? (
                <img
                  src={product.icon}
                  className="h-12 w-12 object-contain"
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Workflow className={`h-12 w-12 ${product.icon ? 'hidden' : ''}`} />
            </div>
            <h3 className="text-3xl font-black tracking-tight">{product.title}</h3>
          </div>
        </div>

        <div className={`md:w-3/5 p-8 md:p-12 flex flex-col justify-center`}>
          <div className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${product.accent ?? 'from-blue-600 to-cyan-500'} px-4 py-1.5 text-xs font-bold text-white shadow-lg mb-6`}>
            <Workflow className="h-3 w-3" />
            Product Details
          </div>
          <h3 className={`text-4xl font-black mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}>{product.title}</h3>
          <p className={`text-lg leading-relaxed mb-8 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{product.description}</p>
          {product.bullets && product.bullets.length > 0 && (
            <div>
              <h4 className={`text-sm tracking-widest uppercase font-bold mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Key Features</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.bullets.map(bullet => (
                  <li key={bullet} className={`flex items-start gap-3 text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br mt-1 ${product.accent ?? 'from-blue-600 to-cyan-500'}`} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Products({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode, resetContent } = useSite();
  const [editingProduct, setEditingProduct] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);

  // Strictly filter for the 5 flagship products only
  const products = content.services.filter(s => ['s1', 's2', 's3', 's4', 's5'].includes(s.id));

  // DATA SYNC CHECK: If the database is stale (showing services instead of products), force a reset.
  useEffect(() => {
    if (products.length > 0 && products[0].title !== 'BSOL ERP' && !editMode) {
      console.log('Stale data detected in Products section. Syncing with defaults...');
      resetContent();
    }
  }, [products, editMode, resetContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-product-id');
            if (id) setActiveProductId(id);
          }
        });
      },
      // Target the exact center of the viewport for precise name changing
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    const cards = document.querySelectorAll('.product-card-scroll');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [products]);

  // Ensure initial state is correct
  useEffect(() => {
    if (!activeProductId && products.length > 0) {
      setActiveProductId(products[0].id);
    }
  }, [products, activeProductId]);

  // Clean activeProductId if it no longer exists
  useEffect(() => {
    if (activeProductId && !products.find(p => p.id === activeProductId)) {
      setActiveProductId(products[0]?.id || null);
    }
  }, [products, activeProductId]);

  // Get active product name for right side
  const activeProduct = products.find(p => p.id === activeProductId) || products[0];

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
          <div className="w-full lg:w-1/2 flex flex-col pb-12">
            {products.map((item, index) => (
              <div
                key={item.id}
                data-product-id={item.id}
                onClick={() => setSelectedProduct(item)}
                className={`product-card-scroll group sticky flex flex-col items-start cursor-pointer transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 rounded-[2rem] border p-7 mb-10 ${dark
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

                <div className="w-full">
                  <div className={`flex h-14 w-14 mb-6 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent ?? 'from-blue-600 to-cyan-500'} text-white shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                    {item.icon ? (
                      <img
                        src={item.icon}
                        className="h-7 w-7 object-contain"
                        alt=""
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Workflow className={`h-7 w-7 fallback-icon ${item.icon ? 'hidden' : ''}`} />
                  </div>
                  <h3 className={`text-2xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                  <p className={`text-base leading-relaxed mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-2">
                      {item.bullets?.slice(0, 2).map((b, i) => (
                        <span key={i} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                    <div className="font-black text-[10px] uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform">
                      Explore &rarr;
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
                  top: `calc(15vh + ${products.length * 12}px)`,
                  zIndex: products.length + 10,
                  marginTop: '-80px' // Consistently stack at the end
                }}
              >
                <Plus className="h-8 w-8 mb-3 text-blue-500" />
                <span className="font-black text-sm uppercase tracking-widest">Add New Product</span>
              </button>
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
                        <span key={i} className={`block ${i === arr.length - 1 ? 'text-transparent bg-clip-text bg-gradient-to-r ' + (activeProduct.accent ?? 'from-blue-600 to-cyan-500') : ''}`}>
                          {word}
                        </span>
                      ))}
                    </h2>

                    <div className="mt-8 space-y-3">
                      {activeProduct.bullets?.map((bullet, idx) => (
                        <div key={bullet} className={`flex items-center gap-3 text-base font-bold animate-[fadeInUp_0.5s_ease-out_forwards] opacity-0`} style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                          <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${activeProduct.accent ?? 'from-blue-600 to-cyan-500'}`} />
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

      {(editingProduct || isAdding) && (
        <ServiceModal
          product={editingProduct}
          dark={dark}
          onSave={(data: Service) => {
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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          dark={dark}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
