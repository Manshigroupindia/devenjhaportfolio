import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Link as LinkIcon, X } from 'lucide-react';
import { uploadToCloudinary } from '../../lib/cloudinary.ts';

interface CloudinaryUploadWidgetProps {
  currentImageUrl?: string;
  subfolder: 'home' | 'about' | 'print-media' | 'business-logos' | 'general';
  label?: string;
  helperText?: string;
  onImageUploaded: (url: string) => void;
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  currentImageUrl,
  subfolder,
  label = 'Upload Image',
  helperText = 'PNG, JPG or WebP up to 10MB',
  onImageUploaded,
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [directUrl, setDirectUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);
    setProgress(0);

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const result = await uploadToCloudinary(file, subfolder, (pct) => {
        setProgress(pct);
      });
      setPreview(result.secureUrl);
      setSuccess(true);
      onImageUploaded(result.secureUrl);
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setError(err.message || 'Upload failed. Check Cloudinary upload preset.');
    } finally {
      setUploading(false);
    }
  };

  const handleApplyDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUrl.trim()) return;
    setPreview(directUrl.trim());
    setSuccess(true);
    setError(null);
    onImageUploaded(directUrl.trim());
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
            className="hidden"
          />

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
              uploading
                ? 'bg-slate-50 border-amber-400 cursor-wait'
                : 'bg-white hover:bg-[#faf7f2] border-slate-300 hover:border-[#b8863b]'
            }`}
          >
            {uploading ? (
              <div className="py-3">
                <div className="w-8 h-8 border-3 border-[#b8863b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Uploading to Cloudinary ({subfolder})... {progress}%
                </p>
                <div className="w-48 bg-slate-200 h-1.5 rounded-full mx-auto mt-2 overflow-hidden">
                  <div
                    className="bg-[#b8863b] h-full transition-all duration-200"
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
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-[11.5px]">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-[11.5px]">
          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Image ready and attached to this record!</span>
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {preview && (
        <div className="mt-2 relative inline-block group">
          <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Image failed to render from specified source.')}
            />
          </div>
          <span className="block text-[10px] text-slate-500 mt-1 max-w-xs truncate">
            {preview}
          </span>
        </div>
      )}
    </div>
  );
};

