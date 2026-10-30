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
  subfolder: 'home' | 'about' | 'print-media' | 'business-logos' | 'general' = 'general',
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
