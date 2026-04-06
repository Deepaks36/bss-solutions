import { useState, useRef } from 'react';
import { MapPin, Mail, Phone, Send, ExternalLink, Plus, Pencil, Trash2, X, Globe } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { SiteContent, Company } from '../types';
import { useSite } from '../context/SiteContext';
import { uploadImageFile, deleteMediaFile } from '../utils/upload';


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

  const { editMode, updateSectionItemAtomic, addItemToSection, deleteItemFromSection } = useSite();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  return (
    <>
      <section
        id="companies"
        className={`py-24 transition-colors duration-300 ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              Our Global Presence
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Visit our offices around the world and see where the innovation happens.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {content.companies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                dark={dark}
                editMode={editMode}
                onView={() => setSelectedCompany(company)}
                onEdit={() => setEditingCompany(company)}
                onDelete={() => {
                  if (confirm(`Delete ${company.name}? This will also remove its gallery images.`)) {
                    company.images.forEach(img => {
                      if (img.startsWith('/assets/uploads/')) {
                        deleteMediaFile(img);
                      }
                    });
                    deleteItemFromSection('companies', company.id);
                  }
                }}
              />
            ))}

            {editMode && (
              <button
                onClick={() => setIsAddingCompany(true)}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed transition-all hover:bg-blue-50/50 hover:border-blue-500 group min-h-[300px] ${dark ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <span className={`font-bold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add New Location</span>
              </button>
            )}
          </div>
        </div>
      </section>

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
            className={`space-y-8 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'}`}
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
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'}`}
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

      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          dark={dark}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {(editingCompany || isAddingCompany) && (
        <CompanyEditModal
          company={editingCompany}
          dark={dark}
          onSave={(data) => {
            if (editingCompany) {
              updateSectionItemAtomic('companies', editingCompany.id, data);
            } else {
              addItemToSection('companies', { ...data, id: `comp-${Date.now()}` });
            }
            setEditingCompany(null);
            setIsAddingCompany(false);
          }}
          onClose={() => {
            setEditingCompany(null);
            setIsAddingCompany(false);
          }}
        />
      )}
    </>
  );
}

function CompanyCard({ company, dark, editMode, onView, onEdit, onDelete }: { 
  company: Company, 
  dark: boolean, 
  editMode: boolean, 
  onView: () => void,
  onEdit: () => void,
  onDelete: () => void
}) {
  return (
    <div 
      onClick={onView}
      className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-xl ${dark ? 'bg-gray-900 border-gray-800 hover:border-blue-500/50' : 'bg-white border-gray-100 hover:border-blue-200'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-lg font-bold mb-2 transition-colors group-hover:text-blue-600 ${dark ? 'text-white' : 'text-gray-900'}`}>{company.name}</h3>
          <div className="flex items-start gap-2 text-sm opacity-70">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
            <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{company.address}</span>
          </div>
        </div>
        
        {editMode && (
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center text-xs font-bold text-blue-600 opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        View Full Details <ExternalLink className="ml-1 w-3 h-3" />
      </div>
    </div>
  );
}

function CompanyDetailModal({ company, dark, onClose }: { company: Company, dark: boolean, onClose: () => void }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl ${dark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all sm:p-3"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 1. Large Image at Top */}
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <img 
            src={company.images[activeImage] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'} 
            alt={company.name} 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
          
          {company.images.length > 1 && (
            <div className="absolute bottom-6 right-6 flex gap-2">
              {company.images.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${activeImage === i ? 'bg-blue-600 w-8' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          )}
          
          <div className="absolute bottom-8 left-8 right-8">
             <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">{company.name}</h2>
             <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                {company.address}
             </div>
          </div>
        </div>

        {/* 2. Content Sections */}
        <div className="p-8 sm:p-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-4">About the Office</span>
                <p className={`text-lg leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{company.details}</p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-gray-800/10">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50">Email</p>
                        <p className="font-semibold">{company.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-50">Phone</p>
                        <p className="font-semibold">{company.phone}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Sidebar info? */}
            <div className={`p-8 rounded-3xl ${dark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50 border border-gray-100'}`}>
               <h4 className="font-bold mb-4 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-blue-600" /> Website
               </h4>
               <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
               >
                 Visit {company.name.split(' (')[0]} <ExternalLink className="w-4 h-4" />
               </a>
               <p className="text-xs opacity-50 mt-4 leading-relaxed">Check out our local services and solutions tailored for the {company.name.match(/\(([^)]+)\)/)?.[1] || 'region'}.</p>
            </div>
          </div>
        </div>

        {/* 3. Map at the Bottom */}
        <div className="h-[400px] w-full border-t border-gray-800/10">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

function CompanyEditModal({ company, dark, onSave, onClose }: { company: Company | null, dark: boolean, onSave: (data: Partial<Company>) => void, onClose: () => void }) {
  const [formData, setFormData] = useState<Partial<Company>>(company || {
    name: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    details: '',
    images: []
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadImageFile(file)));
      setFormData((prev: Partial<Company>) => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded]
      }));
    } catch (_e) {
      // Ignore upload failures and keep existing images.
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`relative w-full max-w-3xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] ${dark ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{company ? 'Edit Location' : 'Add New Location'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Company Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Full Address (Used for Map)</label>
              <textarea 
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Email</label>
                <input 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Phone</label>
                <input 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Short Description</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Long Details</label>
              <textarea 
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
                className={`w-full p-3 rounded-xl border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} 
                rows={4}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">Gallery Images</label>
              <input type="file" ref={fileRef} onChange={handleFile} multiple className="hidden" />
              <div className="flex gap-2 flex-wrap">
                {formData.images?.map((img: string, i: number) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setFormData((prev: Partial<Company>) => ({ ...prev, images: prev.images?.filter((_: string, idx: number) => idx !== i) }))}
                      className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-blue-50"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
          <button 
            onClick={() => {
              // Cleanup removed images from server if they were uploads
              const initialImages = company?.images || [];
              const finalImages = formData.images || [];
              initialImages.forEach(img => {
                if (img.startsWith('/assets/uploads/') && !finalImages.includes(img)) {
                  deleteMediaFile(img);
                }
              });
              onSave(formData);
            }}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            {company ? 'Update Location' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
}
