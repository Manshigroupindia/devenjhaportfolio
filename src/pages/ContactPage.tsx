import React, { useEffect } from 'react';
import { ContactHero } from '../components/contact/ContactHero.tsx';
import { ContactForm } from '../components/contact/ContactForm.tsx';
import { ContactInfo } from '../components/contact/ContactInfo.tsx';
import { OfficeMapSection } from '../components/contact/OfficeMapSection.tsx';
import { ContactAppointmentCTA } from '../components/contact/ContactAppointmentCTA.tsx';

interface ContactPageProps {
  onOpenAppointment: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenAppointment }) => {
  useEffect(() => {
    document.title = 'Contact Us | Devendra Kumar Jha (Deven Jha)';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* 1. Contact Hero Section */}
      <ContactHero />

      {/* 2 & 3. Two-Column Contact Form & Contact Information */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right Column: Contact Information */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Office Location & Google Maps */}
      <OfficeMapSection />

      {/* 5. Appointment CTA Banner */}
      <ContactAppointmentCTA onOpenAppointment={onOpenAppointment} />
    </div>
  );
};

export default ContactPage;

