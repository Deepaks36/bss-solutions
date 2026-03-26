import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Plus, Trash2, Check } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { SiteContent, Testimonial } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
  onUpdateTestimonial: (id: string, field: keyof Testimonial, value: string) => void;
  onAddTestimonial: (testimonial: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
}

function TestimonialAddModal({ onSave, onClose, dark }: { onSave: (data: Omit<Testimonial, 'id'>) => void; onClose: () => void; dark: boolean }) {
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${dark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>Add New Testimonial</h3>
        <div className="space-y-4">
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Testimonial Quote"
            rows={4}
            className={`w-full rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Person Name"
            className={`w-full rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role / Company"
            className={`w-full rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={() => onSave({ quote, name, role })}
            disabled={!quote || !name}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ content, dark, onUpdate, onUpdateTestimonial, onAddTestimonial, onDeleteTestimonial }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [current, setCurrent] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const prev = () => setCurrent((c) => (c - 1 + content.testimonials.length) % content.testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % content.testimonials.length);

  const t = content.testimonials[current];

  const handleAdd = (data: Omit<Testimonial, 'id'>) => {
    onAddTestimonial({ ...data, id: `t${Date.now()}` });
    setIsAdding(false);
    setCurrent(content.testimonials.length); // Switch to the new one
  };

  const handleDelete = () => {
    if (content.testimonials.length <= 1) return;
    onDeleteTestimonial(t.id);
    setCurrent(0);
  };

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
          className={`text-center mb-16 transition-all duration-700 ${visible || editMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
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
        <div className="relative group">
          <div
            className={`relative rounded-3xl p-10 mb-8 transition-all duration-500 ${dark ? 'bg-gray-900/60 border border-gray-700/60' : 'bg-white/10 backdrop-blur-md border border-white/20'
              }`}
            key={current}
          >
            {editMode && content.testimonials.length > 1 && (
              <button
                onClick={handleDelete}
                className="absolute top-4 right-4 p-2 rounded-xl bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Delete Testimonial"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <Quote className="absolute top-6 left-8 w-12 h-12 text-white/10" />
            <div className="text-center mb-8 mt-4">
              <EditableText
                value={t?.quote || ''}
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
                value={t?.name || ''}
                onSave={(v) => onUpdateTestimonial(t.id, 'name', v)}
                as="p"
                dark={dark}
                className="text-white font-bold"
              />
              <EditableText
                value={t?.role || ''}
                onSave={(v) => onUpdateTestimonial(t.id, 'role', v)}
                as="p"
                dark={dark}
                className="text-white/60 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Navigation & Add */}
        <div className="flex flex-col items-center gap-8">
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

          {editMode && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all active:scale-95"
            >
              <Plus className="h-5 w-5" /> Add Testimonial
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <TestimonialAddModal
          onSave={handleAdd}
          onClose={() => setIsAdding(false)}
          dark={dark}
        />
      )}
    </section>
  );
}
