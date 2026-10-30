import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
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

// Scroll to top on route change or scroll to hash target
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace(/^#/, '');
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// Redirect any legacy /#/ URLs to clean BrowserRouter paths
function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const rawHash = window.location.hash;
    if (rawHash && rawHash.startsWith('#/')) {
      const cleanPath = rawHash.replace(/^#\/?/, '/');
      let target = cleanPath;
      if (cleanPath === '/media') target = '/media-coverage';
      else if (cleanPath === '/media/print') target = '/media-coverage/print';
      else if (cleanPath === '/media/digital') target = '/media-coverage/digital';
      else if (cleanPath === '/gallery/celebrities') target = '/gallery/celebrity';
      else if (cleanPath === '/gallery/social') target = '/gallery/social-events';
      navigate(target, { replace: true });
    }
  }, [navigate]);

  return null;
}

function AppContent() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c2430]">
      <ScrollToTop />
      <LegacyHashRedirect />

      {/* 1. Premium Sticky Navbar */}
      <Navbar onOpenAppointment={() => setIsAppointmentOpen(true)} />

      <main className="flex-1">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenAppointment={() => setIsAppointmentOpen(true)}
                onSelectMedia={(item) => setSelectedMedia(item)}
              />
            }
          />

          {/* About Us */}
          <Route
            path="/about"
            element={
              <AboutPage
                onOpenAppointment={() => setIsAppointmentOpen(true)}
              />
            }
          />

          {/* Media Coverage Hub & Subpages */}
          <Route
            path="/media-coverage"
            element={
              <MediaPage
                onOpenAppointment={() => setIsAppointmentOpen(true)}
              />
            }
          />
          <Route path="/media-coverage/print" element={<PrintMediaPage />} />
          <Route path="/media-coverage/digital" element={<DigitalMediaPage />} />

          {/* 6 Dedicated Individual Gallery Pages */}
          <Route path="/gallery/awards" element={<AwardsPage />} />
          <Route path="/gallery/celebrity" element={<CelebritiesPage />} />
          <Route path="/gallery/social-events" element={<SocialEventsPage />} />
          <Route path="/gallery/invitations" element={<InvitationsPage />} />
          <Route path="/gallery/videos" element={<VideosPage />} />
          <Route path="/gallery/personal" element={<PersonalPicturesPage />} />

          {/* Contact Us */}
          <Route
            path="/contact"
            element={
              <ContactPage
                onOpenAppointment={() => setIsAppointmentOpen(true)}
              />
            }
          />

          {/* Legacy Aliases & Fallbacks */}
          <Route path="/media" element={<Navigate to="/media-coverage" replace />} />
          <Route path="/media/print" element={<Navigate to="/media-coverage/print" replace />} />
          <Route path="/media/digital" element={<Navigate to="/media-coverage/digital" replace />} />
          <Route path="/gallery/celebrities" element={<Navigate to="/gallery/celebrity" replace />} />
          <Route path="/gallery/social" element={<Navigate to="/gallery/social-events" replace />} />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 10. Premium Navy Footer */}
      <Footer />

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

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
