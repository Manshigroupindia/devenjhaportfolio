import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface InvitationsPageProps {
  onSelectCategory: (key: GalleryCategoryKey) => void;
  onNavigateHome: () => void;
}

export const InvitationsPage: React.FC<InvitationsPageProps> = ({
  onSelectCategory,
  onNavigateHome,
}) => {
  return (
    <GalleryPageLayout
      category="invitations"
      onSelectCategory={onSelectCategory}
      onNavigateHome={onNavigateHome}
    />
  );
};
