import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';
import { SiteContent } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  editMode: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

export function Hero({ content, dark, editMode, onUpdate }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center overflow-hidden pt-16 ${dark
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950'
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
        }`}
    >
      {/* ... (background code remains the same) ... */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl animate-blob animation-delay-4000" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #3b82f6 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-sm font-semibold mb-6 border border-blue-600/20">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              World-Class IT Solutions
            </span>

            <h1 className={`text-xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
              <EditableText
                value={content.heroTitle}
                onSave={(v) => onUpdate('heroTitle', v)}
                as="span"
                className="block"
                editMode={editMode}
                dark={dark}
              />
            </h1>

            <div className={`text-lg leading-relaxed mb-8 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              <EditableText
                value={content.heroSubtitle}
                onSave={(v) => onUpdate('heroSubtitle', v)}
                as="p"
                multiline
                editMode={editMode}
                dark={dark}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-blue-600/30"
              >
                <EditableText
                  value={content.heroCta}
                  onSave={(v) => onUpdate('heroCta', v)}
                  as="span"
                  editMode={editMode}
                  dark={dark}
                />
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${dark ? 'border-gray-700 text-gray-200 hover:border-blue-500 hover:text-blue-400' : 'border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
              >
                Explore Services
              </a>
            </div>

            <div className={`flex items-center gap-2 text-sm font-semibold ${dark ? 'text-blue-400' : 'text-blue-600'}`}>
              <CheckCircle className="w-5 h-5" />
              <EditableText
                value={content.heroStat}
                onSave={(v) => onUpdate('heroStat', v)}
                as="span"
                editMode={editMode}
                dark={dark}
              />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-dashed border-blue-600/20">
              {[
                { num: '300+', label: 'Projects Delivered' },
                { num: '50+', label: 'Team Members' },
                { num: '25+', label: 'Years Experience' },
              ].map((s) => (
                <div key={s.label}>
                  <p className={`text-3xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>{s.num}</p>
                  <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'}`}>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-xl" />
              <EditableImage
                src="https://bsyssolutions.com/wp-content/uploads/2022/08/viber_image_2022-08-18_17-35-16-097.jpg"
                alt="IT Solutions"
                onSave={(_v) => {/* In a real app, you'd save this to a server or state */ }}
                editMode={editMode}
                className="relative rounded-3xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
