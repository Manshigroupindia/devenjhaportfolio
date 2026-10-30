import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useHomePageContent } from '../../hooks/useCMSContent.ts';
import { HomePageContent } from '../../types/cms.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
import { Save, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

export const HomeCMS: React.FC = () => {
  const { data: initialData, loading, reload } = useHomePageContent();
  const [formData, setFormData] = useState<HomePageContent>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleHeroChange = (field: keyof HomePageContent['hero'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleAboutPreviewChange = (field: keyof HomePageContent['aboutPreview'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutPreview: {
        ...prev.aboutPreview,
        [field]: value,
      },
    }));
  };

  const handleStatChange = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updatedStats = [...prev.impactStats];
      updatedStats[index] = {
        ...updatedStats[index],
        [field]: field === 'target' ? Number(value) : value,
      };
      return { ...prev, impactStats: updatedStats };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const timestamp = new Date().toISOString();
      const updatedData = {
        ...formData,
        updatedAt: timestamp,
      };

      await setDoc(doc(db, 'siteSettings', 'home'), updatedData, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      reload();
    } catch (err: any) {
      console.error('Error saving home content:', err);
      setErrorMessage(err.message || 'Failed to save changes to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Section Editor
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            Home Page Content
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the editorial hero, about overview and impact stats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Saved &amp; Published!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: HERO SECTION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">Hero Section</h3>
            <p className="text-[11px] text-slate-400">
              Top banner headline, portrait image, and call-to-actions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tagline Eyebrow
            </label>
            <input
              type="text"
              value={formData.hero.eyebrow}
              onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Headline Line 1
            </label>
            <input
              type="text"
              value={formData.hero.titleLine1}
              onChange={(e) => handleHeroChange('titleLine1', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Headline Highlight 1 (Gold Italic)
            </label>
            <input
              type="text"
              value={formData.hero.titleHighlight1}
              onChange={(e) => handleHeroChange('titleHighlight1', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Headline Line 2
            </label>
            <input
              type="text"
              value={formData.hero.titleLine2}
              onChange={(e) => handleHeroChange('titleLine2', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Headline Highlight 2 (Gold Italic)
            </label>
            <input
              type="text"
              value={formData.hero.titleHighlight2}
              onChange={(e) => handleHeroChange('titleHighlight2', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Description Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.hero.description}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Official Name
            </label>
            <input
              type="text"
              value={formData.hero.fullName}
              onChange={(e) => handleHeroChange('fullName', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Popular Persona Name
            </label>
            <input
              type="text"
              value={formData.hero.subname}
              onChange={(e) => handleHeroChange('subname', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Location Badge
            </label>
            <input
              type="text"
              value={formData.hero.location}
              onChange={(e) => handleHeroChange('location', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <CloudinaryUploadWidget
              subfolder="home"
              label="Hero Main Portrait Image"
              currentImageUrl={formData.hero.portraitImage}
              helperText="Upload transparent or cutout portrait of Deven Jha for hero section"
              onImageUploaded={(url) => handleHeroChange('portraitImage', url)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT JOURNEY OVERVIEW */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">About My Journey (Homepage Story Excerpt)</h3>
            <p className="text-[11px] text-slate-400">
              Biography teaser, overlapping photos &amp; philosophical quote
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Section Eyebrow
            </label>
            <input
              type="text"
              value={formData.aboutPreview.eyebrow}
              onChange={(e) => handleAboutPreviewChange('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Section Heading
            </label>
            <input
              type="text"
              value={formData.aboutPreview.heading}
              onChange={(e) => handleAboutPreviewChange('heading', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Bio Paragraph 1
            </label>
            <textarea
              rows={3}
              value={formData.aboutPreview.paragraph1}
              onChange={(e) => handleAboutPreviewChange('paragraph1', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Bio Paragraph 2 (NGO Background)
            </label>
            <textarea
              rows={3}
              value={formData.aboutPreview.paragraph2}
              onChange={(e) => handleAboutPreviewChange('paragraph2', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Featured Quote
            </label>
            <input
              type="text"
              value={formData.aboutPreview.quote}
              onChange={(e) => handleAboutPreviewChange('quote', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <CloudinaryUploadWidget
              subfolder="home"
              label="Suit Portrait (Front Overlapping)"
              currentImageUrl={formData.aboutPreview.portraitImage}
              onImageUploaded={(url) => handleAboutPreviewChange('portraitImage', url)}
            />
          </div>

          <div>
            <CloudinaryUploadWidget
              subfolder="home"
              label="Group / Community Photo (Back Overlapping)"
              currentImageUrl={formData.aboutPreview.groupImage}
              onImageUploaded={(url) => handleAboutPreviewChange('groupImage', url)}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: IMPACT STATS COUNTERS */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">Impact Stats Counters</h3>
            <p className="text-[11px] text-slate-400">
              Numerical achievements with animated counters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {formData.impactStats.map((stat, idx) => (
            <div
              key={stat.id}
              className="p-4 rounded-xl border border-slate-200 bg-[#faf8f5] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-[#a87932]">
                  Stat #{idx + 1}
                </span>
                <select
                  value={stat.iconName}
                  onChange={(e) => handleStatChange(idx, 'iconName', e.target.value)}
                  className="text-[11px] bg-white border border-slate-200 rounded px-2 py-0.5"
                >
                  <option value="Users">Users</option>
                  <option value="Smile">Smile</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Calendar">Calendar</option>
                  <option value="Award">Award</option>
                  <option value="Heart">Heart</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Target Number
                </label>
                <input
                  type="number"
                  value={stat.target}
                  onChange={(e) => {
                    handleStatChange(idx, 'target', e.target.value);
                    handleStatChange(
                      idx,
                      'formattedTarget',
                      Number(e.target.value).toLocaleString()
                    );
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                  Display Label
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Publishing Updates...' : 'Publish Home Changes'}</span>
        </button>
      </div>
    </form>
  );
};
