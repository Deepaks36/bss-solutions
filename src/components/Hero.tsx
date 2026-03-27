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

const defaultHeroImage = 'https://images.pexels.com/photos/7108815/pexels-photo-7108815.jpeg?auto=compress&cs=tinysrgb&w=1200';

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
    heroImage: string;
    heroHighlights: HomeHighlight[];
    heroStats: HomeStat[];
    heroProofItems: HomeProofItem[];
  }) => void;
}) {
  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(content.heroSubtitle);
  const [heroCta, setHeroCta] = useState(content.heroCta);
  const [heroStat, setHeroStat] = useState(content.heroStat);
  const [heroImage, setHeroImage] = useState(content.heroImage || defaultHeroImage);
  const [heroHighlights, setHeroHighlights] = useState<HomeHighlight[]>(content.heroHighlights?.length ? content.heroHighlights : defaultHighlights);
  const [heroStats, setHeroStats] = useState<HomeStat[]>(content.heroStats?.length ? content.heroStats : defaultStats);
  const [heroProofItems, setHeroProofItems] = useState<HomeProofItem[]>(content.heroProofItems?.length ? content.heroProofItems : defaultProofItems);
  const [newHighlight, setNewHighlight] = useState('');
  const [newStatValue, setNewStatValue] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newProofItem, setNewProofItem] = useState('');
  const [filePreview, setFilePreview] = useState(heroImage);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const value = ev.target?.result as string;
      setHeroImage(value);
      setFilePreview(value);
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>CTA label</label>
                <input value={heroCta} onChange={(e) => setHeroCta(e.target.value)} className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
              </div>
              <div>
                <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Support text</label>
                <input value={heroStat} onChange={(e) => setHeroStat(e.target.value)} className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${dark ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-900'}`} />
              </div>
            </div>

            <div>
              <label className={`mb-1.5 block text-xs font-bold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Hero image</label>
              <input ref={imageRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />
              <button
                onClick={() => imageRef.current?.click()}
                className={`flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${dark ? 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-blue-500' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500'}`}
              >
                {filePreview ? <img src={filePreview} alt="Hero preview" className="h-full w-full object-cover" /> : <><ImagePlus className="h-6 w-6" /><span className="ml-2 text-sm font-medium">Upload image</span></>}
              </button>
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
            onClick={() => onSave({ heroTitle, heroSubtitle, heroCta, heroStat, heroImage, heroHighlights, heroStats, heroProofItems })}
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
  const { editMode, updateContent } = useSite();
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
    heroImage: string;
    heroHighlights: HomeHighlight[];
    heroStats: HomeStat[];
    heroProofItems: HomeProofItem[];
  }) => {
    updateContent('heroTitle', data.heroTitle);
    updateContent('heroSubtitle', data.heroSubtitle);
    updateContent('heroCta', data.heroCta);
    updateContent('heroStat', data.heroStat);
    updateContent('heroImage', data.heroImage);
    updateContent('heroHighlights', data.heroHighlights);
    updateContent('heroStats', data.heroStats);
    updateContent('heroProofItems', data.heroProofItems);
    setIsEditing(false);
  };

  return (
    <section
      id="home"
      className={`relative overflow-hidden pt-28 pb-20 transition-colors duration-300 ${dark ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900'}`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            Available for new projects
          </div>

          <h1 className={`max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            {content.heroTitle}
          </h1>

          <p className={`mt-6 max-w-xl text-lg leading-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            {content.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-transform hover:-translate-y-0.5"
            >
              {content.heroCta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-semibold transition-colors ${dark
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:border-blue-500 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              View Products
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {heroHighlights.map((item) => (
              <div
                key={item.id}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${dark ? 'bg-white/5 text-slate-300' : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200'}`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.id}
                className={`rounded-2xl border p-4 ${dark ? 'border-slate-800 bg-slate-900/70' : 'border-white bg-white/90 shadow-[0_10px_35px_rgba(15,23,42,0.08)]'}`}
              >
                <div className="text-2xl font-black text-blue-600">{stat.value}</div>
                <div className={`mt-1 text-xs uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`relative transition-all duration-700 delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="relative mx-auto max-w-xl">
            <div className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur ${dark ? 'border-slate-800 bg-slate-900/85' : 'border-white bg-white/85'}`}>
              <div className="flex items-start gap-4">
                <img
                  src={heroImage}
                  alt="Home hero"
                  className="h-28 w-28 rounded-2xl object-cover shadow-lg"
                />
                <div className="flex-1">
                  <span className="inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-600">
                    Home Overview
                  </span>
                  <h3 className={`mt-3 text-2xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                    {content.heroStat}
                  </h3>
                  <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Full-stack capabilities built for enterprise scale.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {heroProofItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className={`ml-10 -mt-6 rounded-[1.75rem] border p-5 shadow-2xl ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</p>
                  <h4 className={`mt-2 text-xl font-black ${dark ? 'text-white' : 'text-slate-950'}`}>
                    Product velocity and delivery confidence
                  </h4>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-right">
                  <div className="text-sm font-bold text-emerald-500">+340%</div>
                  <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Growth</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {heroStats.slice(0, 2).map((stat) => (
                  <div key={stat.id} className={`rounded-2xl p-4 ${dark ? 'bg-slate-800/80' : 'bg-slate-50'}`}>
                    <div className="text-xs uppercase tracking-wider text-slate-500">{stat.label}</div>
                    <div className="mt-2 text-2xl font-black text-blue-600">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`ml-20 -mt-6 rounded-[1.75rem] border p-5 shadow-2xl ${dark ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-blue-600/30">
                  Home
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs uppercase tracking-[0.25em] ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Associated highlights</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {heroHighlights.map((item) => (
                      <span
                        key={item.id}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${dark ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700"
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
