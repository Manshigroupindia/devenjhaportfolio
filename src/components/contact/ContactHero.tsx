import React from 'react';
import { Sparkles, MessageSquare, ArrowDown, MapPin } from 'lucide-react';

export const ContactHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-18 sm:py-24 bg-[#14283B] text-white">
      {/* Editorial navy background texture with gold ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1420] via-[#14283B] to-[#0e1c2b]" />
      <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        <div className="max-w-3xl mx-auto">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3852] border border-[#BD9256]/40 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#BD9256]" />
            <span className="text-[11px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
              GET IN TOUCH
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[54px] font-bold text-white leading-tight mb-4 tracking-tight">
            Let&apos;s Start A <br />
            <span className="font-serif italic text-[#BD9256]">Meaningful Conversation.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            Whether you wish to discuss a collaboration, social initiative, business opportunity or simply connect, I would be glad to hear from you.
          </p>

          {/* Quick metadata chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1.5 bg-[#1b334d]/80 px-3 py-1.5 rounded-full border border-[#2b4d73]">
              <MapPin className="w-3.5 h-3.5 text-[#BD9256]" />
              New Delhi, India
            </span>
            <span className="flex items-center gap-1.5 bg-[#1b334d]/80 px-3 py-1.5 rounded-full border border-[#2b4d73]">
              <MessageSquare className="w-3.5 h-3.5 text-[#BD9256]" />
              Direct Response Channel
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

