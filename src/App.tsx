import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { BackToTop } from './components/BackToTop.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { MediaModal } from './components/MediaModal.tsx';
import { AllMediaModal } from './components/AllMediaModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { MediaItem } from './components/MediaCoverage.tsx';

export function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>(() => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === '#/about' || hash === '#about' || path.endsWith('/about')) {
      return 'about';
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
      } else if (hash === '' || hash === '#' || hash === '#/') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: 'home' | 'about') => {
    setCurrentPage(page);
    if (page === 'about') {
      window.location.hash = '#/about';
    } else {
      window.location.hash = '#/';
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
        {currentPage === 'home' ? (
          <HomePage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onSelectMedia={(item) => setSelectedMedia(item)}
            onViewAllMedia={() => setIsAllMediaOpen(true)}
            onNavigateAbout={() => navigateToPage('about')}
          />
        ) : (
          <AboutPage
            onOpenAppointment={() => setIsAppointmentOpen(true)}
            onOpenContact={handleOpenContact}
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
