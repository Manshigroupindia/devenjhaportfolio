import React from 'react';
import { GalleryPageLayout } from '../../components/gallery/GalleryPageLayout.tsx';
import { GalleryCategoryKey } from '../../types/gallery.ts';

interface InvitationsPageProps {
  onSelectCategory?: (key: GalleryCategoryKey) => void;
  onNavigateHome?: () => void;
}

export const InvitationsPage: React.FC<InvitationsPageProps> = () => {
  return <GalleryPageLayout category="invitations" />;
};

