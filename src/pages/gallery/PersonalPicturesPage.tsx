import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface PersonalPicturesPageProps {
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const PersonalPicturesPage: React.FC<PersonalPicturesPageProps> = () => {
  return <GalleryPageLayout category="personal" />;
};

