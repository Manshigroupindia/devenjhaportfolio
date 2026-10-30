import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useSocialProfiles } from '../../hooks/useCMSContent.ts';
import { SocialProfileDoc } from '../../types/cms.ts';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  ExternalLink,
  Save,
} from 'lucide-react';

export const ConnectMeCMS: React.FC = () => {
  const { data: items } = useSocialProfiles(false);
  const [editingItem, setEditingItem] = useState<SocialProfileDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialFormState: SocialProfileDoc = {
    id: '',
    name: '',
    handle: '@',
    role: '',
    url: 'https://',
    bgColor: 'bg-blue-600',
    badgeColor: 'text-blue-600',
    iconKey: 'globe',
    order: items.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<SocialProfileDoc>(initialFormState);

  const openAddModal = () => {
    setFormData({
      ...initialFormState,
      id: `social-${Date.now()}`,
      order: items.length + 1,
    });
    setEditingItem(null);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (item: SocialProfileDoc) => {
    setFormData(item);
    setEditingItem(item);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleToggleActive = async (item: SocialProfileDoc) => {
    try {
      const docRef = doc(db, 'socialProfiles', item.id);
      await setDoc(docRef, { isActive: !item.isActive, updatedAt: new Date().toISOString() }, { merge: true });
      setStatusMessage(`Social account "${item.name}" is now ${!item.isActive ? 'Active' : 'Hidden'}.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to update status: ${err.message}`);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    try {
      const currentRef = doc(db, 'socialProfiles', currentItem.id);
      const targetRef = doc(db, 'socialProfiles', targetItem.id);

      await setDoc(currentRef, { order: targetItem.order }, { merge: true });
      await setDoc(targetRef, { order: currentItem.order }, { merge: true });

      setStatusMessage('Order updated successfully.');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(`Failed to reorder: ${err.message}`);
    }
  };

  const handleDelete = async (item: SocialProfileDoc) => {
    if (!window.confirm(`Are you sure you want to delete social profile: "${item.name}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'socialProfiles', item.id));
      setStatusMessage('Social profile removed.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to delete: ${err.message}`);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      setErrorMessage('Please provide both the platform name and profile URL.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const docId = formData.id || `social-${Date.now()}`;
      const payload: SocialProfileDoc = {
        ...formData,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'socialProfiles', docId), payload, { merge: true });
      setIsModalOpen(false);
      setStatusMessage('Social profile saved successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving social profile:', err);
      setErrorMessage(err.message || 'Failed to save social profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Navigation &amp; Social
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            Connect Me Dropdown &amp; Social Links ({items.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage official social channels displayed in the navbar dropdown, footer and about page.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
        </button>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Social Profiles Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all bg-white relative group ${
              item.isActive
                ? 'border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b]'
                : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${item.bgColor}`}>
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111c2a] flex items-center gap-2">
                    <span>{item.name}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-[#b8863b]"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </h4>
                  <span className="text-xs font-semibold text-[#a87932] block">
                    {item.handle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    item.isActive
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-400 hover:bg-slate-200'
                  }`}
                  title={item.isActive ? 'Active - click to hide' : 'Hidden - click to show'}
                >
                  {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 line-clamp-1">
              {item.role || 'Official account profile'}
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Move Left/Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveOrder(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Move Right/Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#b8863b] font-medium cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => handleDelete(item)}
                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                {editingItem ? 'Edit Social Channel' : 'Add Social Channel'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Facebook, Instagram, Threads..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Social Handle / Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  placeholder="e.g. @Devenjha96"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Target URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role / Subtitle Description
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Official Updates & Community Drives"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Icon Type
                </label>
                <select
                  value={formData.iconKey}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iconKey: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#b8863b]"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X (Twitter)</option>
                  <option value="peoples-association">People's Association / NGO</option>
                  <option value="globe">General Globe / Website</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isSocialActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#b8863b] focus:ring-[#b8863b] h-4 w-4"
                />
                <label htmlFor="isSocialActive" className="text-xs font-medium text-slate-700">
                  Visible in Connect Me navigation
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : 'Save Channel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

