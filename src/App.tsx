import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutJourney } from './components/AboutJourney.tsx';
import { ImpactStats } from './components/ImpactStats.tsx';
import { MediaCoverage, MediaItem } from './components/MediaCoverage.tsx';
import { AppointmentBanner } from './components/AppointmentBanner.tsx';
import { MyBusiness } from './components/MyBusiness.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BackToTop } from './components/BackToTop.tsx';
import { AppointmentModal } from './components/AppointmentModal.tsx';
import { MediaModal } from './components/MediaModal.tsx';
import { AllMediaModal } from './components/AllMediaModal.tsx';

export function App() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAllMediaOpen, setIsAllMediaOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c2430]">
      {/* 1. Premium Sticky Navbar */}
      <Navbar onOpenAppointment={() => setIsAppointmentOpen(true)} />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onOpenAppointment={() => setIsAppointmentOpen(true)} />

        {/* 3. About My Journey */}
        <AboutJourney onOpenAppointment={() => setIsAppointmentOpen(true)} />

        {/* 4. Numbers That Reflect Our Journey (Impact Stats) */}
        <ImpactStats />

        {/* 5. In The Media */}
        <MediaCoverage
          onSelectMedia={(item) => setSelectedMedia(item)}
          onViewAll={() => setIsAllMediaOpen(true)}
        />

        {/* 6. Take an Appointment Photographic Banner */}
        <AppointmentBanner onOpenAppointment={() => setIsAppointmentOpen(true)} />

        {/* 7 & 8. My Business & Connect With Me */}
        <MyBusiness />

        {/* 9. Get In Touch */}
        <ContactSection />
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

export default App;
