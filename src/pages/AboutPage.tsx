import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AboutHero } from '../components/about/AboutHero.tsx';
import { AboutStory } from '../components/about/AboutStory.tsx';
import { AboutTimeline } from '../components/about/AboutTimeline.tsx';
import { AboutMissionVision } from '../components/about/AboutMissionVision.tsx';
import { AboutPeoplesAssociation } from '../components/about/AboutPeoplesAssociation.tsx';
import { AboutBusiness } from '../components/about/AboutBusiness.tsx';
import { AboutSocialProfiles } from '../components/about/AboutSocialProfiles.tsx';
import { AboutFinalCTA } from '../components/about/AboutFinalCTA.tsx';
import { useAboutPageContent } from '../hooks/useCMSContent.ts';

interface AboutPageProps {
  onOpenAppointment: () => void;
  onOpenContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenAppointment,
  onOpenContact,
}) => {
  const navigate = useNavigate();
  const handleOpenContact = onOpenContact || (() => navigate('/contact'));

  const { data: aboutContent } = useAboutPageContent();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'About Us | Devendra Kumar Jha (Deven Jha)';
  }, []);

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn">
      {/* 2. About Page Hero */}
      <AboutHero
        content={aboutContent.hero}
        onOpenAppointment={onOpenAppointment}
      />

      {/* 3. My Story – Personal Biography */}
      <AboutStory />

      {/* 4. My Journey – Timeline */}
      <AboutTimeline timeline={aboutContent.timeline} />

      {/* 5. Mission & Vision */}
      <AboutMissionVision />

      {/* 6. People's Association – Social Initiative */}
      <AboutPeoplesAssociation onOpenAppointment={onOpenAppointment} />

      {/* 7. My Business */}
      <AboutBusiness />

      {/* 8. My Social Profiles */}
      <AboutSocialProfiles />

      {/* 9. Final CTA Photographic Banner */}
      <AboutFinalCTA
        onOpenAppointment={onOpenAppointment}
        onOpenContact={handleOpenContact}
      />
    </div>
  );
};
