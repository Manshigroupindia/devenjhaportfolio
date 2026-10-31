import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileVideo,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  RefreshCw,
  Film,
} from 'lucide-react';
import {
  uploadVideoToCloudinary,
  MAX_VIDEO_FILE_SIZE_BYTES,
  SUPPORTED_VIDEO_EXTENSIONS,
  CloudinaryVideoUploadResult,
} from '../../lib/cloudinary.ts';

interface CloudinaryVideoUploadWidgetProps {
  currentVideoUrl?: string;
  currentThumbnailUrl?: string;
  onVideoUploaded: (result: {
    videoUrl: string;
    thumbnailUrl: string;
    publicId: string;
    duration?: string;
    format: string;
  }) => void;
  onVideoRemoved?: () => void;
}

export const CloudinaryVideoUploadWidget: React.FC<CloudinaryVideoUploadWidgetProps> = ({
  currentVideoUrl,
  currentThumbnailUrl,
  onVideoUploaded,
  onVideoRemoved,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeFormatted: string;
    durationFormatted: string;
  } | null>(null);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(currentVideoUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelUploadRef = useRef<(() => void) | null>(null);

  // Sync internal state if currentVideoUrl prop updates
  useEffect(() => {
    setUploadedUrl(currentVideoUrl);
  }, [currentVideoUrl]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
      }
    };
  }, [localBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const mm = mins < 10 ? `0${mins}` : `${mins}`;
    const ss = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mm}:${ss}`;
  };

  const handleSelectFile = (file: File) => {
    setError(null);

    // Validate size
    if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
      setError(
        `Video size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 100 MB maximum limit. Please select a compressed file.`
      );
      return;
    }

    // Validate extension
    const lowerName = file.name.toLowerCase();
    const hasValidExt = SUPPORTED_VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    if (!hasValidExt && !file.type.startsWith('video/')) {
      setError('Unsupported video format. Please upload an MP4, WebM, or MOV file.');
      return;
    }

    // Revoke previous blob if any
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
    }

    const blobUrl = URL.createObjectURL(file);
    setLocalBlobUrl(blobUrl);
    setSelectedFile(file);

    // Read metadata & duration via temp video element
    const tempVid = document.createElement('video');
    tempVid.preload = 'metadata';
    tempVid.src = blobUrl;
    tempVid.onloadedmetadata = () => {
      setFileDetails({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        durationFormatted: formatDuration(tempVid.duration),
      });
    };
    tempVid.onerror = () => {
      setFileDetails({
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        durationFormatted: 'Unknown',
      });
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleSelectFile(file);
  };

  const handleUploadNow = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const res: CloudinaryVideoUploadResult = await uploadVideoToCloudinary(
        selectedFile,
        'videos',
        (pct) => setUploadProgress(pct),
        (cancelFn) => {
          cancelUploadRef.current = cancelFn;
        }
      );

      setUploadedUrl(res.secureUrl);
      setSelectedFile(null);
      if (localBlobUrl) {
        URL.revokeObjectURL(localBlobUrl);
        setLocalBlobUrl(null);
      }

      onVideoUploaded({
        videoUrl: res.secureUrl,
        thumbnailUrl: res.thumbnailUrl,
        publicId: res.publicId,
        duration: fileDetails?.durationFormatted || (res.duration ? formatDuration(res.duration) : undefined),
        format: res.format,
      });
    } catch (err: any) {
      setError(err?.message || 'Video upload failed.');
    } finally {
      setIsUploading(false);
      cancelUploadRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (cancelUploadRef.current) {
      cancelUploadRef.current();
      cancelUploadRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleRemoveCurrent = () => {
    if (localBlobUrl) {
      URL.revokeObjectURL(localBlobUrl);
      setLocalBlobUrl(null);
    }
    setSelectedFile(null);
    setFileDetails(null);
    setUploadedUrl(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onVideoRemoved) {
      onVideoRemoved();
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelectFile(file);
        }}
      />

      {/* Case 1: Already uploaded Cloudinary video active */}
      {uploadedUrl && !selectedFile && (
        <div className="bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14283B]">
              <Film className="w-4 h-4 text-[#BD9256]" />
              Uploaded Video Ready
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-[#BD9256] hover:text-[#a87932] underline cursor-pointer"
            >
              Replace Video
            </button>
          </div>

          <div className="relative aspect-video max-h-56 bg-black rounded-lg overflow-hidden border border-[#d6c7b3]">
            <video
              src={uploadedUrl}
              poster={currentThumbnailUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span className="truncate max-w-[280px]" title={uploadedUrl}>
              Cloudinary: {uploadedUrl}
            </span>
            <button
              type="button"
              onClick={handleRemoveCurrent}
              className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Case 2: Selected file preview before / during upload */}
      {selectedFile && (
        <div className="bg-[#FAF8F5] border border-[#BD9256]/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4 text-[#BD9256]" />
              <span className="text-xs font-bold text-[#14283B] truncate max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </span>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveCurrent}
                className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                title="Cancel selection"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Local Video Preview */}
          {localBlobUrl && (
            <div className="relative aspect-video max-h-52 bg-black rounded-lg overflow-hidden border border-[#d6c7b3]">
              <video
                src={localBlobUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* File Meta Pill Row */}
          {fileDetails && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-[#e2d6c5]">
                <HardDrive className="w-3 h-3 text-[#BD9256]" />
                {fileDetails.sizeFormatted}
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-[#e2d6c5]">
                <Clock className="w-3 h-3 text-[#BD9256]" />
                Duration: {fileDetails.durationFormatted}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Format Validated
              </span>
            </div>
          )}

          {/* Progress Bar (during upload) */}
          {isUploading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#14283B]">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#BD9256]" />
                  Uploading Video to Cloudinary...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#BD9256] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions: Start Upload or Cancel */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#ebdcc9]">
            {isUploading ? (
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
              >
                Cancel Upload
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRemoveCurrent}
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Choose Different File
                </button>
                <button
                  type="button"
                  onClick={handleUploadNow}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#BD9256] hover:bg-[#a87932] text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Video Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Case 3: Empty Dropzone */}
      {!uploadedUrl && !selectedFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#BD9256] bg-[#f7efe3]'
              : 'border-[#d6c7b3] hover:border-[#BD9256] bg-[#faf8f5] hover:bg-white'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#eee5d8] text-[#BD9256] flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-[#14283B] mb-1">
            Click to select video or drag and drop file here
          </p>
          <p className="text-[11px] text-gray-500 mb-2">
            MP4, WebM or MOV up to 100 MB
          </p>
          <span className="inline-block px-3 py-1 bg-white border border-[#d6c7b3] text-[#14283B] text-[11px] font-semibold rounded-md shadow-2xs">
            Browse Video File
          </span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

