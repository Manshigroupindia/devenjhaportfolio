import React, { useEffect } from 'react';
import { Hero } from '../components/Hero.tsx';
import { AboutJourney } from '../components/AboutJourney.tsx';
import { ImpactStats } from '../components/ImpactStats.tsx';
import { MediaCoverage, MediaItem } from '../components/MediaCoverage.tsx';
import { AppointmentBanner } from '../components/AppointmentBanner.tsx';
import { MyBusiness } from '../components/MyBusiness.tsx';
import { ContactSection } from '../components/ContactSection.tsx';

interface HomePageProps {
  onOpenAppointment: () => void;
  onSelectMedia: (item: MediaItem) => void;
  onViewAllMedia: () => void;
  onNavigateAbout?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenAppointment,
  onSelectMedia,
  onViewAllMedia,
  onNavigateAbout,
}) => {
  useEffect(() => {
    document.title = 'Deven Jha | Social Worker, Entrepreneur & Leader';
  }, []);

  return (
    <>
      {/* 2. Hero Section */}
      <Hero
        onOpenAppointment={onOpenAppointment}
        onExploreJourney={onNavigateAbout}
      />

      {/* 3. About My Journey (with option to explore full story) */}
      <AboutJourney onOpenAppointment={onNavigateAbout || onOpenAppointment} />

      {/* 4. Numbers That Reflect Our Journey (Impact Stats) */}
      <ImpactStats />

      {/* 5. In The Media */}
      <MediaCoverage
        onSelectMedia={onSelectMedia}
        onViewAll={onViewAllMedia}
      />

      {/* 6. Take an Appointment Photographic Banner */}
      <AppointmentBanner onOpenAppointment={onOpenAppointment} />

      {/* 7 & 8. My Business & Connect With Me */}
      <MyBusiness />

      {/* 9. Get In Touch */}
      <ContactSection />
    </>
  );
};
