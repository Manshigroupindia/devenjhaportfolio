import React, { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { usePrintMedia } from '../../hooks/useCMSContent.ts';
import { PrintMediaDoc } from '../../types/cms.ts';
import { CloudinaryUploadWidget } from '../../components/admin/CloudinaryUploadWidget.tsx';
import { BulkPrintMediaUploader } from '../../components/admin/BulkPrintMediaUploader.tsx';
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
  Newspaper,
  Calendar,
  Save,
  Layers,
  LayoutGrid,
  List,
  CheckSquare,
  Square,
  UploadCloud,
  ImageIcon,
  RefreshCw,
} from 'lucide-react';

export const PrintMediaCMS: React.FC = () => {
  const { data: items, loading } = usePrintMedia(false); // false = include inactive

  // Mode state
  const [showBulkUploader, setShowBulkUploader] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Single Edit / Add modal
  const [editingItem, setEditingItem] = useState<PrintMediaDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Status and error toasts
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-select bulk deletion state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const initialFormState: PrintMediaDoc = {
    id: '',
    title: '',
    publication: '',
    date: '',
    category: 'National Daily',
    image: '',
    imageUrl: '',
    publicId: '',
    description: '',
    clippingSnippet: '',
    order: items.length + 1,
    isActive: true,
  };

  const [formData, setFormData] = useState<PrintMediaDoc>(initialFormState);

  // Helper to ensure NO undefined values are ever written to Firestore
  const sanitizeDocPayload = (payload: Record<string, any>) => {
    const clean: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      const val = payload[key];
      clean[key] = val !== undefined ? val : '';
    });
    return clean;
  };

  const openAddModal = () => {
    setFormData({
      ...initialFormState,
      id: `print-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: items.length + 1,
    });
    setEditingItem(null);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditModal = (item: PrintMediaDoc) => {
    setFormData({
      ...initialFormState,
      ...item,
      image: item.image || item.imageUrl || '',
      imageUrl: item.imageUrl || item.image || '',
      publicId: item.publicId || '',
    });
    setEditingItem(item);
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleToggleActive = async (item: PrintMediaDoc) => {
    try {
      const docRef = doc(db, 'media_print', item.id);
      await setDoc(docRef, { isActive: !item.isActive, updatedAt: new Date().toISOString() }, { merge: true });
      const label = item.title?.trim() || item.publication?.trim() || `Item #${item.order}`;
      setStatusMessage(`Clipping "${label.substring(0, 25)}" is now ${!item.isActive ? 'Published' : 'Hidden'}.`);
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
      const currentRef = doc(db, 'media_print', currentItem.id);
      const targetRef = doc(db, 'media_print', targetItem.id);

      await setDoc(currentRef, { order: targetItem.order }, { merge: true });
      await setDoc(targetRef, { order: currentItem.order }, { merge: true });

      setStatusMessage('Order updated successfully in Firestore.');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(`Failed to reorder: ${err.message}`);
    }
  };

  const handleDeleteSingle = async (item: PrintMediaDoc) => {
    const label = item.title?.trim() || item.publication?.trim() || 'this clipping';
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'media_print', item.id));
      setSelectedIds((prev) => prev.filter((id) => id !== item.id));
      setStatusMessage('Print media clipping deleted from Firestore.');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(`Failed to delete from Firestore: ${err.message}`);
    }
  };

  // Multi-select handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} selected print media clipping(s)? This action will remove them from Firestore.`
      )
    ) {
      return;
    }

    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteDoc(doc(db, 'media_print', id))));
      setStatusMessage(`Successfully deleted ${selectedIds.length} clipping(s) from Firestore.`);
      setSelectedIds([]);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(`Bulk deletion failed: ${err.message}`);
    } finally {
      setBulkDeleting(false);
    }
  };

  // Save single / edit modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Image is the ONLY mandatory field
    const imageUri = (formData.image || formData.imageUrl || '').trim();
    if (!imageUri) {
      setErrorMessage('Please upload or provide an image for the clipping.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const docId = formData.id || `print-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const nowIso = new Date().toISOString();

      const rawPayload = {
        id: docId,
        image: imageUri,
        imageUrl: imageUri,
        publicId: formData.publicId || '',
        title: (formData.title || '').trim(),
        publication: (formData.publication || '').trim(),
        date: (formData.date || '').trim(),
        category: (formData.category || 'National Daily').trim(),
        clippingSnippet: (formData.clippingSnippet || '').trim(),
        description: (formData.description || '').trim(),
        order: formData.order || items.length + 1,
        isActive: formData.isActive !== false,
        createdAt: formData.createdAt || nowIso,
        updatedAt: nowIso,
      };

      const sanitized = sanitizeDocPayload(rawPayload);

      // Commit directly to Firestore
      await setDoc(doc(db, 'media_print', docId), sanitized, { merge: true });

      setIsModalOpen(false);
      setStatusMessage(editingItem ? 'Clipping updated & saved to Firestore!' : 'New clipping published to Firestore!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      console.error('Error saving print media to Firestore:', err);
      setErrorMessage(err.message || 'Failed to save clipping to Firestore.');
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
            Print Media Coverage ({items.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cloudinary media hosting with live Firebase Firestore synchronization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bulk Upload Toggle Button */}
          <button
            onClick={() => setShowBulkUploader(!showBulkUploader)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              showBulkUploader
                ? 'bg-[#111c2a] text-white hover:bg-[#1a2c42]'
                : 'bg-white border border-[#b8863b] text-[#a87932] hover:bg-[#faf6ee]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{showBulkUploader ? 'Hide Bulk Upload' : 'Bulk Upload Images'}</span>
          </button>

          {/* Add Single Clipping Button */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Clipping</span>
          </button>
        </div>
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

      {/* BULK UPLOADER DRAWER / SECTION */}
      {showBulkUploader && (
        <BulkPrintMediaUploader
          currentItemsCount={items.length}
          onUploadSuccess={() => {
            setStatusMessage('Images successfully uploaded to Cloudinary and synchronized with Firestore.');
          }}
          onClose={() => setShowBulkUploader(false)}
        />
      )}

      {/* GALLERY TOOLBAR: Multi-select counter, bulk delete, and view toggle */}
      <div className="bg-white p-3.5 rounded-xl border border-[#e5decb] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Select all checkbox */}
          <button
            type="button"
            onClick={handleSelectAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === items.length ? (
              <CheckSquare className="w-4 h-4 text-[#b8863b]" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedIds.length === items.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>

          {/* Selection indicator & bulk delete action */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-xs font-bold text-[#b8863b] bg-amber-50 px-2 py-0.5 rounded">
                {selectedIds.length} selected
              </span>

              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{bulkDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}</span>
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggle (Table vs Visual Grid) */}
        <div className="flex items-center gap-1 text-slate-500 bg-[#faf7f2] p-1 rounded-lg border border-[#ebdcc9]">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#111c2a] shadow-xs font-bold' : 'hover:text-slate-800'
            }`}
            title="Dense Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              viewMode === 'grid' ? 'bg-white text-[#111c2a] shadow-xs font-bold' : 'hover:text-slate-800'
            }`}
            title="Visual Photo Gallery View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CLIPPINGS LIST: TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-[#e5decb] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf7f2] border-b border-[#ebdcc9] text-slate-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedIds.length === items.length}
                      onChange={handleSelectAll}
                      className="rounded text-[#b8863b] focus:ring-[#b8863b] h-3.5 w-3.5 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4 w-24">Image</th>
                  <th className="py-3 px-4">Title / Caption</th>
                  <th className="py-3 px-4">Publication</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Reorder</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No print media clippings found. Use &quot;Bulk Upload Images&quot; or &quot;Add Single Clipping&quot; to upload newspaper articles.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    const imageSrc = item.image || item.imageUrl || '';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#fbf9f5] transition-colors ${
                          isSelected ? 'bg-amber-50/40' : !item.isActive ? 'opacity-60 bg-slate-50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="rounded text-[#b8863b] focus:ring-[#b8863b] h-3.5 w-3.5 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-400 font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative group">
                            <img
                              src={imageSrc}
                              alt={item.title || 'Clipping'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {item.title?.trim() ? (
                            <h4 className="font-bold text-[#111c2a] line-clamp-1 mb-0.5">
                              {item.title}
                            </h4>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic block mb-0.5">
                              (Image-only clipping)
                            </span>
                          )}
                          <p className="text-[10.5px] text-slate-500 line-clamp-1">
                            {item.clippingSnippet || item.description || ''}
                          </p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {item.publication?.trim() ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {item.publication}
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {item.date?.trim() ? (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <Calendar className="w-3 h-3 text-[#a87932]" />
                              <span>{item.date}</span>
                            </div>
                          ) : (
                            <span className="text-[10.5px] text-slate-400">—</span>
                          )}
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
                              title="Edit / Replace Image"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(item)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Clipping"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CLIPPINGS LIST: VISUAL PHOTO GALLERY GRID */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item, index) => {
            const isSelected = selectedIds.includes(item.id);
            const imageSrc = item.image || item.imageUrl || '';

            return (
              <div
                key={item.id}
                className={`group bg-white rounded-xl overflow-hidden border transition-all flex flex-col justify-between shadow-xs relative ${
                  isSelected
                    ? 'border-[#b8863b] ring-2 ring-[#b8863b]/30'
                    : 'border-slate-200 hover:border-[#b8863b] hover:shadow-md'
                }`}
              >
                {/* Checkbox badge overlay */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(item.id)}
                    className="rounded text-[#b8863b] focus:ring-[#b8863b] h-4 w-4 bg-white/90 cursor-pointer shadow-xs"
                  />
                </div>

                {/* Status indicator badge */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`p-1 rounded-md text-[10px] font-bold cursor-pointer backdrop-blur-xs transition-colors shadow-xs ${
                      item.isActive
                        ? 'bg-emerald-600/90 text-white'
                        : 'bg-black/60 text-slate-300'
                    }`}
                    title={item.isActive ? 'Published - click to hide' : 'Hidden - click to publish'}
                  >
                    {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Aspect ratio clipping image frame */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={imageSrc}
                    alt={item.title || 'Clipping'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Information details */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#111c2a] line-clamp-1 mb-0.5">
                      {item.title?.trim() || '(Image Only)'}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {item.publication || item.date || `Position #${item.order}`}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-slate-600 hover:text-[#b8863b] flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(item)}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SINGLE CLIPPING ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-serif text-lg font-bold text-[#111c2a]">
                {editingItem ? 'Edit / Replace Print Clipping' : 'Add Single Print Clipping'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              {/* Image Upload Widget - Only Mandatory Field */}
              <div>
                <CloudinaryUploadWidget
                  subfolder="print-media"
                  label={editingItem ? 'Clipping Image * (Click to Replace)' : 'Clipping Image *'}
                  currentImageUrl={formData.image || formData.imageUrl}
                  helperText="Upload newspaper clipping scan, article photo or screenshot"
                  onImageUploaded={(url, publicId) => {
                    setFormData((prev) => ({
                      ...prev,
                      image: url,
                      imageUrl: url,
                      publicId: publicId || prev.publicId || '',
                    }));
                  }}
                  onImageRemoved={() => {
                    setFormData((prev) => ({
                      ...prev,
                      image: '',
                      imageUrl: '',
                      publicId: '',
                    }));
                  }}
                />
              </div>

              {/* Notice that text fields are optional */}
              <div className="p-3 bg-[#faf7f2] rounded-lg border border-[#ebdcc9] text-[11.5px] text-slate-600">
                <strong>Notice:</strong> All text fields below are optional. You can leave them blank and publish the clipping image directly.
              </div>

              {/* Title (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Article Title <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Social Leader Deven Jha Inspires Youth..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Publication Name (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.publication || ''}
                    onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                    placeholder="e.g. Dainik Jagran National"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>

                {/* Publication Date (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 12 Mar 2024"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category || 'National Daily'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#b8863b]"
                >
                  <option value="National Daily">National Daily</option>
                  <option value="Magazine">Magazine</option>
                  <option value="Press Feature">Press Feature</option>
                  <option value="Regional">Regional</option>
                </select>
              </div>

              {/* Caption / Snippet (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Caption / Excerpt Snippet <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.clippingSnippet || ''}
                  onChange={(e) => setFormData({ ...formData, clippingSnippet: e.target.value })}
                  placeholder="e.g. दैनिक जागरण: युवाओं को समाज सेवा की राह दिखाते..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional summary or full translation of the clipping..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#b8863b] focus:ring-[#b8863b] h-4 w-4 cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Visible on public website
                </label>
              </div>

              {/* Modal Buttons */}
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
                  <span>{submitting ? 'Saving to Firestore...' : editingItem ? 'Update Clipping' : 'Publish Clipping'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
