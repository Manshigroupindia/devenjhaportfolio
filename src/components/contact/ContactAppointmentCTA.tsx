import React from 'react';
import { CalendarCheck, ArrowRight, Clock, Shield } from 'lucide-react';

interface ContactAppointmentCTAProps {
  onOpenAppointment: () => void;
}

export const ContactAppointmentCTA: React.FC<ContactAppointmentCTAProps> = ({
  onOpenAppointment,
}) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 bg-[#14283B] text-white">
      {/* Subtle photographic background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
        style={{ backgroundImage: 'url(/images/appointment-banner.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1c2b] via-[#14283B]/95 to-[#102235]" />
      
      {/* Decorative gold aura */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <div className="max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3852] border border-[#BD9256]/40 mb-4">
            <CalendarCheck className="w-3.5 h-3.5 text-[#BD9256]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
              FORMAL APPOINTMENTS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Have Something Meaningful <br className="hidden sm:inline" />
            <span className="italic text-[#BD9256]">To Discuss?</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Let&apos;s connect and explore opportunities to work together. Schedule an in-person meeting or virtual consultation directly with the executive office.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenAppointment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#BD9256] hover:bg-[#a87932] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <span>Take An Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Reassurance pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#BD9256]" />
              Prompt Response within 24–48 Hours
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#BD9256]" />
              Confidential &amp; Verified Process
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
