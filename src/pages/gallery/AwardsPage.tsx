import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface AwardsPageProps {
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = () => {
  return <GalleryPageLayout category="awards" />;
};

