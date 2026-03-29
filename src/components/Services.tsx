import { useState, useEffect } from 'react';
import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Workflow
} from 'lucide-react';
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

export function Services({ content, dark, onUpdateServiceAtomic, onAddService, onDeleteService }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Filter for services only (exclude flagship products s1-s5)
  const services = content.services.filter(s => !['s1', 's2', 's3', 's4', 's5'].includes(s.id));
  const serviceCount = services.length;
  const hasServices = serviceCount > 0;

  const safeActiveIndex = hasServices ? Math.max(0, Math.min(activeIndex, serviceCount - 1)) : 0;

  useEffect(() => {
    if (!hasServices || editMode || editingService || isAdding) return;

    // Auto change services
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const safeCurrent = Math.max(0, Math.min(current, serviceCount - 1));
        return (safeCurrent + 1) % serviceCount;
      });
    }, 6000); // changes every 6 seconds

    return () => clearInterval(interval);
  }, [hasServices, serviceCount, editMode, editingService, isAdding, safeActiveIndex]);

  const activeService = hasServices ? services[safeActiveIndex] : null;

  return (
    <section id="services" className={`relative py-32 transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`mb-20 grid grid-cols-1 md:grid-cols-[1fr_auto] items-end transition-all duration-1000 ${visible || editMode ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] text-blue-600">
              <Workflow className="h-4 w-4" />
              {content.servicesTagline || "Our Services"}
            </span>
            <h2 className={`mt-8 text-4xl font-black tracking-tight sm:text-5xl lg:text-5xl ${dark ? 'text-white' : 'text-slate-950'}`}>
              {content.servicesTitle || "Services & Solutions"}
            </h2>
            <p className={`mt-6 max-w-2xl text-lg leading-8 sm:text-xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              {content.servicesSubtitle || "Team up with the perfect digital partner for all your technical needs."}
            </p>
          </div>

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-8 flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Add New Service
            </button>
          )}
        </div>

        <div
          className="grid gap-6 grid-cols-1 lg:grid-cols-[340px_1fr] lg:gap-10 items-start"
        >
          {/* Left Side: Services List */}
          <div className={`relative flex flex-col overflow-hidden rounded-[2rem] border ${dark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white/40'} shadow-sm h-[300px] lg:h-full lg:min-h-[400px]`}>
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto p-3 custom-scrollbar">
              {hasServices ? services.map((item, index) => {
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
                        {item.icon ? (
                          <img 
                            src={item.icon} 
                            className="h-5 w-5 object-contain" 
                            alt="" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Workflow className={`h-5 w-5 ${item.icon ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold leading-tight transition-colors ${isActive ? (dark ? 'text-blue-400' : 'text-blue-700') : (dark ? 'text-slate-200' : 'text-slate-900')}`}>
                          {item.title}
                        </div>
                        <div className={`mt-0.5 text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                          {isActive ? '' : 'Details'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-blue-500' : '-translate-x-2 opacity-0 text-slate-400 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </button>
                )
              }) : (
                <div className={`rounded-3xl border border-dashed p-8 text-center text-sm ${dark ? 'border-slate-800 bg-slate-900/50 text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}>
                  {editMode ? 'No services yet. Use "Add New Service" to create one.' : 'Services will appear here soon.'}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Service Details */}
          <div className="relative">
            {activeService ? (
              <div
                key={activeService.id}
                className={`animate-[fadeIn_0.5s_ease-out_forwards] relative flex h-full min-h-[400px] flex-col justify-center overflow-hidden rounded-[2rem] border p-6 sm:p-8 transition-all duration-500 ${dark ? 'border-slate-800 bg-slate-900 shadow-xl' : 'border-slate-100 bg-white shadow-2xl'}`}
              >
                {editMode && (
                  <div className="absolute top-6 right-6 flex gap-2 z-[20]">
                    <button onClick={() => setEditingService(activeService)} className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all hover:scale-110">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDeleteService(activeService.id)} className="p-2.5 rounded-xl bg-red-600 text-white shadow-xl hover:bg-red-700 transition-all hover:scale-110">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="flex-1 lg:grid lg:grid-cols-2 lg:gap-8 w-full items-center">
                  <div className="flex flex-col justify-center">
                    <div className={`inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r ${activeService.accent ?? 'from-blue-600 to-cyan-500'} px-4 py-2 text-xs font-bold text-white shadow-lg`}>
                      {activeService.icon ? (
                        <img 
                          src={activeService.icon} 
                          className="h-4 w-4 object-contain" 
                          alt="" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Workflow className={`h-4 w-4 ${activeService.icon ? 'hidden' : ''}`} />
                      Featured Service
                    </div>
                    <h3 className={`mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>
                      {activeService.title}
                    </h3>
                    <p className={`mt-4 text-base xl:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {activeService.description}
                    </p>

                    {activeService.bullets && activeService.bullets.length > 0 && (
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeService.bullets.map((bullet) => (
                          <div key={bullet} className={`flex items-center gap-3 text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${activeService.accent ?? 'from-blue-600 to-cyan-500'}`} />
                            {bullet}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`mt-8 lg:mt-0 relative overflow-hidden rounded-[1.5rem] p-3 ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    {activeService.image ? (
                      <div className="w-full h-full relative">
                        <img
                          src={activeService.image}
                          alt={activeService.title}
                          className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl transition-transform duration-700 hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                            (e.target as HTMLImageElement).parentElement?.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      </div>
                    ) : null}
                    <div className={`flex aspect-[4/3] w-full flex-col justify-between rounded-2xl bg-gradient-to-br ${activeService.accent ?? 'from-blue-600 to-cyan-500'} p-6 text-white shadow-xl ${activeService.image ? 'hidden' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur-md">Feature Highlight</div>
                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                          {activeService.icon ? (
                            <img 
                              src={activeService.icon} 
                              className="h-5 w-5 object-contain" 
                              alt="" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <Workflow className={`h-5 w-5 ${activeService.icon ? 'hidden' : ''}`} />
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
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {(editingService || isAdding) && (
        <ServiceModal
          product={editingService}
          dark={dark}
          onSave={(data: Service) => {
            if (editingService) {
              onUpdateServiceAtomic(data.id, data);
            } else {
              onAddService(data);
            }
            setEditingService(null);
            setIsAdding(false);
          }}
          onClose={() => {
            setEditingService(null);
            setIsAdding(false);
          }}
        />
      )}
    </section>
  );
}
