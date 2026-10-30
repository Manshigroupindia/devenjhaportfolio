import React, { useState, useEffect } from 'react';
import { Navbar, PageType } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BackToTop } from './components/BackToTop.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { MediaModal } from './components/MediaModal.tsx';
import { AllMediaModal } from './components/AllMediaModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { MediaPage } from './pages/MediaPage.tsx';
import { PrintMediaPage } from './pages/PrintMediaPage.tsx';
import { DigitalMediaPage } from './pages/DigitalMediaPage.tsx';
import { AwardsPage } from './pages/gallery/AwardsPage.tsx';
import { CelebritiesPage } from './pages/gallery/CelebritiesPage.tsx';
import { SocialEventsPage } from './pages/gallery/SocialEventsPage.tsx';
import { InvitationsPage } from './pages/gallery/InvitationsPage.tsx';
import { VideosPage } from './pages/gallery/VideosPage.tsx';
import { PersonalPicturesPage } from './pages/gallery/PersonalPicturesPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { MediaItem } from './components/MediaCoverage.tsx';
import { GalleryCategoryKey } from './types/gallery.ts';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (hash === '#/about' || hash === '#about' || path.endsWith('/about')) return 'about';
    if (hash === '#/media' || hash === '#media' || path.endsWith('/media')) return 'media';
    if (hash === '#/media/print' || hash === '#media-print') return 'media-print';
    if (hash === '#/media/digital' || hash === '#media-digital') return 'media-digital';

    if (hash === '#/gallery/awards' || hash === '#gallery-awards') return 'gallery-awards';
    if (hash === '#/gallery/celebrities' || hash === '#gallery-celebrities') return 'gallery-celebrities';
    if (hash === '#/gallery/social' || hash === '#gallery-social') return 'gallery-social';
    if (hash === '#/gallery/invitations' || hash === '#gallery-invitations') return 'gallery-invitations';
    if (hash === '#/gallery/videos' || hash === '#gallery-videos') return 'gallery-videos';
    if (hash === '#/gallery/personal' || hash === '#gallery-personal') return 'gallery-personal';
    if (hash === '#/contact' || hash === '#contact' || path.endsWith('/contact')) return 'contact';

    return 'home';
  });

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false);

  // Sync with browser back/forward history & hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/about' || hash === '#about') setCurrentPage('about');
      else if (hash === '#/media' || hash === '#media') setCurrentPage('media');
      else if (hash === '#/media/print' || hash === '#media-print') setCurrentPage('media-print');
      else if (hash === '#/media/digital' || hash === '#media-digital') setCurrentPage('media-digital');
      else if (hash === '#/gallery/awards' || hash === '#gallery-awards') setCurrentPage('gallery-awards');
      else if (hash === '#/gallery/celebrities' || hash === '#gallery-celebrities') setCurrentPage('gallery-celebrities');
      else if (hash === '#/gallery/social' || hash === '#gallery-social') setCurrentPage('gallery-social');
      else if (hash === '#/gallery/invitations' || hash === '#gallery-invitations') setCurrentPage('gallery-invitations');
      else if (hash === '#/gallery/videos' || hash === '#gallery-videos') setCurrentPage('gallery-videos');
      else if (hash === '#/gallery/personal' || hash === '#gallery-personal') setCurrentPage('gallery-personal');
      else if (hash === '#/contact' || hash === '#contact') setCurrentPage('contact');
      else if (hash === '' || hash === '#' || hash === '#/') setCurrentPage('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    switch (page) {
      case 'about':
        window.location.hash = '#/about';
        break;
      case 'media':
        window.location.hash = '#/media';
        break;
      case 'media-print':
        window.location.hash = '#/media/print';
        break;
      case 'media-digital':
        window.location.hash = '#/media/digital';
        break;
      case 'gallery-awards':
        window.location.hash = '#/gallery/awards';
        break;
      case 'gallery-celebrities':
        window.location.hash = '#/gallery/celebrities';
        break;
      case 'gallery-social':
        window.location.hash = '#/gallery/social';
        break;
      case 'gallery-invitations':
        window.location.hash = '#/gallery/invitations';
        break;
      case 'gallery-videos':
        window.location.hash = '#/gallery/videos';
        break;
      case 'gallery-personal':
        window.location.hash = '#/gallery/personal';
        break;
      case 'contact':
        window.location.hash = '#/contact';
        break;
      default:
        window.location.hash = '#/';
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectGalleryCategory = (key: GalleryCategoryKey) => {
    navigateToPage(`gallery-${key}` as PageType);
  };

  const handleOpenContact = () => {
    navigateToPage('contact');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c2430]">
      {/* 1. Premium Sticky Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateToPage}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />

      <main className="flex-1">
        {/* Homepage */}
        {currentPage === 'home' && (
          <HomePage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onSelectMedia={(item) => setSelectedMedia(item)}
            onViewAllMedia={() => navigateToPage('media')}
            onNavigateAbout={() => navigateToPage('about')}
          />
        )}

        {/* About Us Page */}
        {currentPage === 'about' && (
          <AboutPage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenContact={handleOpenContact}
          />
        )}

        {/* Media Coverage Main Hub */}
        {currentPage === 'media' && (
          <MediaPage
            onNavigatePrint={() => navigateToPage('media-print')}
            onNavigateDigital={() => navigateToPage('media-digital')}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        )}

        {/* Dedicated Print Media Page */}
        {currentPage === 'media-print' && (
          <PrintMediaPage
            onNavigateBack={() => navigateToPage('media')}
          />
        )}

        {/* Dedicated Digital Media Page */}
        {currentPage === 'media-digital' && (
          <DigitalMediaPage
            onNavigateBack={() => navigateToPage('media')}
          />
        )}

        {/* 6 Dedicated Gallery Pages */}
        {currentPage === 'gallery-awards' && (
          <AwardsPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'gallery-celebrities' && (
          <CelebritiesPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'gallery-social' && (
          <SocialEventsPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'gallery-invitations' && (
          <InvitationsPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'gallery-videos' && (
          <VideosPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {currentPage === 'gallery-personal' && (
          <PersonalPicturesPage
            onSelectCategory={handleSelectGalleryCategory}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}

        {/* Contact Us Page */}
        {currentPage === 'contact' && (
          <ContactPage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        )}
      </main>

      {/* 10. Premium Navy Footer */}
      <Footer onNavigate={navigateToPage} />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Interactive Modals */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      <MediaModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />

      <AllMediaModal
        isOpen={isAllMediaOpen}
        onClose={() => setIsAllMediaOpen(false)}
      />
    </div>
  );
}

export default App;
