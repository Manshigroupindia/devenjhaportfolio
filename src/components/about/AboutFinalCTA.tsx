import React from 'react';
import { ArrowRight, Calendar, MessageSquare, Heart } from 'lucide-react';

interface AboutFinalCTAProps {
  onOpenAppointment: () => void;
  onOpenContact: () => void;
}

export const AboutFinalCTA: React.FC<AboutFinalCTAProps> = ({
  onOpenAppointment,
  onOpenContact,
}) => {
  return (
    <section className="relative overflow-hidden py-18 sm:py-22 bg-[#14283B] text-white">
      {/* Deep navy vignette gradient with subtle gold starfield pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1c2b] via-[#14283B] to-[#0e1c2b]" />
      <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Decorative gold background circle glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <div className="max-w-3xl mx-auto">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3852] border border-[#BD9256]/40 mb-4">
            <Heart className="w-3.5 h-3.5 text-[#BD9256] fill-[#BD9256]/30" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
              JOIN HANDS FOR IMPACT
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-tight mb-4 tracking-tight">
            Let&apos;s Make A <span className="font-serif italic text-[#BD9256]">Difference Together.</span>
          </h2>

          {/* Supporting Text */}
          <p className="text-[15px] sm:text-[17px] text-gray-300 leading-relaxed max-w-2xl mx-auto mb-9">
            Whether it&apos;s a social initiative, collaboration or an opportunity to connect, I would be glad to hear from you.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#BD9256] hover:bg-[#a67d43] active:scale-[0.98] text-white text-[14px] font-semibold rounded-md shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Take An Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white text-[14px] font-semibold border border-white/30 hover:border-[#BD9256] rounded-md backdrop-blur-xs transition-all duration-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#BD9256]" />
              <span>Get In Touch</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

