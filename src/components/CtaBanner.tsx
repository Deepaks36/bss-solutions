import { ArrowRight } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  editMode: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

export function CtaBanner({ content, dark, editMode, onUpdate }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.2);

  return (
    <section
      className={`py-20 relative overflow-hidden transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}
    >
      <div
        ref={ref}
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
      >
        <div className={`rounded-3xl p-14 relative overflow-hidden ${dark
            ? 'bg-gradient-to-br from-blue-900/60 to-purple-900/40 border border-blue-700/40'
            : 'bg-gradient-to-br from-blue-600 to-indigo-700'
          }`}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              <EditableText
                value={content.ctaBannerText}
                onSave={(v) => onUpdate('ctaBannerText', v)}
                as="span"
                editMode={editMode}
                dark={dark}
              />
            </h2>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              Get In Touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
