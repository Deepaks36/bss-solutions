import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent, Testimonial } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
  onUpdateTestimonial: (id: string, field: keyof Testimonial, value: string) => void;
}

export function Testimonials({ content, dark, onUpdate, onUpdateTestimonial }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + content.testimonials.length) % content.testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % content.testimonials.length);

  const t = content.testimonials[current];

  return (
    <section
      id="testimonials"
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${dark
        ? 'bg-gradient-to-br from-blue-950 via-gray-900 to-gray-950'
        : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
        }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <EditableText
            value={content.testimonialsTagline}
            onSave={(v) => onUpdate('testimonialsTagline', v)}
            as="span"
            dark={dark}
            className="inline-block text-sm font-bold uppercase tracking-widest text-white/60 mb-3"
          />
          <EditableText
            value={content.testimonialsTitle}
            onSave={(v) => onUpdate('testimonialsTitle', v)}
            as="h2"
            dark={dark}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6"
          />
          <p className="text-white/60 mt-3">Over 25 years working in IT services developing software applications and mobile apps for clients over the world.</p>
        </div>

        {/* Testimonial card */}
        <div
          className={`relative rounded-3xl p-10 mb-8 transition-all duration-500 ${dark ? 'bg-gray-900/60 border border-gray-700/60' : 'bg-white/10 backdrop-blur-md border border-white/20'
            }`}
          key={current}
        >
          <Quote className="absolute top-6 left-8 w-12 h-12 text-white/10" />
          <div className="text-center mb-8 mt-4">
            <EditableText
              value={t.quote}
              onSave={(v) => onUpdateTestimonial(t.id, 'quote', v)}
              as="blockquote"
              multiline
              dark={dark}
              className="text-lg sm:text-xl text-white font-light leading-relaxed italic"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
            <EditableText
              value={t.name}
              onSave={(v) => onUpdateTestimonial(t.id, 'name', v)}
              as="p"
              dark={dark}
              className="text-white font-bold"
            />
            <EditableText
              value={t.role}
              onSave={(v) => onUpdateTestimonial(t.id, 'role', v)}
              as="p"
              dark={dark}
              className="text-white/60 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {content.testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
