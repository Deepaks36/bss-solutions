import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, Building2, Cpu, LayoutDashboard, ShieldCheck, Workflow } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
  onUpdateServiceAtomic: (id: string, updates: Partial<{ id: string; title: string; description: string; icon: string }>) => void;
  onAddService: (service: { id: string; title: string; description: string; icon: string }) => void;
  onDeleteService: (id: string) => void;
}

const cards = [
  {
    title: 'HR Metrics',
    description: 'Track attendance, performance, payroll signals, and workforce analytics in a single dashboard.',
    accent: 'from-blue-600 to-cyan-500',
    icon: LayoutDashboard,
    image: 'https://images.pexels.com/photos/7108815/pexels-photo-7108815.jpeg?auto=compress&cs=tinysrgb&w=1200',
    bullets: ['People analytics', 'Payroll insights', 'Employee performance'],
  },
  {
    title: 'BSOL ERP Suite',
    description: 'Unify finance, operations, procurement, and reporting in one secure enterprise platform.',
    accent: 'from-indigo-600 to-violet-500',
    icon: Building2,
    image: '',
    bullets: ['Finance workflows', 'Inventory control', 'Operational reporting'],
  },
  {
    title: 'AI Functional Chatbot',
    description: 'Answer employee and customer questions instantly with AI-assisted workflows and support routing.',
    accent: 'from-emerald-600 to-teal-500',
    icon: Bot,
    image: '',
    bullets: ['24/7 assistance', 'Smart routing', 'Conversation history'],
  },
  {
    title: 'Ask Me - Corporate Knowledgebase AI',
    description: 'Turn policies, SOPs, and documents into a secure internal assistant for teams.',
    accent: 'from-amber-500 to-orange-500',
    icon: ShieldCheck,
    image: '',
    bullets: ['Private knowledge base', 'Document search', 'Role-based access'],
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ProductCard({
  card,
  index,
  progress,
  dark,
}: {
  card: (typeof cards)[number];
  index: number;
  progress: number;
  dark: boolean;
}) {
  // Each card animates in over its own 1/N slice of [0,1]
  const n = cards.length;
  const start = index / n;
  const end = (index + 1) / n;
  const local = clamp((progress - start) / (end - start), 0, 1);
  const Icon = card.icon;

  return (
    <div
      className={`absolute inset-0 rounded-[2rem] border p-4 transition-all duration-300 sm:p-5 ${dark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}
      style={{
        opacity: local,
        transform: `translate3d(0, ${(1 - local) * 72}px, 0) scale(${0.96 + 0.04 * local})`,
        zIndex: index + 1,
        boxShadow: dark
          ? '0 24px 70px rgba(2, 6, 23, 0.35)'
          : '0 24px 70px rgba(15, 23, 42, 0.10)',
      }}
    >
      <div className={`flex h-full flex-col overflow-hidden rounded-[1.5rem] border ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="grid flex-1 gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:p-6">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${card.accent} px-3 py-1.5 text-xs font-semibold text-white`}>
              <Icon className="h-4 w-4" />
              Product {index + 1}
            </div>
            <h3 className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-slate-950'}`}>
              {card.title}
            </h3>
            <p className={`mt-4 max-w-xl text-base leading-7 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {card.description}
            </p>

            <div className="mt-6 space-y-3">
              {card.bullets.map((bullet) => (
                <div key={bullet} className={`flex items-center gap-3 text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${card.accent}`} />
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-[1.5rem] p-3 ${dark ? 'bg-slate-800/70' : 'bg-slate-50'}`}>
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                className="h-full min-h-72 w-full rounded-[1.25rem] object-cover"
              />
            ) : (
              <div className={`flex h-full min-h-72 flex-col justify-between rounded-[1.25rem] bg-gradient-to-br ${card.accent} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold">Product Overview</div>
                  <div className="rounded-full bg-white/20 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                    <div className="text-xs uppercase tracking-[0.25em] text-white/70">Deployment</div>
                    <div className="mt-2 text-2xl font-black">Fast, secure, scalable</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/70">Adoption</div>
                      <div className="mt-1 text-xl font-black">High</div>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/70">Support</div>
                      <div className="mt-1 text-xl font-black">24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-between border-t px-5 py-4 ${dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-white'}`}>
          <div className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">
            Scroll reveal {index + 1}/{cards.length}
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

export function Products({ dark }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const { ref, visible } = useAnimateOnScroll(0.1);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      targetRef.current = clamp(-rect.top / total, 0, 1);
      scheduleRaf();
    };

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
        return current + delta * 0.12;
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="products"
      ref={sectionRef}
      className={`relative transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}
      style={{ minHeight: `${100 + cards.length * 100}vh` }}
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`mb-10 max-w-3xl transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            <Workflow className="h-4 w-4" />
            Products
          </span>
          <h2 className={`mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Product experiences that reveal themselves smoothly while you scroll.
          </h2>
          <p className={`mt-4 max-w-2xl text-base leading-8 sm:text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            The product showcase stays clean, with each card appearing in sequence and the page continuing normally once the story is finished.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className={`rounded-[2rem] border p-6 ${dark ? 'border-slate-800 bg-slate-900/70' : 'border-white bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]'}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <Cpu className="h-4 w-4" />
                Product-first company
              </div>
              <h3 className={`mt-4 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                Focused suite for HR, ERP, AI, and knowledge automation.
              </h3>
              <p className={`mt-3 text-sm leading-7 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                The left panel stays concise, so the animation on the right feels smooth and easy to follow.
              </p>

              <div className="mt-6 space-y-3">
                {cards.map((card, index) => {
                  const n = cards.length;
                  const local = clamp((progress - index / n) / (1 / n), 0, 1);
                  return (
                    <div
                      key={card.title}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${dark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}
                      style={{ opacity: 0.5 + local * 0.5, transform: `translateX(${(1 - local) * 10}px)` }}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{card.title}</div>
                        <div className="text-xs text-slate-500">Stage {index + 1}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-24 h-[34rem] sm:h-[36rem] lg:h-[38rem]">
              {cards.map((card, index) => (
                <ProductCard key={card.title} card={card} index={index} progress={progress} dark={dark} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
