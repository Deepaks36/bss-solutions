import { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent } from '../types';


interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

export function Contact({ content, dark, onUpdate }: Props) {

  const { ref, visible } = useAnimateOnScroll(0.1);
  const [sent, setSent] = useState(false);

  const inputCls = dark
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-600';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      id="contact"
      className={`py-24 transition-colors duration-300 ${dark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <EditableText
              value={content.contactTitle}
              onSave={(v) => onUpdate('contactTitle', v)}
              as="span"
              dark={dark}
            />
          </h2>
          <div className="max-w-2xl mx-auto">
            <EditableText
              value={content.contactTagline}
              onSave={(v) => onUpdate('contactTagline', v)}
              as="p"
              dark={dark}
              className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-500'}`}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div
            className={`space-y-8 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Sales and Support Office</h3>
              <div className={`${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                <EditableText
                  value={content.contactAddress}
                  onSave={(v) => onUpdate('contactAddress', v)}
                  as="p"
                  multiline
                  dark={dark}
                />
              </div>
            </div>
            {[
              { icon: MapPin, label: 'Head Office', text: '90/2 Arun Nagar, Ponmeni, Madakulam Main Road, Madurai, India', key: '' },
              { icon: Mail, label: 'Email Us', text: content.contactEmail, key: 'contactEmail' },
              { icon: Phone, label: 'Call Us', text: content.contactPhone, key: 'contactPhone' },
            ].map(({ icon: Icon, label, text, key }) => (
              <div key={label} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-0.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
                  {key ? (
                    <EditableText
                      value={text}
                      onSave={(v) => onUpdate(key as keyof SiteContent, v)}
                      as="p"
                      dark={dark}
                      className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                    />
                  ) : (
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <form
              onSubmit={handleSubmit}
              className={`rounded-2xl border p-8 space-y-5 ${dark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {['Your Name', 'Email Address'].map((ph) => (
                  <div key={ph}>
                    <input
                      type={ph.includes('Email') ? 'email' : 'text'}
                      placeholder={ph}
                      required
                      className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Subject"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                required
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${inputCls}`}
              />
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {sent ? (
                  <>Message Sent!</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
