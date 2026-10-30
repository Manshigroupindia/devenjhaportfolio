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
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  description: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface GalleryVideoItem {
  id: string;
  category: 'videos';
  thumbnail: string;
  title: string;
  date?: string;
  channel?: string;
  duration?: string;
  embedUrl: string;
  description: string;
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
