import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface CelebritiesPageProps {
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const CelebritiesPage: React.FC<CelebritiesPageProps> = () => {
  return <GalleryPageLayout category="celebrities" />;
};

