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
import { MediaItem } from './components/MediaCoverage.tsx';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === '#/about' || hash === '#about' || path.endsWith('/about')) {
      return 'about';
    }
    if (hash === '#/media' || hash === '#media' || path.endsWith('/media')) {
      return 'media';
    }
    if (hash === '#/media/print' || hash === '#media-print') {
      return 'media-print';
    }
    if (hash === '#/media/digital' || hash === '#media-digital') {
      return 'media-digital';
    }
    return 'home';
  });

  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false);

  // Sync with browser back/forward history & hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/about' || hash === '#about') {
        setCurrentPage('about');
      } else if (hash === '#/media' || hash === '#media') {
        setCurrentPage('media');
      } else if (hash === '#/media/print' || hash === '#media-print') {
        setCurrentPage('media-print');
      } else if (hash === '#/media/digital' || hash === '#media-digital') {
        setCurrentPage('media-digital');
      } else if (hash === '' || hash === '#' || hash === '#/') {
        setCurrentPage('home');
      }
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
      default:
        window.location.hash = '#/';
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    if (currentPage !== 'home') {
      navigateToPage('home');
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
        {currentPage === 'home' && (
          <HomePage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onSelectMedia={(item) => setSelectedMedia(item)}
            onViewAllMedia={() => navigateToPage('media')}
            onNavigateAbout={() => navigateToPage('about')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentPage === 'media' && (
          <MediaPage
            onNavigatePrint={() => navigateToPage('media-print')}
            onNavigateDigital={() => navigateToPage('media-digital')}
            onOpenAppointment={() => setIsAppointmentOpen(true)}
          />
        )}

        {currentPage === 'media-print' && (
          <PrintMediaPage
            onNavigateBack={() => navigateToPage('media')}
          />
        )}

        {currentPage === 'media-digital' && (
          <DigitalMediaPage
            onNavigateBack={() => navigateToPage('media')}
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
