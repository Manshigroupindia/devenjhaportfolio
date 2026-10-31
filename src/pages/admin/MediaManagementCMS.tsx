import React, { useState, useMemo } from 'react';
import {
  Award,
  Star,
  Users,
  Mail,
  Tv,
  Camera,
  UploadCloud,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Layers,
  Search,
  ExternalLink,
  Play,
  Calendar,
  MapPin,
  Clock,
  Filter,
  Check,
  X,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { doc, setDoc, deleteDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { uploadToCloudinary } from '../../lib/cloudinary.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
import { BulkGalleryMediaUploader } from '../../components/admin/BulkGalleryMediaUploader.tsx';
import { GalleryCategoryKey, GalleryImageItem, GalleryVideoItem } from '../../types/gallery.ts';

interface SubcategoryMeta {
  key: GalleryCategoryKey;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  route: string;
  isVideo?: boolean;
}

const SUBCATEGORIES: SubcategoryMeta[] = [
  {
    key: 'awards',
    label: 'Awards & Recognitions',
    shortLabel: 'Awards',
    icon: <Award className="w-4 h-4" />,
    description: 'Archival citations, commemorative certificates, and formal tokens of appreciation.',
    route: '/gallery/awards',
  },
  {
    key: 'celebrities',
    label: 'Pictures With Celebrities',
    shortLabel: 'Celebrities',
    icon: <Star className="w-4 h-4" />,
    description: 'Moments with dignitaries, public figures, celebrities and distinguished leaders.',
    route: '/gallery/celebrity',
  },
  {
    key: 'social',
    label: 'Social Events & Initiatives',
    shortLabel: 'Social Events',
    icon: <Users className="w-4 h-4" />,
    description: 'Community service, education drives, winter relief and social welfare programs.',
    route: '/gallery/social-events',
  },
  {
    key: 'invitations',
    label: 'Program Invitations',
    shortLabel: 'Invitations',
    icon: <Mail className="w-4 h-4" />,
    description: 'Official invitation letters, convention passes, and commemorative program cards.',
    route: '/gallery/invitations',
  },
  {
    key: 'videos',
    label: 'Videos & Broadcasts',
    shortLabel: 'Videos',
    icon: <Tv className="w-4 h-4" />,
    description: 'Broadcast recordings, television interviews, documentary features and video clips.',
    route: '/gallery/videos',
    isVideo: true,
  },
  {
    key: 'personal',
    label: 'Personal Pictures',
    shortLabel: 'Personal',
    icon: <Camera className="w-4 h-4" />,
    description: 'Candid moments, retrospective portraits, and personal family memories.',
    route: '/gallery/personal',
  },
];

export const MediaManagementCMS: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<GalleryCategoryKey>('awards');
  const [items, setItems] = useState<Array<GalleryImageItem | GalleryVideoItem>>([]);
  const [loading, setLoading] = useState(true);

  // Bulk uploader open state
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Single Item Add/Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(GalleryImageItem | GalleryVideoItem) | null>(null);

  // Preview Lightbox modal
  const [previewItem, setPreviewItem] = useState<(GalleryImageItem | GalleryVideoItem) | null>(null);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  // Filter / Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State for Single Add/Edit modal
  const [formData, setFormData] = useState<{
    category: GalleryCategoryKey;
    image: string;
    imageUrl: string;
    publicId: string;
    title: string;
    caption: string;
    description: string;
    date: string;
    location: string;
    photographer: string;
    // Video specific:
    embedUrl: string;
    youtubeUrl: string;
    channel: string;
    duration: string;
  }>({
    category: 'awards',
    image: '',
    imageUrl: '',
    publicId: '',
    title: '',
    caption: '',
    description: '',
    date: '',
    location: '',
    photographer: '',
    embedUrl: '',
    youtubeUrl: '',
    channel: '',
    duration: '',
  });

  const activeSubcategory = useMemo(
    () => SUBCATEGORIES.find((s) => s.key === activeCategoryKey) || SUBCATEGORIES[0],
    [activeCategoryKey]
  );

  // Real-time Firestore onSnapshot listener for the active category
  React.useEffect(() => {
    setLoading(true);
    let unsubscribe: (() => void) | undefined;

    try {
      const q = query(collection(db, 'gallery_media'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched: Array<GalleryImageItem | GalleryVideoItem> = [];
          snapshot.forEach((docSnap) => {
            const data = { id: docSnap.id, ...docSnap.data() } as any;
            if (data.category === activeCategoryKey) {
              fetched.push(data);
            }
          });
          setItems(fetched);
          setLoading(false);
        },
        (err) => {
          console.warn('Real-time gallery media notice:', err.message);
          setErrorMessage(err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Error connecting to gallery collection:', err?.message);
      setErrorMessage(err?.message);
      setLoading(false);
    }

    // Reset selections on category switch
    setSelectedIds([]);
    setIsBulkOpen(false);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeCategoryKey]);

  // Filtered items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const date = (item.date || '').toLowerCase();
      const loc = ('location' in item ? (item.location || '') : '').toLowerCase();
      const cap = ('caption' in item ? (item.caption || '') : '').toLowerCase();
      return title.includes(q) || desc.includes(q) || date.includes(q) || loc.includes(q) || cap.includes(q);
    });
  }, [items, searchQuery]);

  // Handle single item modal open
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      category: activeCategoryKey,
      image: '',
      imageUrl: '',
      publicId: '',
      title: '',
      caption: '',
      description: '',
      date: '',
      location: '',
      photographer: '',
      embedUrl: '',
      youtubeUrl: '',
      channel: 'Janta Live',
      duration: '',
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleOpenEditModal = (item: GalleryImageItem | GalleryVideoItem) => {
    setEditingItem(item);
    const isVid = item.category === 'videos';
    const vid = isVid ? (item as GalleryVideoItem) : null;
    const img = !isVid ? (item as GalleryImageItem) : null;

    setFormData({
      category: item.category,
      image: img?.image || img?.imageUrl || vid?.thumbnail || '',
      imageUrl: img?.imageUrl || img?.image || vid?.thumbnail || '',
      publicId: img?.publicId || '',
      title: item.title || '',
      caption: img?.caption || img?.subtitle || '',
      description: item.description || '',
      date: item.date || '',
      location: img?.location || '',
      photographer: img?.photographer || '',
      embedUrl: vid?.embedUrl || '',
      youtubeUrl: vid?.youtubeUrl || '',
      channel: vid?.channel || 'Janta Live',
      duration: vid?.duration || '',
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  // Toggle active publish state in Firestore
  const handleToggleActive = async (item: GalleryImageItem | GalleryVideoItem) => {
    try {
      const docRef = doc(db, 'gallery_media', item.id);
      const newActive = item.isActive === false ? true : false;
      await setDoc(docRef, { isActive: newActive, updatedAt: new Date().toISOString() }, { merge: true });
      setStatusMessage(`Item #${item.order || 1} is now ${newActive ? 'Published' : 'Hidden'}.`);
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(`Failed to update status: ${err.message}`);
    }
  };

  // Reorder items
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const currentItem = items[index];
    const targetItem = items[targetIndex];

    try {
      const currentRef = doc(db, 'gallery_media', currentItem.id);
      const targetRef = doc(db, 'gallery_media', targetItem.id);

      const currentOrder = currentItem.order ?? index + 1;
      const targetOrder = targetItem.order ?? targetIndex + 1;

      await setDoc(currentRef, { order: targetOrder, updatedAt: new Date().toISOString() }, { merge: true });
      await setDoc(targetRef, { order: currentOrder, updatedAt: new Date().toISOString() }, { merge: true });

      setStatusMessage('Order position updated successfully.');
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (err: any) {
      setErrorMessage(`Failed to reorder: ${err.message}`);
    }
  };

  // Delete single item
  const handleDeleteSingle = async (item: GalleryImageItem | GalleryVideoItem) => {
    const label = item.title?.trim() || `Item #${item.order || ''}`;
    if (!window.confirm(`Are you sure you want to delete ${label} from ${activeSubcategory.label}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'gallery_media', item.id));
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      setStatusMessage('Item permanently deleted from Firestore.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to delete: ${err.message}`);
    }
  };

  // Multi-select handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} selected item(s) from ${activeSubcategory.label}? This will remove them from Firestore.`
      )
    ) {
      return;
    }

    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, 'gallery_media', id))));
      setStatusMessage(`Successfully deleted ${selectedIds.length} item(s) from Firestore.`);
      setSelectedIds([]);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(`Bulk deletion failed: ${err.message}`);
    } finally {
      setBulkDeleting(false);
    }
  };

  // Save single add/edit form to Firestore
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();

    const isVideo = formData.category === 'videos';
    if (!isVideo && !formData.image.trim()) {
      setErrorMessage('Please upload or provide an Image URL.');
      return;
    }
    if (isVideo && !formData.embedUrl.trim() && !formData.youtubeUrl.trim()) {
      setErrorMessage('Please provide a video URL or YouTube link.');
      return;
    }

    const docId = editingItem ? editingItem.id : `gallery-${formData.category}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    const orderIndex = editingItem?.order ?? items.length + 1;

    // Parse YouTube URL if applicable
    let finalEmbedUrl = formData.embedUrl.trim();
    let youtubeId = '';
    if (formData.youtubeUrl) {
      const match = formData.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        youtubeId = match[1];
        if (!finalEmbedUrl) {
          finalEmbedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}`;
        }
      }
    }

    // Prepare clean payload without undefined
    const payload: Record<string, any> = {
      id: docId,
      category: formData.category,
      order: orderIndex,
      isActive: editingItem ? (editingItem.isActive !== false) : true,
      updatedAt: nowIso,
    };

    if (!editingItem) {
      payload.createdAt = nowIso;
    }

    if (isVideo) {
      const autoThumb = (youtubeId && !formData.image)
        ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
        : formData.image.trim();

      payload.thumbnail = autoThumb;
      payload.embedUrl = finalEmbedUrl;
      payload.youtubeUrl = formData.youtubeUrl.trim();
      payload.youtubeId = youtubeId;
      payload.channel = formData.channel.trim() || 'Janta Live';
      payload.duration = formData.duration.trim();
      payload.title = formData.title.trim() || 'Broadcast Video';
      payload.description = formData.description.trim();
    } else {
      payload.image = formData.image.trim();
      payload.imageUrl = formData.imageUrl.trim() || formData.image.trim();
      payload.publicId = formData.publicId.trim();
      payload.title = formData.title.trim();
      payload.caption = formData.caption.trim();
      payload.subtitle = formData.caption.trim();
      payload.description = formData.description.trim();
      payload.date = formData.date.trim();
      payload.location = formData.location.trim();
      payload.photographer = formData.photographer.trim();
    }

    try {
      await setDoc(doc(db, 'gallery_media', docId), payload, { merge: true });
      setStatusMessage(`Saved item successfully to ${SUBCATEGORIES.find((s) => s.key === formData.category)?.label || 'Gallery'}.`);
      setIsModalOpen(false);
      setEditingItem(null);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to save to Firestore: ${err.message}`);
    }
  };

  const activeCount = items.filter((i) => i.isActive !== false).length;
  const hiddenCount = items.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-[#ebdcc9] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14283B] text-white text-[11px] font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-[#BD9256]" />
              <span>Media &amp; Gallery CMS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14283B]">
              Media Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Manage, bulk upload, reorder and publish archival photographs and media across all 6 website subcategories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={activeSubcategory.route}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#d6c7b3] text-[#14283B] hover:bg-gray-50 text-xs font-semibold transition cursor-pointer"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#BD9256]" />
            </a>

            {!activeSubcategory.isVideo && (
              <button
                type="button"
                onClick={() => setIsBulkOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#BD9256] hover:bg-[#a87932] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Multiple Images</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#14283B] hover:bg-[#1f374e] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{activeSubcategory.isVideo ? 'Add New Video' : 'Add Single Image'}</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)}>
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* 6 Subcategory Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-[#ebdcc9] p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
          {SUBCATEGORIES.map((sub) => {
            const isActive = sub.key === activeCategoryKey;
            return (
              <button
                key={sub.key}
                type="button"
                onClick={() => setActiveCategoryKey(sub.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#14283B] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#14283B] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className={isActive ? 'text-[#BD9256]' : 'text-gray-400'}>{sub.icon}</span>
                <span>{sub.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Overview Bar */}
      <div className="bg-gradient-to-r from-[#FAF8F5] to-white rounded-2xl border border-[#ebdcc9] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD9256] block">
            Active Subcategory Tab
          </span>
          <h2 className="font-serif text-lg font-bold text-[#14283B]">
            {activeSubcategory.label}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {activeSubcategory.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-white border border-[#e2d6c5] rounded-full font-semibold text-[#14283B]">
              Total: <strong>{items.length}</strong>
            </span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-medium">
              Published: {activeCount}
            </span>
            {hiddenCount > 0 && (
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-medium">
                Hidden: {hiddenCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category-Specific Bulk Uploader Drawer / Card */}
      {isBulkOpen && !activeSubcategory.isVideo && (
        <BulkGalleryMediaUploader
          category={activeCategoryKey}
          categoryLabel={activeSubcategory.label}
          currentItemsCount={items.length}
          onUploadSuccess={() => {
            setStatusMessage(`Images successfully uploaded and saved under ${activeSubcategory.label}.`);
          }}
          onClose={() => setIsBulkOpen(false)}
        />
      )}

      {/* Controls Bar: Multi-Select, Bulk Delete, Search Filter */}
      <div className="bg-white rounded-2xl border border-[#ebdcc9] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#14283B] cursor-pointer">
            <input
              type="checkbox"
              checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length}
              onChange={handleSelectAll}
              className="rounded border-[#BD9256] text-[#BD9256] focus:ring-[#BD9256] w-4 h-4 cursor-pointer"
            />
            <span>Select All ({filteredItems.length})</span>
          </label>

          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256] text-[#14283B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-[#ebdcc9] p-4 animate-pulse space-y-3">
              <div className="aspect-[4/3] bg-[#f0e8dc] rounded-xl" />
              <div className="h-4 bg-[#f0e8dc] rounded w-3/4" />
              <div className="h-3 bg-[#f0e8dc] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#d8cbba] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#BD9256] flex items-center justify-center mx-auto mb-3">
            {activeSubcategory.icon}
          </div>
          <h3 className="font-serif text-lg font-bold text-[#14283B] mb-1">
            No media items in {activeSubcategory.label}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
            {activeSubcategory.isVideo
              ? 'Click "Add New Video" to link a YouTube broadcast interview.'
              : 'Click "Upload Multiple Images" to bulk upload 10 or 20 photographs at once.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {!activeSubcategory.isVideo && (
              <button
                type="button"
                onClick={() => setIsBulkOpen(true)}
                className="px-5 py-2.5 bg-[#BD9256] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md cursor-pointer"
              >
                Upload Multiple Images
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-[#14283B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md cursor-pointer"
            >
              {activeSubcategory.isVideo ? 'Add Video' : 'Add Single Image'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            const isVideo = item.category === 'videos';
            const vid = isVideo ? (item as GalleryVideoItem) : null;
            const img = !isVideo ? (item as GalleryImageItem) : null;
            const displayImg = img?.image || img?.imageUrl || vid?.thumbnail;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isSelected ? 'border-[#BD9256] ring-2 ring-[#BD9256]/30' : 'border-[#ebdcc9]'
                } ${item.isActive === false ? 'opacity-65 bg-gray-50' : ''}`}
              >
                {/* Media Preview Box */}
                <div className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden border-b border-[#ebdcc9] group">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={item.title || 'Gallery item'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 text-[#BD9256] opacity-60 mb-1" />
                      <span className="text-[10px] font-semibold">No Preview Image</span>
                    </div>
                  )}

                  {/* Multi-Select Checkbox Overlay */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(item.id)}
                      className="rounded border-[#BD9256] text-[#BD9256] focus:ring-[#BD9256] w-4 h-4 cursor-pointer shadow-sm bg-white"
                    />
                  </div>

                  {/* Order Tag & Video Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    {isVideo && (
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>VIDEO</span>
                      </span>
                    )}
                    <span className="bg-[#14283B]/90 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      #{item.order ?? index + 1}
                    </span>
                  </div>

                  {/* Play Overlay if video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <div className="w-10 h-10 rounded-full bg-[#BD9256] text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Zoom overlay on click */}
                  <button
                    type="button"
                    onClick={() => setPreviewItem(item)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                    title="Click to preview"
                  >
                    <div className="px-3 py-1.5 rounded-full bg-white/90 text-[#14283B] text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <Eye className="w-3.5 h-3.5 text-[#BD9256]" />
                      <span>Preview</span>
                    </div>
                  </button>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title (Only if non-empty, otherwise clean badge) */}
                    <h4 className="font-serif font-bold text-sm text-[#14283B] line-clamp-1 mb-1">
                      {item.title?.trim() || <span className="text-gray-400 italic">No Title (Image Only)</span>}
                    </h4>

                    {/* Caption (if non-empty) */}
                    {('caption' in item && item.caption) || ('subtitle' in item && item.subtitle) ? (
                      <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                        {('caption' in item ? item.caption : (item as any).subtitle)}
                      </p>
                    ) : null}

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 mb-3">
                      {item.date && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#ebdcc9]">
                          <Calendar className="w-3 h-3 text-[#BD9256]" />
                          <span>{item.date}</span>
                        </span>
                      )}
                      {'location' in item && item.location && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#ebdcc9]">
                          <MapPin className="w-3 h-3 text-[#BD9256]" />
                          <span>{item.location}</span>
                        </span>
                      )}
                      {isVideo && vid?.duration && (
                        <span className="inline-flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#ebdcc9]">
                          <Clock className="w-3 h-3 text-[#BD9256]" />
                          <span>{vid.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-[#ebdcc9] flex items-center justify-between gap-1 text-xs">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition cursor-pointer ${
                        item.isActive !== false
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title={item.isActive !== false ? 'Click to hide from public gallery' : 'Click to publish'}
                    >
                      {item.isActive !== false ? 'Published' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Move up */}
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-[#14283B] disabled:opacity-30 rounded hover:bg-gray-100 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-gray-500 hover:text-[#14283B] disabled:opacity-30 rounded hover:bg-gray-100 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1 text-[#BD9256] hover:text-[#a87932] rounded hover:bg-amber-50 cursor-pointer"
                        title="Edit metadata & image"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSingle(item)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Single Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#ebdcc9] overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#14283B] text-white px-6 py-4 flex items-center justify-between border-b border-[#22354c] shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD9256] block">
                  {editingItem ? 'Edit Media Record' : 'Add Single Item'}
                </span>
                <h3 className="font-serif text-lg font-bold">
                  {editingItem ? 'Edit Gallery Details' : `Add Item to ${activeSubcategory.label}`}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Subcategory Select (MANDATORY) */}
              <div>
                <label className="block text-xs font-bold text-[#14283B] uppercase mb-1">
                  Subcategory <span className="text-red-500">* Required</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryCategoryKey })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                >
                  {SUBCATEGORIES.map((sub) => (
                    <option key={sub.key} value={sub.key}>
                      {sub.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  Moving this item to another subcategory will display it on that category&apos;s page.
                </p>
              </div>

              {/* Image or Video inputs */}
              {formData.category !== 'videos' ? (
                <div>
                  <label className="block text-xs font-bold text-[#14283B] uppercase mb-1">
                    Image File / Cloudinary URL <span className="text-red-500">* Required</span>
                  </label>
                  <CloudinaryUploadWidget
                    label="Upload / Replace Gallery Image"
                    subfolder={`gallery/${formData.category}`}
                    currentImageUrl={formData.image}
                    onImageUploaded={(url, publicId) => {
                      setFormData({
                        ...formData,
                        image: url,
                        imageUrl: url,
                        publicId: publicId || '',
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#ebdcc9]">
                  <div>
                    <label className="block text-xs font-bold text-[#14283B] uppercase mb-1">
                      YouTube URL or Embed Link <span className="text-red-500">* Required</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                        Channel / Source (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Janta Live News"
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                        Video Duration (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 18:45"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                      Custom Thumbnail (Optional — auto uses YouTube if blank)
                    </label>
                    <CloudinaryUploadWidget
                      label="Upload Custom Thumbnail"
                      subfolder="gallery/videos"
                      currentImageUrl={formData.image}
                      onImageUploaded={(url, publicId) => {
                        setFormData({
                          ...formData,
                          image: url,
                          imageUrl: url,
                          publicId: publicId || '',
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Optional Metadata Fields */}
              <div className="pt-2 border-t border-[#ebdcc9] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD9256] block">
                  Optional Details (Leave blank for clean image-only display)
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified Certificate of Appreciation"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Caption / Subtitle (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Outstanding Humanitarian Contribution"
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Date (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Jan 2024"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, India"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                      Photographer / Credit (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Media Desk"
                      value={formData.photographer}
                      onChange={(e) => setFormData({ ...formData, photographer: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief archival summary..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded-lg focus:outline-none focus:border-[#BD9256]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#ebdcc9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d6c7b3] text-[#14283B] font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#BD9256] hover:bg-[#a87932] text-white font-bold rounded-lg shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Publish Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#BD9256]">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white hover:bg-black rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/3] bg-black flex items-center justify-center">
              {'embedUrl' in previewItem && previewItem.embedUrl ? (
                <iframe
                  src={previewItem.embedUrl}
                  title={previewItem.title || 'Video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={('image' in previewItem ? previewItem.image : (previewItem as any).thumbnail)}
                  alt={previewItem.title || 'Preview'}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-5 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256]">
                {SUBCATEGORIES.find((s) => s.key === previewItem.category)?.label}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#14283B] mt-0.5">
                {previewItem.title || 'Untitled Image'}
              </h3>
              {previewItem.description && (
                <p className="text-xs text-gray-600 mt-1">{previewItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
