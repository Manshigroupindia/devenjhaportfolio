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

export interface BulkUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  title?: string;
  publication?: string;
  date?: string;
  category?: string;
  caption?: string;
  description?: string;
  isExpanded?: boolean;
}

interface BulkPrintMediaUploaderProps {
  currentItemsCount: number;
  onUploadSuccess: () => void;
  onClose?: () => void;
}

export const BulkPrintMediaUploader: React.FC<BulkPrintMediaUploaderProps> = ({
  currentItemsCount,
  onUploadSuccess,
  onClose,
}) => {
  const [items, setItems] = useState<BulkUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallSummary, setOverallSummary] = useState<{
    total: number;
    uploaded: number;
    failed: number;
  } | null>(null);

  // Common optional metadata batch defaults
  const [commonPublication, setCommonPublication] = useState('');
  const [commonCategory, setCommonCategory] = useState('National Daily');
  const [commonDate, setCommonDate] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files to queue
  const addFiles = (fileList: FileList | File[]) => {
    const newItems: BulkUploadItem[] = [];
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
        publication: commonPublication,
        category: commonCategory,
        date: commonDate,
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
    // reset input so the same files could be re-selected if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers
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

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleClearCompleted = () => {
    setItems((prev) => {
      prev.filter((i) => i.status === 'success').forEach((i) => URL.revokeObjectURL(i.previewUrl));
      return prev.filter((i) => i.status !== 'success');
    });
    setOverallSummary(null);
  };

  const handleClearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    setOverallSummary(null);
  };

  const toggleExpand = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isExpanded: !item.isExpanded } : item))
    );
  };

  const updateItemField = (id: string, field: keyof BulkUploadItem, val: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Upload all queued items
  const handleUploadAll = async () => {
    const pendingItems = items.filter((i) => i.status === 'idle' || i.status === 'error');
    if (pendingItems.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let index = 0; index < pendingItems.length; index++) {
      const current = pendingItems[index];

      // Update state to uploading
      setItems((prev) =>
        prev.map((i) => (i.id === current.id ? { ...i, status: 'uploading', progress: 5, error: undefined } : i))
      );

      try {
        // 1. Upload to Cloudinary under subfolder 'print-media'
        const uploadRes = await uploadToCloudinary(current.file, 'print-media', (pct) => {
          setItems((prev) =>
            prev.map((i) => (i.id === current.id ? { ...i, progress: pct } : i))
          );
        });

        // 2. Prepare safe sanitized Firestore document (NO undefined values)
        const docId = `print-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const orderIndex = currentItemsCount + index + 1;
        const nowIso = new Date().toISOString();

        const docPayload: Record<string, any> = {
          id: docId,
          image: uploadRes.secureUrl,
          imageUrl: uploadRes.secureUrl,
          publicId: uploadRes.publicId || '',
          title: (current.title || '').trim(),
          publication: (current.publication || commonPublication || '').trim(),
          date: (current.date || commonDate || '').trim(),
          category: (current.category || commonCategory || 'National Daily').trim(),
          clippingSnippet: (current.caption || '').trim(),
          description: (current.description || '').trim(),
          order: orderIndex,
          isActive: true,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        // Write directly to Firestore media_print
        await setDoc(doc(db, 'media_print', docId), docPayload, { merge: true });

        // Update item status to success
        setItems((prev) =>
          prev.map((i) =>
            i.id === current.id ? { ...i, status: 'success', progress: 100 } : i
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
                  error: err?.message || 'Upload failed',
                }
              : i
          )
        );
        failCount++;
      }
    }

    setIsUploading(false);
    setOverallSummary({
      total: pendingItems.length,
      uploaded: successCount,
      failed: failCount,
    });
  };

  const pendingCount = items.filter((i) => i.status === 'idle' || i.status === 'error').length;
  const completedCount = items.filter((i) => i.status === 'success').length;

  return (
    <div className="bg-white rounded-2xl border border-[#e5decb] shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8863b]/15 text-[#b8863b] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#111c2a]">
              Bulk Newspaper Clipping Upload
            </h3>
            <p className="text-xs text-slate-500">
              Select or drop multiple clipping images. Text metadata is 100% optional.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg self-start sm:self-auto"
            title="Close Bulk Uploader"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Optional Batch Settings Card */}
      <div className="bg-[#faf7f2] p-4 rounded-xl border border-[#ebdcc9] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#a87932]">
            Batch Defaults (Optional)
          </span>
          <span className="text-[10.5px] text-slate-500 italic">
            Applied to uploaded images unless customized below
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
              Publication Name (Optional)
            </label>
            <input
              type="text"
              value={commonPublication}
              onChange={(e) => setCommonPublication(e.target.value)}
              placeholder="e.g. Dainik Jagran"
              disabled={isUploading}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
              Category
            </label>
            <select
              value={commonCategory}
              onChange={(e) => setCommonCategory(e.target.value)}
              disabled={isUploading}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            >
              <option value="National Daily">National Daily</option>
              <option value="Magazine">Magazine</option>
              <option value="Press Feature">Press Feature</option>
              <option value="Regional">Regional</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">
              Publication Date (Optional)
            </label>
            <input
              type="text"
              value={commonDate}
              onChange={(e) => setCommonDate(e.target.value)}
              placeholder="e.g. 15 Aug 2024"
              disabled={isUploading}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>
        </div>
      </div>

      {/* Drag & Drop File Picker Zone */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilePickerChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'bg-amber-50/70 border-[#b8863b] scale-[1.01]'
            : 'bg-white hover:bg-[#faf7f2] border-slate-300 hover:border-[#b8863b]'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#f8f4ec] text-[#b8863b] flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="font-serif font-bold text-sm text-[#111c2a]">
            Choose images or drag &amp; drop here
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Select multiple clipping photos, scans or newspaper articles (JPG, PNG, WebP).
          </p>
          <span className="inline-block mt-3 px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-full">
            Browse Multiple Files
          </span>
        </div>
      </div>

      {/* Overall Summary Notice */}
      {overallSummary && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            overallSummary.failed === 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Batch complete! <strong>{overallSummary.uploaded}</strong> of{' '}
              <strong>{overallSummary.total}</strong> clippings successfully uploaded to Cloudinary &amp; published to Firestore.
              {overallSummary.failed > 0 && ` (${overallSummary.failed} failed - you can retry them below)`}
            </span>
          </div>

          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="text-xs font-semibold underline text-slate-700 hover:text-black cursor-pointer ml-3"
            >
              Clear Completed
            </button>
          )}
        </div>
      )}

      {/* Selected Images List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-[#111c2a]">
              Selected Files ({items.length}) •{' '}
              <span className="text-emerald-600 font-semibold">{completedCount} uploaded</span>
              {pendingCount > 0 && `, ${pendingCount} pending`}
            </span>

            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  disabled={isUploading}
                  className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Clear Uploaded
                </button>
              )}
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isUploading}
                className="text-xs text-red-600 hover:text-red-700 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all text-xs bg-white ${
                  item.status === 'success'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : item.status === 'error'
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-slate-200 hover:border-[#b8863b]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail preview */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate text-xs">
                        {item.file.name}
                      </p>
                      <p className="text-[10.5px] text-slate-400">
                        {(item.file.size / 1024).toFixed(1)} KB
                      </p>

                      {/* Status indicator */}
                      <div className="mt-1 flex items-center gap-1.5">
                        {item.status === 'idle' && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            Ready to upload
                          </span>
                        )}
                        {item.status === 'uploading' && (
                          <span className="text-[10px] text-[#b8863b] font-semibold flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Uploading ({item.progress}%)
                          </span>
                        )}
                        {item.status === 'success' && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Published to Firestore
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            {item.error || 'Failed'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Optional metadata expand button */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-700 cursor-pointer"
                    >
                      <span>{item.isExpanded ? 'Hide Info' : 'Edit Details'}</span>
                      {item.isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={item.status === 'uploading'}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded disabled:opacity-30 cursor-pointer"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                {item.status === 'uploading' && (
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#b8863b] h-full transition-all duration-150"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {/* Optional Expanded Metadata Fields */}
                {item.isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                        placeholder="Article Headline..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Publication (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.publication || ''}
                        onChange={(e) => updateItemField(item.id, 'publication', e.target.value)}
                        placeholder={commonPublication || 'e.g. The Times of India'}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Date (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) => updateItemField(item.id, 'date', e.target.value)}
                        placeholder={commonDate || 'e.g. 12 Mar 2024'}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
                        Caption / Snippet (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => updateItemField(item.id, 'caption', e.target.value)}
                        placeholder="Quote or Hindi text snippet..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-[#b8863b]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {pendingCount} clipping{pendingCount === 1 ? '' : 's'} ready to publish
            </span>

            <button
              type="button"
              onClick={handleUploadAll}
              disabled={isUploading || pendingCount === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b8863b] hover:bg-[#a0742f] text-white rounded-lg text-xs font-bold shadow-md hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload &amp; Publish All ({pendingCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
