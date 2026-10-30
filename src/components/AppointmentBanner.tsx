import React from 'react';
import { ArrowRight, CalendarCheck } from 'lucide-react';

interface AppointmentBannerProps {
  onOpenAppointment: () => void;
}

export const AppointmentBanner: React.FC<AppointmentBannerProps> = ({ onOpenAppointment }) => {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 bg-[#1a2332]">
      {/* Background photographic overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay filter blur-[0.5px]"
        style={{ backgroundImage: 'url(/images/appointment-banner.png)' }}
      />
      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1622]/95 via-[#0d1622]/85 to-[#0d1622]/90" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Text */}
          <div className="text-center md:text-left">
            <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-white leading-tight mb-1.5 tracking-tight">
              Let&apos;s Connect. Let&apos;s Create an Impact.
            </h2>
            <p className="text-xs sm:text-[14px] text-[#cbd5e1] max-w-2xl">
              Have a meeting request, collaboration opportunity, or a meaningful initiative to discuss?
            </p>
          </div>

          {/* Right CTA Button */}
          <div className="shrink-0">
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#b8863b] hover:bg-[#a37430] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Take an Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

