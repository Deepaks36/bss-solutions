import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

const hrImage = 'https://images.pexels.com/photos/7108815/pexels-photo-7108815.jpeg?auto=compress&cs=tinysrgb&w=1200';

const heroHighlights = [
  'Enterprise HR platforms',
  'Cloud-native product engineering',
  'AI-driven workflow automation',
];

const heroStats = [
  { value: '4.9/5', label: 'Client rating' },
  { value: '60+', label: 'Team members' },
  { value: '200+', label: 'Projects done' },
];

const proofItems = ['HR Metrics', 'BSOL ERP Suite', 'AI Chatbot', 'Knowledgebase AI'];

export function Hero({ dark }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.12);

  return (
    <section
      id="home"
      className={`relative overflow-hidden pt-28 pb-20 transition-colors duration-300 ${dark
        ? 'bg-slate-950 text-white'
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            Available for new projects
          </div>

          <h1 className={`max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Building Digital
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Products That Drive
            </span>
            Growth
          </h1>

          <p className={`mt-6 max-w-xl text-lg leading-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            Brilliant Systems Solutions designs and builds scalable platforms, secure cloud-native systems, and AI-enabled products for growth-focused companies worldwide.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-transform hover:-translate-y-0.5"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-semibold transition-colors ${dark
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-500 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              View Products
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {heroHighlights.map((item) => (
              <div
                key={item}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${dark ? 'bg-white/5 text-slate-300' : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'}`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl border p-4 ${dark ? 'border-slate-800 bg-slate-900/70' : 'border-white bg-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.08)]'}`}
              >
                <div className="text-2xl font-black text-blue-600">{stat.value}</div>
                <div className={`mt-1 text-xs uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative transition-all duration-700 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="relative mx-auto max-w-xl">
            <div className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur ${dark ? 'border-slate-800 bg-slate-900/85' : 'border-white bg-white/85'}`}>
              <div className="flex items-start gap-4">
                <img
                  src={hrImage}
                  alt="Modern HR team"
                  className="h-28 w-28 rounded-2xl object-cover shadow-lg"
                />
                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-600">
                    HR Intelligence
                  </span>
                  <h3 className={`mt-3 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                    Development Excellence
                  </h3>
                  <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Full-stack capabilities built for enterprise scale.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {['Enterprise architecture', 'Web & mobile apps', 'AI integration', 'Cloud infrastructure'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`ml-10 -mt-6 rounded-[1.75rem] border p-5 shadow-2xl ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</p>
                  <h4 className={`mt-2 text-xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                    Product velocity and delivery confidence
                  </h4>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-right">
                  <div className="text-sm font-bold text-emerald-500">+340%</div>
                  <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Sprint velocity</div>
                  <div className="mt-2 text-2xl font-black text-blue-600">92%</div>
                </div>
                <div className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Uptime</div>
                  <div className="mt-2 text-2xl font-black text-blue-600">99.9%</div>
                </div>
              </div>
            </div>

            <div className={`ml-20 -mt-6 rounded-[1.75rem] border p-5 shadow-2xl ${dark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/30">
                  HR
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Associated companies</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {proofItems.map((item) => (
                      <span
                        key={item}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${dark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
