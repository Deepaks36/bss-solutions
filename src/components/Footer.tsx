import { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Mail, Phone, ChevronRight, Pencil, X, Check } from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface FooterData {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  copyright: string;
}

const DEFAULT: FooterData = {
  company_name: 'Brilliant Systems',
  tagline: 'We transform ambitious ideas into thriving digital products. With 25+ years of combined expertise, we deliver enterprise-grade IT solutions tailored to scale globally.',
  phone: '+91-452 238 7388',
  whatsapp: '914522387388',
  email: 'info@bsyssolutions.com',
  address: '90/2 Arun Nagar, Ponmeni, Madurai, India.',
  facebook: 'https://www.facebook.com/brilliantsystemssolutions/',
  twitter: 'https://twitter.com/bsspl_india',
  linkedin: 'https://www.linkedin.com/company/brilliant-systems-solutions/',
  instagram: '#',
  copyright: 'Brilliant System Solutions Pvt Ltd. All rights reserved.',
};

const services = [
  'Custom Solutions', 'Web Development', 'Mobile Apps',
  'Tech Consulting', 'ERP Implementations', 'HR & Payroll',
];

function FooterEditModal({ data, onSave, onClose, dark }: {
  data: FooterData;
  onSave: (d: FooterData) => void;
  onClose: () => void;
  dark: boolean;
}) {
  const [form, setForm] = useState<FooterData>(data);
  const set = (k: keyof FooterData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls = `w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900'}`;
  const labelCls = `block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Edit Footer</h3>
          <button onClick={onClose} className={`rounded-full p-2 transition-all hover:rotate-90 ${dark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Company Name</label>
              <input value={form.company_name} onChange={set('company_name')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input value={form.phone} onChange={set('phone')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number <span className="normal-case text-blue-500">(digits only, with country code)</span></label>
              <input value={form.whatsapp} onChange={set('whatsapp')} placeholder="914522387388" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={form.email} onChange={set('email')} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Address</label>
            <input value={form.address} onChange={set('address')} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Tagline</label>
            <textarea value={form.tagline} onChange={set('tagline')} rows={2} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Copyright Text</label>
            <input value={form.copyright} onChange={set('copyright')} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Facebook URL</label>
              <input value={form.facebook} onChange={set('facebook')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Twitter URL</label>
              <input value={form.twitter} onChange={set('twitter')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>LinkedIn URL</label>
              <input value={form.linkedin} onChange={set('linkedin')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input value={form.instagram} onChange={set('instagram')} className={inputCls} />
            </div>
          </div>
        </div>

        <div className={`sticky bottom-0 flex gap-3 px-6 py-4 border-t ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-100'}`}>
          <button onClick={onClose} className={`flex-1 rounded-xl py-3 text-sm font-black transition-all ${dark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-black text-white hover:bg-blue-700 transition-all"
          >
            <Check className="h-4 w-4" /> Save Footer
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  dark: boolean;
}

export function Footer({ dark }: Props) {
  const { editMode, isAdmin } = useSite();
  const [footer, setFooter] = useState<FooterData>(DEFAULT);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/footer')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setFooter(d); })
      .catch(() => {});
  }, []);

  const handleSave = async (data: FooterData) => {
    setSaving(true);
    try {
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setFooter(data);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  // Build WhatsApp URL — strip non-digits just in case
  const waNumber = footer.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}`;

  const linkCls = `group flex items-center gap-2 text-sm transition-all duration-300 ${dark ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-white'}`;

  const socials = [
    { Icon: Facebook, href: footer.facebook },
    { Icon: Twitter,  href: footer.twitter  },
    { Icon: Linkedin, href: footer.linkedin  },
    { Icon: Instagram,href: footer.instagram },
  ];

  return (
    <>
      <footer className={`relative pt-24 pb-12 overflow-hidden border-t ${dark ? 'bg-[#0A0F1C] border-white/5' : 'bg-slate-950 border-slate-900'}`}>
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
          <div className="w-[1000px] h-[300px] bg-gradient-to-b from-blue-600/20 to-transparent blur-3xl rounded-full -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Edit button — only in edit mode */}
          {isAdmin && editMode && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 transition-all shadow-lg"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit Footer
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            {/* Brand */}
            <div className="lg:col-span-4">
              <a href="#home" className="inline-block mb-6 group">
                <div className="flex items-center gap-3">
                  <img
                    src="https://bsyssolutions.com/wp-content/uploads/2022/11/BSS-Logo.jpg"
                    alt="BSS Logo"
                    className="h-10 w-auto rounded-lg shadow-xl shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="text-xl font-black tracking-tight text-white">{footer.company_name}</span>
                </div>
              </a>
              <p className="text-sm leading-relaxed mb-8 max-w-sm text-slate-400">{footer.tagline}</p>
              <div className="flex gap-4">
                {socials.map(({ Icon, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-1" />

            {/* Links */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
              {/* Company */}
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent inline-block">Company</h4>
                <ul className="space-y-4">
                  {['Who We Are', 'Success Stories', 'BSS Events', 'Career', 'Contact Us'].map(item => (
                    <li key={item}>
                      <a href="#" className={linkCls}>
                        <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expertise */}
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent inline-block">Expertise</h4>
                <ul className="space-y-4">
                  {services.map(s => (
                    <li key={s}>
                      <a href="#" className={linkCls}>
                        <ChevronRight className="w-3 h-3 text-emerald-500 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent inline-block">Reach Out</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 group items-start">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 group-hover:bg-rose-500 group-hover:border-rose-500 transition-colors">
                      <MapPin className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm leading-relaxed pt-1 text-slate-400">{footer.address}</span>
                  </li>
                  <li className="flex gap-3 group items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                      <Phone className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <a href={`tel:${footer.phone}`} className="text-sm text-slate-400 hover:text-white transition-colors">{footer.phone}</a>
                  </li>
                  <li className="flex gap-3 group items-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors">
                      <Mail className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" />
                    </div>
                    <a href={`mailto:${footer.email}`} className="text-sm text-slate-400 hover:text-white transition-colors">{footer.email}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Cookies Policy</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[150] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-green-500/40 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.783 6.86L2 30l7.347-1.763A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.594l-.418-.248-4.36 1.047 1.074-4.25-.272-.435A11.46 11.46 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.345-.172-2.04-1.006-2.356-1.12-.316-.115-.546-.172-.776.172-.23.345-.89 1.12-1.09 1.35-.2.23-.4.258-.745.086-.345-.172-1.456-.537-2.773-1.71-1.025-.913-1.717-2.04-1.918-2.385-.2-.345-.021-.531.15-.703.155-.155.345-.402.517-.603.172-.2.23-.345.345-.575.115-.23.057-.431-.029-.603-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.59l-.66-.011c-.23 0-.603.086-.918.431-.316.345-1.205 1.178-1.205 2.872s1.234 3.33 1.406 3.56c.172.23 2.428 3.71 5.882 5.203.822.355 1.463.567 1.963.726.824.263 1.574.226 2.167.137.66-.099 2.04-.834 2.328-1.638.287-.804.287-1.493.2-1.638-.086-.144-.316-.23-.66-.402z"/>
        </svg>
      </a>

      {/* Edit modal */}
      {editing && (
        <FooterEditModal
          data={footer}
          dark={dark}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}

      {saving && (
        <div className="fixed bottom-24 left-6 z-[200] bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
          Saving…
        </div>
      )}
    </>
  );
}
