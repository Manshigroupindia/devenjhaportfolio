import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  FileImage,
  RefreshCw,
  Plus,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.ts';
import { uploadToCloudinary } from '../../lib/cloudinary.ts';
import { GalleryCategoryKey } from '../../types/gallery.ts';

export interface BulkGalleryItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  title?: string;
  caption?: string;
  description?: string;
  date?: string;
  location?: string;
  photographer?: string;
  isExpanded?: boolean;
}

interface BulkGalleryMediaUploaderProps {
  category: GalleryCategoryKey;
  categoryLabel: string;
  currentItemsCount: number;
  onUploadSuccess: () => void;
  onClose?: () => void;
}

export const BulkGalleryMediaUploader: React.FC<BulkGalleryMediaUploaderProps> = ({
  category,
  categoryLabel,
  currentItemsCount,
  onUploadSuccess,
  onClose,
}) => {
  const [items, setItems] = useState<BulkGalleryItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallSummary, setOverallSummary] = useState<{
    total: number;
    uploaded: number;
    failed: number;
  } | null>(null);

  // Optional batch defaults
  const [showBatchDefaults, setShowBatchDefaults] = useState(false);
  const [commonDate, setCommonDate] = useState('');
  const [commonLocation, setCommonLocation] = useState('');
  const [commonCaption, setCommonCaption] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files to selection queue
  const addFiles = (fileList: FileList | File[]) => {
    const newItems: BulkGalleryItem[] = [];
    const existingNames = new Set(items.map((i) => `${i.file.name}_${i.file.size}`));

    Array.from(fileList).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const key = `${file.name}_${file.size}`;
      if (existingNames.has(key)) return; // prevent duplicate addition

      existingNames.add(key);
      newItems.push({
        id: `bulk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'idle',
        progress: 0,
        date: commonDate,
        location: commonLocation,
        caption: commonCaption,
      });
    });

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setOverallSummary(null);
    }
  };

  const handleFilePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => {
      if (i.previewUrl && i.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(i.previewUrl);
      }
    });
    setItems([]);
    setOverallSummary(null);
  };

  const updateItemField = (id: string, field: keyof BulkGalleryItem, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const toggleExpand = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isExpanded: !i.isExpanded } : i))
    );
  };

  // Execute bulk upload to Cloudinary and Firestore
  const handleStartUpload = async () => {
    if (items.length === 0 || isUploading) return;

    setIsUploading(true);
    setOverallSummary(null);

    let successCount = 0;
    let failedCount = 0;

    for (let index = 0; index < items.length; index++) {
      const current = items[index];

      // Skip already uploaded
      if (current.status === 'success') {
        successCount++;
        continue;
      }

      setItems((prev) =>
        prev.map((i) => (i.id === current.id ? { ...i, status: 'uploading', progress: 5, error: undefined } : i))
      );

      try {
        // Step 1: Upload to Cloudinary under folder 'gallery/<category>'
        const folderPath = `gallery/${category}`;
        const uploadRes = await uploadToCloudinary(current.file, folderPath, (pct) => {
          setItems((prev) =>
            prev.map((i) => (i.id === current.id ? { ...i, progress: pct } : i))
          );
        });

        if (!uploadRes || !uploadRes.secureUrl) {
          throw new Error('Cloudinary did not return a valid secure URL.');
        }

        // Step 2: Prepare sanitized Firestore payload (Subcategory is mandatory, everything else optional)
        const docId = `gallery-${category}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const orderIndex = currentItemsCount + index + 1;
        const nowIso = new Date().toISOString();

        const docPayload: Record<string, any> = {
          id: docId,
          category,
          image: uploadRes.secureUrl,
          imageUrl: uploadRes.secureUrl,
          publicId: uploadRes.publicId || '',
          title: (current.title || '').trim(),
          description: (current.description || '').trim(),
          caption: (current.caption || commonCaption || '').trim(),
          date: (current.date || commonDate || '').trim(),
          location: (current.location || commonLocation || '').trim(),
          photographer: (current.photographer || '').trim(),
          order: orderIndex,
          isActive: true,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        // Step 3: Write to Firestore collection 'gallery_media'
        await setDoc(doc(db, 'gallery_media', docId), docPayload, { merge: true });

        // Step 4: Revoke temporary blob URL and mark success
        if (current.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(current.previewUrl);
        }

        setItems((prev) =>
          prev.map((i) =>
            i.id === current.id
              ? {
                  ...i,
                  status: 'success',
                  progress: 100,
                  previewUrl: uploadRes.secureUrl,
                }
              : i
          )
        );
        successCount++;
        onUploadSuccess();
      } catch (err: any) {
        console.error(`Bulk upload failed for ${current.file.name}:`, err);
        setItems((prev) =>
          prev.map((i) =>
            i.id === current.id
              ? {
                  ...i,
                  status: 'error',
                  progress: 0,
                  error: err?.message || 'Upload to Cloudinary or Firestore failed.',
                }
              : i
          )
        );
        failedCount++;
      }
    }

    setIsUploading(false);
    setOverallSummary({
      total: items.length,
      uploaded: successCount,
      failed: failedCount,
    });
  };

  const idleCount = items.filter((i) => i.status === 'idle').length;
  const successCount = items.filter((i) => i.status === 'success').length;
  const errorCount = items.filter((i) => i.status === 'error').length;

  return (
    <div className="bg-white rounded-2xl border border-[#ebdcc9] shadow-lg p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#ebdcc9] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#14283B] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
            <span>{categoryLabel}</span>
            <span className="text-[#BD9256]">Bulk Uploader</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#14283B]">
            Upload Multiple Images — {categoryLabel}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select multiple images at once. <strong className="text-[#14283B]">Category is the only required field</strong>; all captions, titles and dates are optional.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-[#14283B] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Drag & Drop File Picker Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#BD9256] bg-[#fbf8f2] scale-[1.01]'
            : 'border-[#d8cbba] hover:border-[#BD9256] bg-[#faf8f5]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilePickerChange}
        />
        <div className="w-14 h-14 rounded-2xl bg-[#BD9256]/15 text-[#BD9256] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>
        <h4 className="font-serif font-bold text-base text-[#14283B] mb-1">
          Drag and drop images here, or <span className="text-[#BD9256] underline">browse files</span>
        </h4>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Supports multiple JPG, PNG, WEBP files. You can select 10, 20 or more images at once.
        </p>
      </div>

      {/* Optional Batch Defaults Collapsible */}
      {items.length > 0 && (
        <div className="bg-[#FAF8F5] rounded-xl border border-[#ebdcc9] p-4 text-xs">
          <button
            type="button"
            onClick={() => setShowBatchDefaults(!showBatchDefaults)}
            className="w-full flex items-center justify-between font-semibold text-[#14283B] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#BD9256]" />
              <span>Optional Batch Metadata (Apply to all queued images)</span>
            </span>
            {showBatchDefaults ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showBatchDefaults && (
            <div className="mt-3 pt-3 border-t border-[#ebdcc9] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                  Common Date (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Jan 2024"
                  value={commonDate}
                  onChange={(e) => {
                    setCommonDate(e.target.value);
                    setItems((prev) =>
                      prev.map((i) => (i.status === 'idle' ? { ...i, date: e.target.value } : i))
                    );
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                  Common Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={commonLocation}
                  onChange={(e) => {
                    setCommonLocation(e.target.value);
                    setItems((prev) =>
                      prev.map((i) => (i.status === 'idle' ? { ...i, location: e.target.value } : i))
                    );
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#14283B] uppercase mb-1">
                  Common Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual convention"
                  value={commonCaption}
                  onChange={(e) => {
                    setCommonCaption(e.target.value);
                    setItems((prev) =>
                      prev.map((i) => (i.status === 'idle' ? { ...i, caption: e.target.value } : i))
                    );
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Alert if upload finished */}
      {overallSummary && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
            overallSummary.failed === 0
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {overallSummary.failed === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>
              <strong>Upload Completed:</strong> {overallSummary.uploaded} of {overallSummary.total} image(s) saved directly to Firestore under <strong>{categoryLabel}</strong>.
              {overallSummary.failed > 0 && ` (${overallSummary.failed} failed — see individual items below)`}
            </span>
          </div>
          {overallSummary.failed === 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-bold underline hover:text-emerald-950 cursor-pointer ml-4 shrink-0"
            >
              Clear Queue
            </button>
          )}
        </div>
      )}

      {/* Selected Images List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#14283B]">
            <span>
              Selected Images ({items.length}) — {successCount} uploaded, {idleCount} ready, {errorCount} errors
            </span>
            {!isUploading && (
              <button
                type="button"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  item.status === 'success'
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : item.status === 'error'
                    ? 'border-red-300 bg-red-50/40'
                    : item.status === 'uploading'
                    ? 'border-[#BD9256] bg-amber-50/30'
                    : 'border-[#e2d6c5] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-mono">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#14283B] truncate">
                        {item.title || item.file.name}
                      </p>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {(item.file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>

                    {/* Status pill & Progress */}
                    <div className="mt-1 flex items-center gap-2">
                      {item.status === 'idle' && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Ready to upload
                        </span>
                      )}
                      {item.status === 'uploading' && (
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#BD9256] transition-all duration-200"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-[#BD9256] shrink-0">
                            {item.progress}%
                          </span>
                        </div>
                      )}
                      {item.status === 'success' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Uploaded to Cloudinary &amp; Saved</span>
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          <AlertCircle className="w-3 h-3" />
                          <span>{item.error || 'Failed'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="p-1.5 text-gray-400 hover:text-[#14283B] rounded hover:bg-gray-100 cursor-pointer text-[11px]"
                      title="Edit optional metadata"
                    >
                      {item.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {!isUploading && item.status !== 'success' && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 cursor-pointer"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional expanded metadata fields */}
                {item.isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Award Citation"
                        value={item.title || ''}
                        onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                        disabled={item.status === 'success' || isUploading}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                        Caption / Subtitle (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. National convention"
                        value={item.caption || ''}
                        onChange={(e) => updateItemField(item.id, 'caption', e.target.value)}
                        disabled={item.status === 'success' || isUploading}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                        Date (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Oct 2023"
                        value={item.date || ''}
                        onChange={(e) => updateItemField(item.id, 'date', e.target.value)}
                        disabled={item.status === 'success' || isUploading}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-[#d6c7b3] rounded focus:outline-none focus:border-[#BD9256]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="pt-3 border-t border-[#ebdcc9] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Target: <strong className="text-[#14283B]">Gallery &rarr; {categoryLabel}</strong>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-4 py-2.5 border border-[#d6c7b3] text-[#14283B] font-semibold text-xs rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Done / Close
                </button>
              )}

              <button
                type="button"
                onClick={handleStartUpload}
                disabled={isUploading || idleCount === 0}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#BD9256] hover:bg-[#a87932] disabled:bg-gray-300 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading ({successCount + errorCount}/{items.length})...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload {idleCount} Images to {categoryLabel}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

