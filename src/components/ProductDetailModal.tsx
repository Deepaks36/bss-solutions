import { X, Workflow, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Service } from '../types';

interface Props {
  product: Service;
  dark: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, dark, onClose }: Props) {
  const details = product.details
    ? (typeof product.details === 'string' ? JSON.parse(product.details) : product.details)
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-3 md:p-6 animate-[fadeIn_0.25s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.25s_ease-out] max-h-[95vh] ${dark ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-[101] rounded-full p-2 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left: Visual */}
        <div className={`w-full md:w-[38%] relative flex flex-col items-center justify-center p-8 overflow-hidden ${dark ? 'bg-slate-900' : 'bg-slate-50'} border-r ${dark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${product.accent || 'from-blue-600 to-cyan-500'} blur-3xl pointer-events-none`} />

          <div className="relative z-10 w-full flex flex-col items-center gap-6">
            {/* Icon */}
            <div className={`h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${product.accent || 'from-blue-600 to-cyan-500'} text-white shadow-xl`}>
              {product.icon
                ? <img src={product.icon} className="h-8 w-8 object-contain" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                : <Workflow className="h-8 w-8" />
              }
            </div>

            {/* Hero image */}
            {product.image ? (
              <div className="w-full rounded-2xl overflow-hidden shadow-xl">
                <img src={product.image} alt={product.title} className="w-full aspect-[4/3] object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-slate-900/40' : 'from-white/20'} to-transparent pointer-events-none`} />
              </div>
            ) : (
              <div className={`w-full aspect-[4/3] rounded-2xl flex items-center justify-center bg-gradient-to-br ${product.accent || 'from-blue-600 to-cyan-500'} shadow-xl opacity-20`}>
                <Workflow className="h-20 w-20 text-white" />
              </div>
            )}

            {/* Details image */}
            {product.detailsImage && (
              <div className="w-full">
                <p className={`text-[9px] font-black uppercase tracking-widest mb-2 text-center ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Inside the Solution</p>
                <img src={product.detailsImage} className="w-full h-24 object-cover rounded-xl border border-white/10 shadow" alt="Details" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className={`w-full md:w-[62%] flex flex-col p-7 md:p-10 overflow-y-auto ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          <div className="space-y-7 animate-[fadeInUp_0.4s_ease-out]">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.type && (
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${product.accent || 'from-blue-600 to-cyan-500'}`}>
                    {product.type}
                  </span>
                )}
                <div className={`h-px flex-1 ${dark ? 'bg-white/10' : 'bg-slate-100'}`} />
              </div>
              <h2 className={`text-2xl md:text-3xl font-black tracking-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                {product.title}
              </h2>
              <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {product.description}
              </p>
            </div>

            {/* Detailed description */}
            {details?.description && (
              <div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${dark ? 'text-blue-400' : 'text-blue-600'}`}>Overview</h3>
                <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {details.description}
                </p>
              </div>
            )}

            {/* Key features */}
            {(details?.keyFeatures || product.bullets)?.length > 0 && (
              <div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>Core Advantages</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(details?.keyFeatures || product.bullets || []).map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${dark ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-xs font-medium ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Use cases */}
            {details?.useCases?.length > 0 && (
              <div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dark ? 'text-indigo-400' : 'text-indigo-600'}`}>Operational Reach</h3>
                <div className="flex flex-wrap gap-2">
                  {details.useCases.map((useCase: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 hover:bg-blue-600 hover:text-white hover:border-blue-500 cursor-default ${dark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bullets if no details */}
            {!details && product.bullets && product.bullets.length > 0 && (
              <div>
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`}>Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${dark ? 'text-blue-400' : 'text-blue-500'}`} />
                      <span className={`text-xs font-medium ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className={`pt-5 border-t ${dark ? 'border-white/5' : 'border-slate-100'}`}>
              <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${product.accent || 'from-blue-600 to-cyan-500'} text-white text-xs font-black transition-all hover:shadow-lg hover:scale-[1.02]`}>
                Request Enterprise Demo
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
