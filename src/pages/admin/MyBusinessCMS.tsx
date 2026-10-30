import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useBusinesses } from '../../hooks/useCMSContent.ts';
import { BusinessDoc } from '../../types/cms.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
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
  Briefcase,
  Users,
  Tv,
  Film,
  Star,
  LayoutGrid,
  Building,
  Globe,
  ExternalLink,
  Save,
} from 'lucide-react';

export const MyBusinessCMS: React.FC = () => {
  const { data: items } = useBusinesses(false);
  const [editingItem, setEditingItem] = useState<BusinessDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialFormState: BusinessDoc = {
    id: '',
    name: '',
    category: '',
    url: 'https://',
    iconName: 'Building',
    logoUrl: '',
    order: items.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<BusinessDoc>(initialFormState);

  const openAddModal = () => {
    setFormData({
      ...initialFormState,
      id: `biz-${Date.now()}`,
      order: items.length + 1,
    });
    setEditingItem(null);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (item: BusinessDoc) => {
    setFormData(item);
    setEditingItem(item);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleToggleActive = async (item: BusinessDoc) => {
    try {
      const docRef = doc(db, 'businesses', item.id);
      await setDoc(docRef, { isActive: !item.isActive, updatedAt: new Date().toISOString() }, { merge: true });
      setStatusMessage(`Business "${item.name}" is now ${!item.isActive ? 'Active' : 'Hidden'}.`);
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
      const currentRef = doc(db, 'businesses', currentItem.id);
      const targetRef = doc(db, 'businesses', targetItem.id);

      await setDoc(currentRef, { order: targetItem.order }, { merge: true });
      await setDoc(targetRef, { order: currentItem.order }, { merge: true });

      setStatusMessage('Order updated successfully.');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(`Failed to reorder: ${err.message}`);
    }
  };

  const handleDelete = async (item: BusinessDoc) => {
    if (!window.confirm(`Are you sure you want to delete business venture: "${item.name}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'businesses', item.id));
      setStatusMessage('Business venture removed.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to delete: ${err.message}`);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim()) {
      setErrorMessage('Please provide both venture name and category.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const docId = formData.id || `biz-${Date.now()}`;
      const payload: BusinessDoc = {
        ...formData,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'businesses', docId), payload, { merge: true });
      setIsModalOpen(false);
      setStatusMessage('Business venture saved successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving business:', err);
      setErrorMessage(err.message || 'Failed to save business venture.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Users':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-red-600" />;
      case 'Film':
        return <Film className="w-5 h-5 text-cyan-700" />;
      case 'Star':
        return <Star className="w-5 h-5 text-blue-600 fill-blue-600" />;
      case 'Building':
        return <Building className="w-5 h-5 text-amber-700" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-purple-700" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-emerald-600" />;
      case 'LayoutGrid':
      default:
        return <LayoutGrid className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5decb]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#a87932]">
            Ventures &amp; Enterprise
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            My Business Portfolio ({items.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage entrepreneurial ventures, organizations, and company initiatives.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Venture</span>
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

      {/* Grid of Business Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all bg-white flex flex-col justify-between text-center group ${
              item.isActive
                ? 'border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b]'
                : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  #{index + 1}
                </span>
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-1 rounded cursor-pointer ${
                    item.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                  }`}
                  title={item.isActive ? 'Published - click to hide' : 'Hidden - click to show'}
                >
                  {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#f8f4ed] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                {item.logoUrl ? (
                  <img src={item.logoUrl} alt={item.name} className="w-7 h-7 object-contain" />
                ) : (
                  renderIcon(item.iconName)
                )}
              </div>

              <h3 className="font-bold text-xs text-[#111c2a] group-hover:text-[#a87932] transition-colors mb-1">
                {item.name}
              </h3>
              <p className="text-[11px] text-[#64748b] leading-tight line-clamp-2 mb-3">
                {item.category}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMoveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Move Left"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveOrder(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                  title="Move Right"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-slate-600 hover:text-[#b8863b] cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
                {editingItem ? 'Edit Business Venture' : 'Add Business Venture'}
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
                  Venture / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. People's Association, Janta Live..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Social Welfare & NGO, News & Media..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Website or Target URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://peoplesassociation.org"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Representative Icon
                </label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#b8863b]"
                >
                  <option value="Users">Users (Social / NGO)</option>
                  <option value="Tv">Tv (Broadcast / News)</option>
                  <option value="Film">Film (Production / Cinema)</option>
                  <option value="Star">Star (Celebrity Booking)</option>
                  <option value="Building">Building (Corporate Enterprise)</option>
                  <option value="Briefcase">Briefcase (Business / Consulting)</option>
                  <option value="Globe">Globe (Global Outreach)</option>
                  <option value="LayoutGrid">LayoutGrid (General Venture)</option>
                </select>
              </div>

              <div>
                <CloudinaryUploadWidget
                  subfolder="business-logos"
                  label="Custom Brand Logo (Optional)"
                  currentImageUrl={formData.logoUrl}
                  helperText="Upload custom logo icon to override vector icon"
                  onImageUploaded={(url) => setFormData({ ...formData, logoUrl: url })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBizActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#b8863b] focus:ring-[#b8863b] h-4 w-4"
                />
                <label htmlFor="isBizActive" className="text-xs font-medium text-slate-700">
                  Visible on My Business section
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
                  <span>{submitting ? 'Saving...' : 'Save Venture'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

