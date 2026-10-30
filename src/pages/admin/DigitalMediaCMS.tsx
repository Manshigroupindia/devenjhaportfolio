import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { useDigitalMedia } from '../../hooks/useCMSContent.ts';
import { DigitalMediaDoc } from '../../types/cms.ts';
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
  Tv,
  Play,
  Calendar,
  Clock,
  Save,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';

export const DigitalMediaCMS: React.FC = () => {
  const { data: items } = useDigitalMedia(false);
  const [editingItem, setEditingItem] = useState<DigitalMediaDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialFormState: DigitalMediaDoc = {
    id: '',
    title: '',
    channel: 'Janta Live News',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    category: 'Digital Broadcast',
    youtubeUrl: '',
    youtubeId: '',
    embedUrl: '',
    thumbnail: '',
    duration: '15:00',
    description: '',
    order: items.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<DigitalMediaDoc>(initialFormState);

  // Helper to parse YouTube URLs
  const parseYouTubeUrl = (url: string) => {
    let id = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      id = match[2];
    } else if (url.includes('live_stream')) {
      id = 'live_stream';
    } else {
      id = url.trim();
    }

    const embed = id === 'live_stream'
      ? 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews'
      : `https://www.youtube-nocookie.com/embed/${id}`;

    const autoThumb = (id && id !== 'live_stream')
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : formData.thumbnail || '/images/media-aaj-tak.png';

    setFormData((prev) => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: id,
      embedUrl: embed,
      thumbnail: prev.thumbnail || autoThumb,
    }));
  };

  const openAddModal = () => {
    setFormData({
      ...initialFormState,
      id: `digital-${Date.now()}`,
      order: items.length + 1,
    });
    setEditingItem(null);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (item: DigitalMediaDoc) => {
    setFormData(item);
    setEditingItem(item);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleToggleActive = async (item: DigitalMediaDoc) => {
    try {
      const docRef = doc(db, 'media_digital', item.id);
      await setDoc(docRef, { isActive: !item.isActive, updatedAt: new Date().toISOString() }, { merge: true });
      setStatusMessage(`Video "${item.title.substring(0, 25)}..." is now ${!item.isActive ? 'Active' : 'Hidden'}.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to update status in Firestore: ${err.message}`);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    try {
      const currentRef = doc(db, 'media_digital', currentItem.id);
      const targetRef = doc(db, 'media_digital', targetItem.id);

      await setDoc(currentRef, { order: targetItem.order }, { merge: true });
      await setDoc(targetRef, { order: currentItem.order }, { merge: true });

      setStatusMessage('Order updated successfully in Firestore.');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(`Failed to reorder: ${err.message}`);
    }
  };

  const handleDelete = async (item: DigitalMediaDoc) => {
    if (!window.confirm(`Are you sure you want to delete video: "${item.title}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'media_digital', item.id));
      setStatusMessage('Digital video deleted from Firestore.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to delete from Firestore: ${err.message}`);
    }
  };

  const sanitizePayload = (payload: Record<string, any>) => {
    const clean: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      clean[key] = payload[key] !== undefined ? payload[key] : '';
    });
    return clean;
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Please provide a title for the video.');
      return;
    }
    if (!formData.embedUrl.trim() && !formData.youtubeUrl.trim()) {
      setErrorMessage('Please provide a YouTube video URL or ID.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const docId = formData.id || `digital-${Date.now()}`;
      const payload: Record<string, any> = {
        ...formData,
        id: docId,
        updatedAt: new Date().toISOString(),
      };

      const sanitized = sanitizePayload(payload);
      await setDoc(doc(db, 'media_digital', docId), sanitized, { merge: true });

      setIsModalOpen(false);
      setStatusMessage('Digital media video saved successfully to Firestore!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error saving digital media to Firestore:', err);
      setErrorMessage(err.message || 'Failed to save video to Firestore.');
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
            Media Management
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#111c2a]">
            Digital Media &amp; Videos ({items.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage television appearances, Janta Live broadcasts and documentary interviews with live Firestore sync.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-white rounded-2xl border border-[#e5decb] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf7f2] border-b border-[#ebdcc9] text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 w-28">Preview</th>
                <th className="py-3.5 px-4">Title &amp; Channel</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Reorder</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-[#fbf9f5] transition-colors ${
                    !item.isActive ? 'opacity-60 bg-slate-50' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-mono text-slate-400 font-semibold">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative group">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <h4 className="font-bold text-[#111c2a] line-clamp-1 mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#a87932] font-semibold">
                      {item.channel}
                    </p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3 h-3 text-[#a87932]" />
                      <span>{item.duration || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title="Click to toggle visibility"
                    >
                      {item.isActive ? (
                        <>
                          <Eye className="w-3 h-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-600 hover:text-[#b8863b] hover:bg-[#faf6ee] rounded-lg transition-colors cursor-pointer"
                        title="Edit Video"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                {editingItem ? 'Edit Digital Media Video' : 'Add New Video Broadcast'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  YouTube Video Link or ID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.youtubeUrl}
                    onChange={(e) => parseYouTubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Embed URL: <span className="font-mono text-slate-600">{formData.embedUrl || 'Waiting for URL...'}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Aaj Tak Special: Grassroots Social Leadership..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Channel / Network
                  </label>
                  <input
                    type="text"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    placeholder="e.g. Aaj Tak Digital"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Broadcast Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 14 Jun 2024"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 24:18"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#b8863b]"
                >
                  <option value="Television Interview">Television Interview</option>
                  <option value="Digital Broadcast">Digital Broadcast</option>
                  <option value="Documentary">Documentary</option>
                  <option value="News Coverage">News Coverage</option>
                </select>
              </div>

              <div>
                <CloudinaryUploadWidget
                  subfolder="print-media"
                  label="Custom Video Poster Thumbnail"
                  currentImageUrl={formData.thumbnail}
                  helperText="Leave empty to use automatic YouTube video thumbnail"
                  onImageUploaded={(url) => setFormData({ ...formData, thumbnail: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of what is discussed in the video..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDigitalActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#b8863b] focus:ring-[#b8863b] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isDigitalActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Visible on public website
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
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{submitting ? 'Saving to Firestore...' : 'Save Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
