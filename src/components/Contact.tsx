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
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const inputCls = dark
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-600';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    setError('');

    try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log('Server response:', data);

        if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setShowPopup(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${inputCls}`}
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all ${inputCls}`}
              />
              <button
                type="submit"
                disabled={loading || sent}
                className={`w-full py-4 rounded-xl text-white font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                  sent 
                  ? 'bg-emerald-500 shadow-emerald-500/25' 
                  : loading 
                    ? 'bg-blue-400 cursor-not-allowed shadow-blue-400/25' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-600/25'
                }`}
              >
                {loading ? (
                  <>Sending...</>
                ) : sent ? (
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
      
      {showPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
          <div className={`relative w-full max-w-sm p-6 text-center rounded-3xl shadow-2xl ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
              <Send className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-black mb-2">Message Sent!</h3>
            <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Thank you for reaching out. We have received your message and will get back to you shortly.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg active:scale-95"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}
