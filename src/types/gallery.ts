export type GalleryCategoryKey =
  | 'awards'
  | 'celebrities'
  | 'social'
  | 'invitations'
  | 'videos'
  | 'personal';

export interface GalleryImageItem {
  id: string;
  category: GalleryCategoryKey;
  image: string;
  imageUrl?: string;
  publicId?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  date?: string;
  location?: string;
  photographer?: string;
  description?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryVideoItem {
  id: string;
  category: 'videos';
  thumbnail: string;
  title?: string;
  date?: string;
  channel?: string;
  duration?: string;
  embedUrl: string;
  youtubeUrl?: string;
  youtubeId?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryCategoryMeta {
  key: GalleryCategoryKey;
  route: string;
  navLabel: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  description: string;
}

