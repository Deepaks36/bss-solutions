import { useState, useEffect } from 'react';
import { Quote, Plus, Trash2, Check, Upload, Volume2, VolumeX, Pencil, X, Image as ImageIcon } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { SiteContent, Testimonial } from '../types';
import { uploadMediaFile, deleteMediaFile } from '../utils/upload';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: any) => void;
  onUpdateTestimonialAtomic: (id: string, updates: Partial<Testimonial>) => void;
  onAddTestimonial: (testimonial: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
}

function inferVideoMime(url?: string): string {
  if (!url) return '';
  const lower = url.toLowerCase();
  if (lower.endsWith('.mp4')) return 'video/mp4';
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

function TestimonialModal({
  onSave,
  onClose,
  dark,
  initialData
}: {
  onSave: (data: Omit<Testimonial, 'id'>) => void;
  onClose: () => void;
  dark: boolean;
  initialData?: Testimonial | null;
}) {
  const [quote, setQuote] = useState(initialData?.quote || '');
  const [name, setName] = useState(initialData?.name || '');
  const [role, setRole] = useState(initialData?.role || '');
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState(initialData?.videoUrl || '');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  
  const [audioOnly, setAudioOnly] = useState(initialData?.audioOnly || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!quote || !name) return;
    setSaving(true);
    try {
      let videoUrl = videoPreview;
      if (videoFile) {
        // Delete old video if it was an upload
        if (initialData?.videoUrl && initialData.videoUrl.startsWith('/assets/uploads/')) {
          await deleteMediaFile(initialData.videoUrl);
        }
        videoUrl = await uploadMediaFile(videoFile);
      }
      
      let imageUrl = imagePreview;
      if (imageFile) {
        // Delete old image if it was an upload
        if (initialData?.imageUrl && initialData.imageUrl.startsWith('/assets/uploads/')) {
          await deleteMediaFile(initialData.imageUrl);
        }
        imageUrl = await uploadMediaFile(imageFile);
      }
      
      onSave({ 
        quote, 
        name, 
        role, 
        videoUrl, 
        videoMime: videoFile?.type || initialData?.videoMime || (videoUrl ? inferVideoMime(videoUrl) : ''), 
        imageUrl,
        audioOnly 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveVideo = async () => {
    if (videoPreview && !videoFile) {
      await deleteMediaFile(videoPreview);
    }
    setVideoFile(null);
    setVideoPreview('');
  };

  const handleRemoveImage = async () => {
    if (imagePreview && !imageFile) {
      await deleteMediaFile(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        {/* Modal Header - Styled like Team Leader Modal */}
        <div className={`shrink-0 flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
          <h3 className="text-base font-black">
            {initialData ? 'Edit Testimonial' : 'Add Testimonial'}
          </h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Testimonial Quote</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What did they say?..."
              rows={4}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Person Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Role / Company</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="CEO at Company..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200/10">
            {/* Video Section */}
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Review Video</label>
              <div className="relative group/video">
                <label className={`flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm cursor-pointer transition-all ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <Upload className="h-4 w-4" />
                  {videoFile ? 'Video selected' : videoPreview ? 'Replace review video' : 'Upload review video'}
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setVideoFile(file);
                      setVideoPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {videoPreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <video src={videoPreview} controls className="max-w-full max-h-full object-contain" />
                    <button 
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-lg hover:scale-110 transition-transform"
                      title="Remove video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {videoPreview && (
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mt-2 cursor-pointer">
                  <input type="checkbox" checked={audioOnly} onChange={(e) => setAudioOnly(e.target.checked)} className="rounded border-slate-300 text-blue-600" />
                  <span className={dark ? 'text-slate-400' : 'text-slate-500'}>Start in speaker mode (audio only)</span>
                </label>
              )}
            </div>

            {/* Image Section */}
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-widest mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Review Image (Fallback)</label>
              <div className="relative group/image">
                <label className={`flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm cursor-pointer transition-all ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <ImageIcon className="h-4 w-4" />
                  {imageFile ? 'Image selected' : imagePreview ? 'Replace image' : 'Upload image'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
                {imagePreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200/10 bg-slate-50 dark:bg-slate-800 aspect-video flex items-center justify-center">
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <button 
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow-lg hover:scale-110 transition-transform"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`shrink-0 p-6 border-t flex justify-end gap-3 ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!quote || !name || saving}
            className="flex items-center gap-1.5 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            <Check className="w-4 h-4" />
            {saving ? 'Saving...' : initialData ? 'Update' : 'Add Testimonial'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  item,
  index,
  dark,
  editMode,
  onDelete,
  onEdit,
  onUpdateTestimonialAtomic
}: {
  item: Testimonial;
  index: number;
  dark: boolean;
  editMode: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: Testimonial) => void;
  onUpdateTestimonialAtomic: (id: string, updates: Partial<Testimonial>) => void;
}) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const [speakerMode, setSpeakerMode] = useState(Boolean(item.audioOnly));

  useEffect(() => {
    setSpeakerMode(Boolean(item.audioOnly));
  }, [item.audioOnly]);

  const alignClass = index % 2 === 0 ? 'self-start md:mr-auto' : 'self-end md:ml-auto';
  const sideRevealClass = index % 2 === 0 ? '-translate-x-10' : 'translate-x-10';
  const overlapClass = index === 0 ? '' : '-mt-6 md:-mt-16';

  const toggleSpeakerMode = () => {
    const next = !speakerMode;
    setSpeakerMode(next);
    onUpdateTestimonialAtomic(item.id, { audioOnly: next });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this testimonial? The associated media will also be removed.')) {
      if (item.videoUrl) await deleteMediaFile(item.videoUrl);
      if (item.imageUrl) await deleteMediaFile(item.imageUrl);
      onDelete(item.id);
    }
  };

  return (
    <div
      ref={ref}
      className={`w-full md:w-[48%] max-w-2xl ${alignClass} ${overlapClass} transition-all duration-700 ${visible || editMode ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 translate-y-10 ${sideRevealClass}`}`}
      style={{ zIndex: 10 - index }}
    >
      <div className={`relative p-6 rounded-[2rem] border overflow-hidden transition-all duration-500 hover:shadow-2xl h-full flex flex-col group/card ${dark ? 'bg-[#081028] border-white/10' : 'bg-white border-slate-100 shadow-xl'}`}>
        
        {editMode && (
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all"
              title="Edit testimonial"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 bg-red-600 text-white rounded-xl shadow-xl hover:scale-110 transition-all"
              title="Delete testimonial"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <Quote className={`absolute top-6 left-6 w-8 h-8 opacity-5 ${dark ? 'text-white' : 'text-blue-900'}`} />
        
        <div className="mb-6 mt-4 relative z-10">
          <blockquote className={`text-base sm:text-lg italic font-medium leading-relaxed ${dark ? 'text-slate-100' : 'text-slate-800'}`}>
            "{item.quote}"
          </blockquote>
        </div>

        {(item.videoUrl || item.imageUrl) && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl group/media relative aspect-video">
            {item.videoUrl ? (
              !speakerMode ? (
                <video
                  key={item.videoUrl} 
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  <source src={item.videoUrl} type={item.videoMime || inferVideoMime(item.videoUrl)} />
                  Your browser cannot play this video format.
                </video>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black flex flex-col items-center justify-center gap-6">
                  <div className="p-6 rounded-full bg-blue-600/20 animate-pulse">
                    <Volume2 className="h-10 w-10 text-blue-500" />
                  </div>
                  <audio src={item.videoUrl} controls autoPlay className="w-4/5" />
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Speaker Mode Active</p>
                </div>
              )
            ) : (
              <img 
                src={item.imageUrl} 
                alt={`${item.name}'s testimonial`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg`}>
              {item.name.charAt(0)}
            </div>
            <div>
              <h4 className={`font-black text-base tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-blue-400' : 'text-blue-600'}`}>{item.role}</p>
            </div>
          </div>

          {item.videoUrl && (
            <button
              onClick={toggleSpeakerMode}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${dark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              title="Toggle speaker mode"
            >
              {speakerMode ? <VolumeX className="h-3.5 w-3.5 text-blue-500" /> : <Volume2 className="h-3.5 w-3.5" />}
              {speakerMode ? 'Audio' : 'Video + audio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ content, dark, onUpdate, onUpdateTestimonialAtomic, onAddTestimonial, onDeleteTestimonial }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);
  const { editMode } = useSite();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const handleAdd = (data: Omit<Testimonial, 'id'>) => {
    onAddTestimonial({ ...data, id: `t${Date.now()}` });
    setIsAdding(false);
  };

  const handleSaveEdit = (data: Omit<Testimonial, 'id'>) => {
    if (editingTestimonial) {
      onUpdateTestimonialAtomic(editingTestimonial.id, data);
      setEditingTestimonial(null);
    }
  };

  return (
    <section
      id="testimonials"
      className={`py-28 relative overflow-hidden transition-colors duration-500 ${dark
        ? 'bg-[#040816]'
        : 'bg-[#1e3a8a]'
        }`}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full blur-[120px] mix-blend-screen opacity-10 animate-pulse ${dark ? 'bg-blue-900' : 'bg-blue-200'}`} />
        <div className={`absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-[120px] mix-blend-screen opacity-10 animate-pulse ${dark ? 'bg-indigo-900' : 'bg-indigo-200'}`} style={{ animationDelay: '2s' }} />
        
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${dark ? 'white' : 'black'} 1.5px, transparent 0)`, 
            backgroundSize: '48px 48px',
          }} 
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-24 transition-all duration-1000 ${visible || editMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 mb-6 group cursor-pointer hover:bg-blue-500/20 transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <EditableText
              value={content.testimonialsTagline}
              onSave={(v) => onUpdate('testimonialsTagline', v)}
              as="span"
              dark={dark}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500"
            />
          </div>
          <div className="max-w-4xl mx-auto">
            <EditableText
              value={content.testimonialsTitle}
              onSave={(v) => onUpdate('testimonialsTitle', v)}
              as="h2"
              dark={dark}
              className={`text-4xl sm:text-6xl font-black tracking-tighter mb-8 leading-[0.9] ${dark ? 'text-white' : 'text-slate-950'}`}
            />
          </div>
          <p className={`text-base sm:text-lg font-medium max-w-2xl mx-auto ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Over 25 years working in IT services developing software applications and mobile apps for clients over the world.
          </p>
        </div>

        <div className="max-h-[850px] overflow-y-auto overflow-x-hidden px-4 py-12 no-scrollbar scroll-smooth">
          <div className="flex flex-col gap-16">
            {content.testimonials.length > 0 ? (
              content.testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  item={testimonial}
                  index={index}
                  dark={dark}
                  editMode={editMode}
                  onDelete={onDeleteTestimonial}
                  onEdit={setEditingTestimonial}
                  onUpdateTestimonialAtomic={onUpdateTestimonialAtomic}
                />
              ))
            ) : (
              <div className={`text-center py-20 border-2 border-dashed rounded-[3rem] ${dark ? 'border-white/5 text-slate-700' : 'border-slate-100 text-slate-300'}`}>
                <p className="font-black uppercase tracking-widest">No testimonials shared yet</p>
              </div>
            )}
          </div>
        </div>

        {editMode && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" /> Add New Testimonial
            </button>
          </div>
        )}
      </div>

      {(isAdding || editingTestimonial) && (
        <TestimonialModal
          onSave={isAdding ? handleAdd : handleSaveEdit}
          onClose={() => {
            setIsAdding(false);
            setEditingTestimonial(null);
          }}
          dark={dark}
          initialData={editingTestimonial}
        />
      )}
    </section>
  );
}
