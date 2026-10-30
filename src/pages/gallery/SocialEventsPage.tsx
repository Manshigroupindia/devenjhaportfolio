import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface SocialEventsPageProps {
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const SocialEventsPage: React.FC<SocialEventsPageProps> = () => {
  return <GalleryPageLayout category="social" />;
};

