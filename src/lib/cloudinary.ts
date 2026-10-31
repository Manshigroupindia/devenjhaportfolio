/**
 * Cloudinary Unsigned Upload Service
 * Safe for client-side uploads without exposing Cloudinary API Secret.
 */

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryVideoUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  duration?: number;
  resourceType: 'video';
  thumbnailUrl: string;
}

export const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
export const SUPPORTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vzyortxi';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_unsigned';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '765291828458343';
const BASE_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'portfolio';

/**
 * Upload an image file to Cloudinary unsigned preset.
 * @param file - File object to upload
 * @param subfolder - Subfolder relative to root (e.g., 'home', 'about', 'print-media', 'business-logos')
 * @param onProgress - Optional callback for upload progress (0-100)
 */
export async function uploadToCloudinary(
  file: File,
  subfolder: string = 'general',
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const targetFolder = `${BASE_FOLDER}/${subfolder}`;
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', targetFolder);
  if (API_KEY) {
    formData.append('api_key', API_KEY);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.url,
            secureUrl: response.secure_url,
            publicId: response.public_id,
            format: response.format,
            width: response.width,
            height: response.height,
            bytes: response.bytes,
          });
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        let errorDetails = xhr.responseText;
        try {
          const errObj = JSON.parse(xhr.responseText);
          errorDetails = errObj.error?.message || xhr.responseText;
        } catch {
          // keep errorDetails as is
        }
        reject(
          new Error(
            `Cloudinary Upload Failed (${xhr.status}): ${errorDetails}. Please ensure unsigned upload preset "${UPLOAD_PRESET}" is enabled in Cloudinary console.`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while uploading to Cloudinary.'));
    };

    xhr.send(formData);
  });
}

/**
 * Upload a direct video file (MP4, WebM, MOV) to Cloudinary video storage.
 * @param file - Video File object to upload
 * @param subfolder - Subfolder relative to root (defaults to 'videos')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @param onRegisterCancel - Optional callback to register an abort/cancel function
 */
export async function uploadVideoToCloudinary(
  file: File,
  subfolder: string = 'videos',
  onProgress?: (percent: number) => void,
  onRegisterCancel?: (cancelFn: () => void) => void
): Promise<CloudinaryVideoUploadResult> {
  // 1. Validation: Max file size
  if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `Video file size (${sizeMb} MB) exceeds maximum allowed limit of 100 MB. Please compress the video or upload a smaller file.`
    );
  }

  // 2. Validation: Format
  const lowerName = file.name.toLowerCase();
  const isValidExtension = SUPPORTED_VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const isValidMime = file.type.startsWith('video/') || file.type === '';
  if (!isValidExtension && !isValidMime) {
    throw new Error('Unsupported video format. Please select an MP4, WebM, or MOV video file.');
  }

  const targetFolder = `${BASE_FOLDER}/${subfolder}`;
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', targetFolder);
  formData.append('resource_type', 'video');
  if (API_KEY) {
    formData.append('api_key', API_KEY);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onRegisterCancel) {
      onRegisterCancel(() => {
        xhr.abort();
        reject(new Error('Video upload was cancelled.'));
      });
    }

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;
          // Cloudinary automatically provides a JPEG poster thumbnail by replacing the video extension with .jpg
          const autoThumbnail = secureUrl ? secureUrl.replace(/\.[a-zA-Z0-9]+$/, '.jpg') : '';

          resolve({
            url: response.url,
            secureUrl: secureUrl,
            publicId: response.public_id,
            format: response.format || 'mp4',
            width: response.width,
            height: response.height,
            bytes: response.bytes,
            duration: response.duration,
            resourceType: 'video',
            thumbnailUrl: autoThumbnail,
          });
        } catch {
          reject(new Error('Failed to parse Cloudinary video upload response.'));
        }
      } else {
        let errorDetails = xhr.responseText;
        try {
          const errObj = JSON.parse(xhr.responseText);
          errorDetails = errObj.error?.message || xhr.responseText;
        } catch {
          // keep errorDetails
        }
        reject(
          new Error(
            `Cloudinary Video Upload Failed (${xhr.status}): ${errorDetails}. Please ensure unsigned upload preset "${UPLOAD_PRESET}" allows video resources.`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while uploading video to Cloudinary.'));
    };

    xhr.onabort = () => {
      reject(new Error('Video upload was cancelled by user.'));
    };

    xhr.send(formData);
  });
}

