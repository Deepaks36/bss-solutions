import { useState, useRef } from 'react';
import { ArrowRight, Check, CheckCircle2, ImagePlus, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { HomeHighlight, HomeProofItem, HomeStat, SiteContent } from '../types';
import { useSite } from '../context/SiteContext';

interface Props {
  content: SiteContent;
  dark: boolean;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

const defaultHeroImage = '/src/assets/images/hero/hero-main.jpg';

const defaultHighlights: HomeHighlight[] = [
  { id: 'hh1', label: 'Enterprise HR platforms' },
  { id: 'hh2', label: 'Cloud-native product engineering' },
  { id: 'hh3', label: 'AI-driven workflow automation' },
];

const defaultStats: HomeStat[] = [
  { id: 'hs1', value: '4.9/5', label: 'Client rating' },
  { id: 'hs2', value: '60+', label: 'Team members' },
  { id: 'hs3', value: '200+', label: 'Projects done' },
];

const defaultProofItems: HomeProofItem[] = [
  { id: 'hp1', label: 'HR Metrics' },
  { id: 'hp2', label: 'BSOL ERP Suite' },
  { id: 'hp3', label: 'AI Chatbot' },
  { id: 'hp4', label: 'Knowledgebase AI' },
];

function HomeEditModal({
  content,
  dark,
  onClose,
  onSave,
}: {
  content: SiteContent;
  dark: boolean;
  onClose: () => void;
  onSave: (data: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroStat: string;
    heroCenterBadgeLabel?: string;
    heroImage: string;
    heroTopLeftImage?: string;
    heroTopLeftBadgeTop?: string;
    heroTopLeftBadgeBottom?: string;
    heroBottomRightImage?: string;
    heroBottomRightBadgeTop?: string;
    heroBottomRightBadgeBottom?: string;
    heroHighlights: HomeHighlight[];
    heroStats: HomeStat[];
    heroProofItems: HomeProofItem[];
  }) => void;
}) {
  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(content.heroSubtitle);
  const [heroCta, setHeroCta] = useState(content.heroCta);
  const [heroStat, setHeroStat] = useState(content.heroStat);
  const [heroCenterBadgeLabel, setHeroCenterBadgeLabel] = useState(content.heroCenterBadgeLabel || 'Trusted Leaders');
  const [heroImage, setHeroImage] = useState(content.heroImage || defaultHeroImage);
  const [heroTopLeftImage, setHeroTopLeftImage] = useState(content.heroTopLeftImage || '/src/assets/images/hero/hero-top-left.jpg');
  const [heroTopLeftBadgeTop, setHeroTopLeftBadgeTop] = useState(content.heroTopLeftBadgeTop || 'Growth rate');
  const [heroTopLeftBadgeBottom, setHeroTopLeftBadgeBottom] = useState(content.heroTopLeftBadgeBottom || '+340% Velocity');
  const [heroBottomRightImage, setHeroBottomRightImage] = useState(content.heroBottomRightImage || '/src/assets/images/hero/hero-bottom-right.jpg');
  const [heroBottomRightBadgeTop, setHeroBottomRightBadgeTop] = useState(content.heroBottomRightBadgeTop || 'System Status');
  const [heroBottomRightBadgeBottom, setHeroBottomRightBadgeBottom] = useState(content.heroBottomRightBadgeBottom || '100% Uptime Guaranteed');

  const [heroHighlights, setHeroHighlights] = useState<HomeHighlight[]>(content.heroHighlights?.length ? content.heroHighlights : defaultHighlights);
  const [heroStats, setHeroStats] = useState<HomeStat[]>(content.heroStats?.length ? content.heroStats : defaultStats);
  const [heroProofItems, setHeroProofItems] = useState<HomeProofItem[]>(content.heroProofItems?.length ? content.heroProofItems : defaultProofItems);
  const [newHighlight, setNewHighlight] = useState('');
  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newProofItem, setNewProofItem] = useState('');

  const mainImageRef = useRef<HTMLInputElement>(null);
  const topLeftImageRef = useRef<HTMLInputElement>(null);
  const bottomRightImageRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined, setter: (val: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setter(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateHighlight = (id: string, label: string) => {
    setHeroHighlights((items) => items.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const updateStat = (id: string, field: 'value' | 'label', value: string) => {
    setHeroStats((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateProofItem = (id: string, label: string) => {
    setHeroProofItems((items) => items.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border p-6 shadow-2xl ${dark ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-white'}`}>
        <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-inherit pb-3">
          <h3 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Edit Home Section</h3>
          <button onClick={onClose} className={`rounded-xl p-2 transition-colors ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Headline</label>
              <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Subtitle</label>
              <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={4} className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>CTA label</label>
                <input value={heroCta} onChange={(e) => setHeroCta(e.target.value)} className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
              </div>
            </div>

            <div className={`mt-6 rounded-2xl border p-4 ${dark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
              <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Center Card</h4>
              <div className="space-y-4">
                <input ref={mainImageRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], setHeroImage)} className="hidden" />
                <button
                  onClick={() => mainImageRef.current?.click()}
                  className={`flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${dark ? 'border-slate-600 hover:border-blue-500' : 'border-slate-300 hover:border-blue-500'}`}
                >
                  {heroImage ? <img src={heroImage} alt="Center Hero preview" className={`h-full w-full object-contain ${dark ? 'bg-black/30' : 'bg-slate-100'}`} /> : <><ImagePlus className="h-6 w-6" /><span className="ml-2 text-sm font-medium">Upload Image</span></>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={heroCenterBadgeLabel} onChange={(e) => setHeroCenterBadgeLabel(e.target.value)} placeholder="Badge label" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                  <input value={heroStat} onChange={(e) => setHeroStat(e.target.value)} placeholder="Badge value" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-2xl border p-4 ${dark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
              <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Top-Left Card</h4>
              <div className="space-y-4">
                <input ref={topLeftImageRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], setHeroTopLeftImage)} className="hidden" />
                <button
                  onClick={() => topLeftImageRef.current?.click()}
                  className={`flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${dark ? 'border-slate-600 hover:border-blue-500' : 'border-slate-300 hover:border-blue-500'}`}
                >
                  {heroTopLeftImage ? <img src={heroTopLeftImage} alt="Top Left" className={`h-full w-full object-contain ${dark ? 'bg-black/30' : 'bg-slate-100'}`} /> : <span className="text-sm">Upload Image</span>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={heroTopLeftBadgeTop} onChange={(e) => setHeroTopLeftBadgeTop(e.target.value)} placeholder="Badge label" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                  <input value={heroTopLeftBadgeBottom} onChange={(e) => setHeroTopLeftBadgeBottom(e.target.value)} placeholder="Badge value" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                </div>
              </div>
            </div>

            <div className={`mt-6 rounded-2xl border p-4 ${dark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
              <h4 className={`mb-4 text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Bottom-Right Card</h4>
              <div className="space-y-4">
                <input ref={bottomRightImageRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], setHeroBottomRightImage)} className="hidden" />
                <button
                  onClick={() => bottomRightImageRef.current?.click()}
                  className={`flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${dark ? 'border-slate-600 hover:border-blue-500' : 'border-slate-300 hover:border-blue-500'}`}
                >
                  {heroBottomRightImage ? <img src={heroBottomRightImage} alt="Bottom Right" className={`h-full w-full object-contain ${dark ? 'bg-black/30' : 'bg-slate-100'}`} /> : <span className="text-sm">Upload Image</span>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <input value={heroBottomRightBadgeTop} onChange={(e) => setHeroBottomRightBadgeTop(e.target.value)} placeholder="Badge label" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                  <input value={heroBottomRightBadgeBottom} onChange={(e) => setHeroBottomRightBadgeBottom(e.target.value)} placeholder="Badge value" className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-600 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-900'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className={`text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Highlights</h4>
                <div className="flex gap-2">
                  <input value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Add highlight" className={`w-40 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                  <button onClick={() => { if (!newHighlight.trim()) return; setHeroHighlights((items) => [...items, { id: `hh-${Date.now()}`, label: newHighlight.trim() }]); setNewHighlight(''); }} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {heroHighlights.map((item) => (
                  <div key={item.id} className={`flex items-center gap-2 rounded-2xl border p-3 ${dark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                    <input value={item.label} onChange={(e) => updateHighlight(item.id, e.target.value)} className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                    <button onClick={() => setHeroHighlights((items) => items.filter((entry) => entry.id !== item.id))} className="rounded-lg bg-red-600 p-2 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className={`text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Stats cards</h4>
                <div className="flex gap-2">
                  <input value={newStatValue} onChange={(e) => setNewStatValue(e.target.value)} placeholder="Value" className={`w-24 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                  <input value={newStatLabel} onChange={(e) => setNewStatLabel(e.target.value)} placeholder="Label" className={`w-32 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                  <button onClick={() => { if (!newStatValue.trim() || !newStatLabel.trim()) return; setHeroStats((items) => [...items, { id: `hs-${Date.now()}`, value: newStatValue.trim(), label: newStatLabel.trim() }]); setNewStatValue(''); setNewStatLabel(''); }} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {heroStats.map((item) => (
                  <div key={item.id} className={`flex items-center gap-2 rounded-2xl border p-3 ${dark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                    <input value={item.value} onChange={(e) => updateStat(item.id, 'value', e.target.value)} className={`w-28 rounded-lg border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                    <input value={item.label} onChange={(e) => updateStat(item.id, 'label', e.target.value)} className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                    <button onClick={() => setHeroStats((items) => items.filter((entry) => entry.id !== item.id))} className="rounded-lg bg-red-600 p-2 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className={`text-sm font-black uppercase tracking-wider ${dark ? 'text-white' : 'text-slate-900'}`}>Proof items</h4>
                <div className="flex gap-2">
                  <input value={newProofItem} onChange={(e) => setNewProofItem(e.target.value)} placeholder="Add proof item" className={`w-44 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                  <button onClick={() => { if (!newProofItem.trim()) return; setHeroProofItems((items) => [...items, { id: `hp-${Date.now()}`, label: newProofItem.trim() }]); setNewProofItem(''); }} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {heroProofItems.map((item) => (
                  <div key={item.id} className={`flex items-center gap-2 rounded-2xl border p-3 ${dark ? 'border-slate-700 bg-slate-800/70' : 'border-slate-200 bg-slate-50'}`}>
                    <input value={item.label} onChange={(e) => updateProofItem(item.id, e.target.value)} className={`flex-1 rounded-lg border px-3 py-2 text-sm outline-none ${dark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
                    <button onClick={() => setHeroProofItems((items) => items.filter((entry) => entry.id !== item.id))} className="rounded-lg bg-red-600 p-2 text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 flex items-center justify-end gap-3 border-t pt-6 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button onClick={onClose} className={`rounded-xl px-4 py-2 text-sm font-medium ${dark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
            Cancel
          </button>
          <button
            onClick={() => onSave({ heroTitle, heroSubtitle, heroCta, heroStat, heroCenterBadgeLabel, heroImage, heroTopLeftImage, heroTopLeftBadgeTop, heroTopLeftBadgeBottom, heroBottomRightImage, heroBottomRightBadgeTop, heroBottomRightBadgeBottom, heroHighlights, heroStats, heroProofItems })}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Save Home Section
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hero({ content, dark, onUpdate }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.12);
  const { editMode } = useSite();
  const [isEditing, setIsEditing] = useState(false);

  const heroHighlights = content.heroHighlights?.length ? content.heroHighlights : defaultHighlights;
  const heroStats = content.heroStats?.length ? content.heroStats : defaultStats;
  const heroProofItems = content.heroProofItems?.length ? content.heroProofItems : defaultProofItems;
  const heroImage = content.heroImage || defaultHeroImage;

  const saveHeroContent = (data: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroStat: string;
    heroCenterBadgeLabel?: string;
    heroImage: string;
    heroTopLeftImage?: string;
    heroTopLeftBadgeTop?: string;
    heroTopLeftBadgeBottom?: string;
    heroBottomRightImage?: string;
    heroBottomRightBadgeTop?: string;
    heroBottomRightBadgeBottom?: string;
    heroHighlights: HomeHighlight[];
    heroStats: HomeStat[];
    heroProofItems: HomeProofItem[];
  }) => {
    onUpdate('heroTitle', data.heroTitle);
    onUpdate('heroSubtitle', data.heroSubtitle);
    onUpdate('heroCta', data.heroCta);
    onUpdate('heroStat', data.heroStat);
    onUpdate('heroCenterBadgeLabel', data.heroCenterBadgeLabel || '');
    onUpdate('heroImage', data.heroImage);
    onUpdate('heroTopLeftImage', data.heroTopLeftImage || '');
    onUpdate('heroTopLeftBadgeTop', data.heroTopLeftBadgeTop || '');
    onUpdate('heroTopLeftBadgeBottom', data.heroTopLeftBadgeBottom || '');
    onUpdate('heroBottomRightImage', data.heroBottomRightImage || '');
    onUpdate('heroBottomRightBadgeTop', data.heroBottomRightBadgeTop || '');
    onUpdate('heroBottomRightBadgeBottom', data.heroBottomRightBadgeBottom || '');
    onUpdate('heroHighlights', data.heroHighlights as any);
    onUpdate('heroStats', data.heroStats as any);
    onUpdate('heroProofItems', data.heroProofItems as any);
    setIsEditing(false);
  };

  return (
    <section
      id="home"
      className={`relative pt-32 pb-16 lg:pt-40 lg:pb-24 transition-colors duration-300 ${dark ? 'bg-[#0A0F1C] text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Background subtleties */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Content Column */}
          <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              Empowering Enterprises Digitally
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>
              {content.heroTitle}
            </h1>

            <p className={`mt-6 max-w-lg text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              {content.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40"
              >
                {content.heroCta}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className={`inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 px-8 text-sm font-bold transition-all ${dark
                  ? 'border-slate-700 bg-transparent text-slate-300 hover:border-slate-500 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  }`}
              >
                View Solutions
              </button>
            </div>

            {/* Feature Highlights */}
            <div className={`mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t pt-8 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
              {heroHighlights.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-5 w-5 ${dark ? 'text-blue-500' : 'text-blue-600'}`} />
                  <span className={`text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Column */}
          <div className={`relative h-[550px] sm:h-[600px] lg:h-[650px] w-full transition-all duration-1000 delay-200 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            <style>{`
              @keyframes floatY {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
              .animate-float-1 { animation: floatY 6s ease-in-out infinite; }
              .animate-float-2 { animation: floatY 7s ease-in-out infinite 1.5s; }
              .animate-float-3 { animation: floatY 8s ease-in-out infinite 3s; }
            `}</style>

            {/* Top Left Card */}
            <div className="absolute top-4 left-0 w-[40%] md:w-[38%] z-10 hidden lg:block">
              <div className={`animate-float-1 relative rounded-[2rem] border-8 p-1 sm:p-2 shadow-2xl ${dark ? 'border-slate-800/80 bg-slate-900/80 shadow-blue-900/30' : 'border-white/80 bg-white/80 shadow-slate-200/60 backdrop-blur-sm'}`}>
                <div className="relative aspect-[4/5] sm:aspect-[4/4] w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={content.heroTopLeftImage || "/src/assets/images/hero/hero-top-left.jpg"}
                    alt="Teamwork"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-3 right-3 text-white">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 font-bold mb-0.5">{content.heroTopLeftBadgeTop || 'Growth rate'}</p>
                    <p className="text-[13px] sm:text-sm font-black leading-tight">{content.heroTopLeftBadgeBottom || '+340% Velocity'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="absolute bottom-4 right-0 w-[40%] md:w-[38%] z-10 hidden lg:block">
              <div className={`animate-float-3 relative rounded-[2rem] border-8 p-1 sm:p-2 shadow-2xl ${dark ? 'border-slate-800/80 bg-slate-900/80 shadow-blue-900/30' : 'border-white/80 bg-white/80 shadow-slate-200/60 backdrop-blur-sm'}`}>
                <div className="relative aspect-[4/5] sm:aspect-[4/4] w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={content.heroBottomRightImage || "/src/assets/images/hero/hero-bottom-right.jpg"}
                    alt="Technology"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-300 font-bold">{content.heroBottomRightBadgeTop || 'System Status'}</p>
                    </div>
                    <p className="text-[13px] sm:text-sm font-black leading-tight">{content.heroBottomRightBadgeBottom || '100% Uptime Guaranteed'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Main Card (using heroImage) */}
            <div className="absolute top-1/2 left-1/2 w-[70%] sm:w-[50%] lg:w-[42%] -translate-x-1/2 -translate-y-1/2 z-20">
              <div className={`animate-float-2 relative rounded-[2rem] border-8 p-1 sm:p-2 shadow-2xl ${dark ? 'border-slate-800/80 bg-slate-900/80 shadow-blue-900/40' : 'border-white/80 bg-white/80 shadow-xl shadow-slate-200/80 backdrop-blur-md'}`}>
                <div className="relative aspect-[4/5] sm:aspect-[4/4] w-full overflow-hidden rounded-[1.25rem]">
                  <img
                    src={heroImage}
                    alt="Corporate Technology"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Perfectly Integrated Trust Badge */}
                  <div className="absolute bottom-4 left-3 right-3 text-white">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                        <Check className="h-3 w-3" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-blue-300 font-black leading-tight">
                        {content.heroCenterBadgeLabel || 'Trusted Leaders'}
                      </p>
                    </div>
                    <p className="text-xs sm:text-[15px] font-black leading-snug sm:leading-tight line-clamp-2">
                      {content.heroStat}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stats & Proof Ribbon */}
        <div className={`mt-24 lg:mt-32 grid gap-6 rounded-3xl border p-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${dark ? 'border-slate-800 bg-slate-900/50 backdrop-blur-md' : 'border-slate-200 bg-white/60 shadow-xl shadow-slate-200/50 backdrop-blur-md'}`}>
          {heroStats.map((stat, i) => (
            <div key={stat.id} className={`flex flex-col justify-center border-b pb-6 sm:border-b-0 sm:pb-0 ${i !== heroStats.length - 1 ? 'sm:border-r border-slate-200 dark:border-slate-800' : ''}`}>
              <div className="text-3xl font-black text-blue-600">{stat.value}</div>
              <div className={`mt-2 text-sm font-bold uppercase tracking-wide ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
            </div>
          ))}

          <div className={`flex flex-col justify-center lg:pl-6`}>
            <div className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-blue-500' : 'text-blue-600'}`}>
              Core Solutions
            </div>
            <div className={`mt-3 space-y-2 text-sm font-semibold ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
              {heroProofItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700"
        >
          <Pencil className="h-4 w-4" />
          Edit Home Section
        </button>
      )}

      {isEditing && (
        <HomeEditModal content={content} dark={dark} onClose={() => setIsEditing(false)} onSave={saveHeroContent} />
      )}
    </section>
  );
}
