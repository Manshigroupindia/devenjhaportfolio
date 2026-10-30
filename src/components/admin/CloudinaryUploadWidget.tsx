import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Link as LinkIcon, X, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary.ts';

interface CloudinaryUploadWidgetProps {
  currentImageUrl?: string;
  subfolder: 'home' | 'about' | 'print-media' | 'business-logos' | 'general';
  label?: string;
  helperText?: string;
  onImageUploaded: (url: string, publicId?: string) => void;
  onImageRemoved?: () => void;
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  currentImageUrl,
  subfolder,
  label = 'Upload Image',
  helperText = 'PNG, JPG or WebP up to 10MB',
  onImageUploaded,
  onImageRemoved,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [directUrl, setDirectUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [createdBlobUrl, setCreatedBlobUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal preview state whenever currentImageUrl prop changes
  useEffect(() => {
    setPreview(currentImageUrl);
    setError(null);
    setSuccess(false);
  }, [currentImageUrl]);

  // Clean up any lingering object URLs on unmount
  useEffect(() => {
    return () => {
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [createdBlobUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Revoke previous blob if any
    if (createdBlobUrl) {
      URL.revokeObjectURL(createdBlobUrl);
    }

    setError(null);
    setSuccess(false);
    setUploading(true);
    setProgress(0);

    // Temporary local preview while upload progresses
    const localBlob = URL.createObjectURL(file);
    setCreatedBlobUrl(localBlob);
    setPreview(localBlob);

    try {
      const result = await uploadToCloudinary(file, subfolder, (pct) => {
        setProgress(pct);
      });

      // Revoke temporary blob and set authoritative Cloudinary secure URL
      URL.revokeObjectURL(localBlob);
      setCreatedBlobUrl(null);
      setPreview(result.secureUrl);
      setSuccess(true);
      setError(null);

      // Pass both secure URL and Cloudinary public ID
      onImageUploaded(result.secureUrl, result.publicId);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      // Revert preview to original image if upload fails
      setPreview(currentImageUrl);
      setError(err.message || 'Upload failed. Check Cloudinary upload preset and internet connection.');
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = directUrl.trim();
    if (!cleanUrl) return;

    if (createdBlobUrl) {
      URL.revokeObjectURL(createdBlobUrl);
      setCreatedBlobUrl(null);
    }

    setPreview(cleanUrl);
    setSuccess(true);
    setError(null);
    onImageUploaded(cleanUrl);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (createdBlobUrl) {
      URL.revokeObjectURL(createdBlobUrl);
      setCreatedBlobUrl(null);
    }
    setPreview('');
    setSuccess(false);
    setError(null);
    if (onImageRemoved) {
      onImageRemoved();
    } else {
      onImageUploaded('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              mode === 'upload'
                ? 'bg-[#b8863b] text-white font-medium'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            File Upload
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              mode === 'url'
                ? 'bg-[#b8863b] text-white font-medium'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            disabled={uploading}
            className="hidden"
          />

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              uploading
                ? 'bg-amber-50/50 border-amber-400 cursor-wait'
                : 'bg-white hover:bg-[#faf7f2] border-slate-300 hover:border-[#b8863b]'
            }`}
          >
            {uploading ? (
              <div className="py-3">
                <RefreshCw className="w-7 h-7 text-[#b8863b] animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  Uploading to Cloudinary ({subfolder})... {progress}%
                </p>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Streaming image directly to Cloudinary media cloud
                </p>
                <div className="w-56 bg-slate-200 h-1.5 rounded-full mx-auto mt-2.5 overflow-hidden">
                  <div
                    className="bg-[#b8863b] h-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <UploadCloud className="w-8 h-8 text-[#a87932] mb-1.5" />
                <p className="text-xs font-medium text-slate-700">
                  Click to select an image from your computer
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="h-3.5 w-3.5" />
            </div>
            <input
              type="url"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#b8863b]"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyDirectUrl}
            className="px-3 py-2 bg-[#111c2a] hover:bg-[#1e2f47] text-white text-xs font-medium rounded-lg cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-[11.5px] animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-[11.5px] animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
          <span>Image uploaded to Cloudinary and ready to save!</span>
        </div>
      )}

      {/* Authoritative Image Preview Thumbnail */}
      {preview && (
        <div className="mt-2.5 flex items-start gap-3 bg-[#faf7f2] p-2.5 rounded-xl border border-[#ebdcc9]">
          <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs shrink-0 relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Image failed to render from specified source.')}
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#a87932] tracking-wider block">
                {preview.startsWith('https://res.cloudinary.com') ? 'Cloudinary Hosted' : 'Active Preview'}
              </span>
              <p className="text-[11px] text-slate-600 font-mono truncate mt-0.5" title={preview}>
                {preview}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="inline-flex items-center gap-1 text-[10.5px] text-red-600 hover:text-red-800 font-medium cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
