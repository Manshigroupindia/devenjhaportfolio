import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface VideosPageProps {
  onSelectCategory: (key: GalleryCategoryKey) => void;
  onNavigateHome: () => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({
  onSelectCategory,
  onNavigateHome,
}) => {
  return (
    <GalleryPageLayout
      category="videos"
      onSelectCategory={onSelectCategory}
      onNavigateHome={onNavigateHome}
    />
  );
};

