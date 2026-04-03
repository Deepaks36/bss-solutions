import { useRef, useState } from 'react';
import { Quote, Plus, Trash2, Check, Upload, Volume2, VolumeX } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { EditableText } from './EditableText';
import { useSite } from '../context/SiteContext';
import { SiteContent, Testimonial } from '../types';
import { uploadMediaFile } from '../utils/upload';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
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
  return '';
}

function TestimonialAddModal({ onSave, onClose, dark }: { onSave: (data: Omit<Testimonial, 'id'>) => void; onClose: () => void; dark: boolean }) {
  const [quote, setQuote] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!quote || !name) return;
    setSaving(true);
    try {
      let videoUrl = '';
      if (videoFile) {
        videoUrl = await uploadMediaFile(videoFile);
      }
      onSave({ quote, name, role, videoUrl, videoMime: videoFile?.type || '', audioOnly });
    } finally {
      setSaving(false);
    }
  };

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
          <label className={`flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm cursor-pointer ${dark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            <Upload className="h-4 w-4" />
            {videoFile ? 'Video selected' : 'Upload review video'}
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
            <video src={videoPreview} controls className="w-full max-h-56 rounded-xl bg-black object-contain" />
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={audioOnly} onChange={(e) => setAudioOnly(e.target.checked)} />
            <span className={dark ? 'text-gray-300' : 'text-gray-700'}>Start in speaker mode (audio only)</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!quote || !name || saving}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Add'}
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
  onUpdateTestimonialAtomic
}: {
  item: Testimonial;
  index: number;
  dark: boolean;
  editMode: boolean;
  onDelete: (id: string) => void;
  onUpdateTestimonialAtomic: (id: string, updates: Partial<Testimonial>) => void;
}) {
  const { ref, visible } = useAnimateOnScroll(0.2);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [speakerMode, setSpeakerMode] = useState(Boolean(item.audioOnly));
  const [uploading, setUploading] = useState(false);

  const alignClass = index % 2 === 0 ? 'self-start md:mr-auto' : 'self-end md:ml-auto';
  const sideRevealClass = index % 2 === 0 ? '-translate-x-10' : 'translate-x-10';
  const overlapClass = index === 0 ? '' : '-mt-6 md:-mt-16';

  const handleVideoUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const videoPath = await uploadMediaFile(file);
      // Use atomic update to set both URL and Mime at once to prevent race conditions
      onUpdateTestimonialAtomic(item.id, {
        videoUrl: videoPath,
        videoMime: file.type || inferVideoMime(videoPath)
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleSpeakerMode = () => {
    const next = !speakerMode;
    setSpeakerMode(next);
    onUpdateTestimonialAtomic(item.id, { audioOnly: next });
  };

  return (
    <div
      ref={ref}
      className={`w-full md:w-[48%] max-w-2xl ${alignClass} ${overlapClass} transition-all duration-700 ${visible || editMode ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 translate-y-10 ${sideRevealClass}`}`}
      style={{ zIndex: 10 - index }}
    >
      <div className={`relative rounded-3xl p-6 sm:p-8 shadow-2xl ${dark ? 'bg-gray-900/80 border border-cyan-900/50' : 'bg-white/12 backdrop-blur-xl border border-white/30'}`}>
        {editMode && (
          <button
            onClick={() => onDelete(item.id)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-red-600 text-white transition-opacity shadow-lg"
            title="Delete Testimonial"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        <Quote className="absolute top-6 left-6 w-10 h-10 text-white/10" />
        <div className="mb-6 mt-3">
          <EditableText
            value={item.quote || ''}
            onSave={(v) => onUpdateTestimonialAtomic(item.id, { quote: v })}
            as="blockquote"
            multiline
            dark={dark}
            className="text-lg text-white font-light leading-relaxed italic"
          />
        </div>

        {item.videoUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/20 bg-black/80 shadow-inner group/video relative">
            {!speakerMode ? (
              <video
                key={item.videoUrl} // Force re-render when URL changes
                controls
                playsInline
                preload="metadata"
                className="w-full max-h-[28rem] rounded-xl object-contain bg-black shadow-2xl"
              >
                {item.videoMime && <source src={item.videoUrl} type={item.videoMime} />}
                <source src={item.videoUrl} type={inferVideoMime(item.videoUrl)} />
                <source src={item.videoUrl} />
                Your browser cannot play this video format.
              </video>
            ) : (
              <div className="p-6 bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-center gap-4">
                <div className="p-4 rounded-full bg-white/10 animate-pulse">
                  <Volume2 className="h-8 w-8 text-blue-400" />
                </div>
                <audio src={item.videoUrl} controls autoPlay className="w-full" />
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Speaker Mode Active</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div>
            <EditableText
              value={item.name || ''}
              onSave={(v) => onUpdateTestimonialAtomic(item.id, { name: v })}
              as="p"
              dark={dark}
              className="text-white font-bold"
            />
            <EditableText
              value={item.role || ''}
              onSave={(v) => onUpdateTestimonialAtomic(item.id, { role: v })}
              as="p"
              dark={dark}
              className="text-white/60 text-sm"
            />
          </div>

          {item.videoUrl && (
            <button
              onClick={toggleSpeakerMode}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              title="Toggle speaker mode"
            >
              {speakerMode ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {speakerMode ? 'Audio only' : 'Video + audio'}
            </button>
          )}
        </div>

        {editMode && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : item.videoUrl ? 'Replace video' : 'Upload video'}
            </button>
            {item.videoUrl && (
              <button
                onClick={() => {
                  onUpdateTestimonialAtomic(item.id, { videoUrl: '', videoMime: '' });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/40 bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30"
              >
                Remove video
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={(e) => handleVideoUpload(e.target.files?.[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function Testimonials({ content, dark, onUpdate, onUpdateTestimonialAtomic, onAddTestimonial, onDeleteTestimonial }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.1);
  const { editMode } = useSite();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (data: Omit<Testimonial, 'id'>) => {
    onAddTestimonial({ ...data, id: `t${Date.now()}` });
    setIsAdding(false);
  };

  return (
    <section
      id="testimonials"
      className={`py-28 relative overflow-hidden transition-colors duration-500 ${dark
        ? 'bg-[#040816]'
        : 'bg-[#1e3a8a]'
        }`}
    >
      {/* Premium Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic mesh gradients */}
        <div className={`absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full blur-[120px] mix-blend-screen opacity-20 animate-pulse ${dark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full blur-[120px] mix-blend-screen opacity-20 animate-pulse ${dark ? 'bg-cyan-600' : 'bg-cyan-400'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[50%] h-[50%] rounded-full blur-[150px] mix-blend-overlay opacity-10 ${dark ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
        
        {/* Refined Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, ${dark ? 'white' : '#000'} 1.5px, transparent 0)`, 
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }} 
        />

        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${dark ? 'white' : 'black'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'white' : 'black'} 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="flex flex-col gap-8">
          {content.testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              item={testimonial}
              index={index}
              dark={dark}
              editMode={editMode}
              onDelete={onDeleteTestimonial}
              onUpdateTestimonialAtomic={onUpdateTestimonialAtomic}
            />
          ))}
        </div>

        {editMode && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all active:scale-95"
            >
              <Plus className="h-5 w-5" /> Add Testimonial
            </button>
          </div>
        )}
        {!content.testimonials.length && !editMode && (
          <div className="text-center text-white/70">
            No testimonials available.
          </div>
        )}
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
