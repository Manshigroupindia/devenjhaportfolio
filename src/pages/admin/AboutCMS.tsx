import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useAboutPageContent } from '../../hooks/useCMSContent.ts';
import { AboutPageContent, TimelineItemDoc } from '../../types/cms.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';

export const AboutCMS: React.FC = () => {
  const { data: initialData, loading, reload } = useAboutPageContent();
  const [formData, setFormData] = useState<AboutPageContent>(initialData);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleHeroChange = (field: keyof AboutPageContent['hero'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const handleStoryChange = (field: keyof AboutPageContent['story'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      story: { ...prev.story, [field]: value },
    }));
  };

  const handleParagraphChange = (index: number, val: string) => {
    setFormData((prev) => {
      const paras = [...prev.story.paragraphs];
      paras[index] = val;
      return { ...prev, story: { ...prev.story, paragraphs: paras } };
    });
  };

  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        paragraphs: [...prev.story.paragraphs, ''],
      },
    }));
  };

  const handleRemoveParagraph = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        paragraphs: prev.story.paragraphs.filter((_, i) => i !== index),
      },
    }));
  };

  // Timeline handlers
  const handleTimelineChange = (index: number, field: keyof TimelineItemDoc, value: string) => {
    setFormData((prev) => {
      const list = [...prev.timeline];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, timeline: list };
    });
  };

  const handleAddTimeline = () => {
    const newItem: TimelineItemDoc = {
      id: `tl-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'New Milestone',
      subtitle: 'Key Achievement',
      description: 'Describe the milestone achievement here...',
      tag: 'Milestone',
    };
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newItem],
    }));
  };

  const handleRemoveTimeline = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const handleMoveTimeline = (index: number, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const list = [...prev.timeline];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, timeline: list };
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

      await setDoc(doc(db, 'siteSettings', 'about'), updatedData, { merge: true });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      reload();
    } catch (err: any) {
      console.error('Error saving about content:', err);
      setErrorMessage(err.message || 'Failed to save changes to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Section Editor
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            About Us Page Content
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your personal biography, journey timeline, mission &amp; vision.
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

      {/* 1. ABOUT HERO */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">About Page Hero</h3>
            <p className="text-[11px] text-slate-400">
              Introductory banner headline, supporting message &amp; photograph
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Eyebrow
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
              Hero Heading
            </label>
            <input
              type="text"
              value={formData.hero.heading}
              onChange={(e) => handleHeroChange('heading', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Supporting Text
            </label>
            <textarea
              rows={3}
              value={formData.hero.description}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <CloudinaryUploadWidget
              subfolder="about"
              label="Hero Editorial Image"
              currentImageUrl={formData.hero.heroImage}
              onImageUploaded={(url) => handleHeroChange('heroImage', url)}
            />
          </div>
        </div>
      </div>

      {/* 2. BIOGRAPHY STORY */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">My Story (Personal Biography)</h3>
            <p className="text-[11px] text-slate-400">
              Roots, arrival in New Delhi, and journey narrative
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Story Eyebrow
            </label>
            <input
              type="text"
              value={formData.story.eyebrow}
              onChange={(e) => handleStoryChange('eyebrow', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Story Heading
            </label>
            <input
              type="text"
              value={formData.story.heading}
              onChange={(e) => handleStoryChange('heading', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Story Subheading
            </label>
            <input
              type="text"
              value={formData.story.subheading}
              onChange={(e) => handleStoryChange('subheading', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Biography Paragraphs ({formData.story.paragraphs.length})
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="inline-flex items-center gap-1 text-xs text-[#a87932] font-semibold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            {formData.story.paragraphs.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-xs font-bold text-slate-400 mt-2 shrink-0 w-6">
                  #{idx + 1}
                </span>
                <textarea
                  rows={3}
                  value={p}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(idx)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mt-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <CloudinaryUploadWidget
              subfolder="about"
              label="Portrait Photograph"
              currentImageUrl={formData.story.portraitImage}
              onImageUploaded={(url) => handleStoryChange('portraitImage', url)}
            />
          </div>

          <div>
            <CloudinaryUploadWidget
              subfolder="about"
              label="Signature Image (PNG with transparency)"
              currentImageUrl={formData.story.signatureImage}
              onImageUploaded={(url) => handleStoryChange('signatureImage', url)}
            />
          </div>
        </div>
      </div>

      {/* 3. JOURNEY TIMELINE */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111c2a]">Journey Timeline</h3>
              <p className="text-[11px] text-slate-400">
                Chronological key milestones and social leadership markers
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddTimeline}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.timeline.map((item, idx) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-[#faf8f5] space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#a87932] uppercase">
                  Milestone #{idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveTimeline(idx, 'up')}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === formData.timeline.length - 1}
                    onClick={() => handleMoveTimeline(idx, 'down')}
                    className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeline(idx)}
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer ml-1"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Year / Era
                  </label>
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                    placeholder="e.g. 2016 or Present"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                    placeholder="e.g. Founding People's Association"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={item.tag}
                    onChange={(e) => handleTimelineChange(idx, 'tag', e.target.value)}
                    placeholder="e.g. Organization"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => handleTimelineChange(idx, 'subtitle', e.target.value)}
                    placeholder="e.g. Structured Humanitarian Action"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleTimelineChange(idx, 'description', e.target.value)}
                    placeholder="Milestone context..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MISSION & VISION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e5decb] shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#b8863b] flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#111c2a]">Mission &amp; Vision Statements</h3>
            <p className="text-[11px] text-slate-400">
              Core organizational philosophy and guiding values
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mission Statement
            </label>
            <textarea
              rows={4}
              value={formData.missionVision.missionText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  missionVision: { ...prev.missionVision, missionText: e.target.value },
                }))
              }
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Vision Statement
            </label>
            <textarea
              rows={4}
              value={formData.missionVision.visionText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  missionVision: { ...prev.missionVision, visionText: e.target.value },
                }))
              }
              className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>
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
          <span>{saving ? 'Publishing Updates...' : 'Publish About Changes'}</span>
        </button>
      </div>
    </form>
  );
};
