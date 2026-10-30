import React from 'react';
import { Target, Compass, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AboutPageContent } from '../../types/cms.ts';

interface AboutMissionVisionProps {
  content?: AboutPageContent['missionVision'];
}

export const AboutMissionVision: React.FC<AboutMissionVisionProps> = ({ content }) => {
  const missionText =
    content?.missionText ||
    'To serve society with dedication by supporting underprivileged communities through education, healthcare, food and other essential resources.';
  const visionText =
    content?.visionText ||
    'To contribute towards a prosperous, inclusive and compassionate India where every individual has the opportunity to live with dignity.';

  return (
    <section className="py-16 sm:py-20 bg-[#F8F6F0] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase block mb-2">
            CORE PRINCIPLES &amp; BELIEFS
          </span>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-bold text-[#14283B] leading-tight">
            Our Mission &amp; Vision
          </h2>
          <div className="w-16 h-[2px] bg-[#BD9256] mx-auto mt-3" />
        </div>

        {/* Two Columns Side By Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: MISSION */}
          <div className="group relative bg-white rounded-2xl p-8 sm:p-10 border border-[#e2d6c5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            {/* Top gold bar indicator */}
            <div className="absolute top-0 left-8 right-8 h-[3.5px] bg-[#BD9256] rounded-t-full" />

            <div>
              {/* Icon & Label */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-xl bg-[#F8F6F0] border border-[#ebdcc9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-[#BD9256]" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#777777] uppercase bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#ebdcc9]">
                  ACTION-ORIENTED
                </span>
              </div>

              <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#14283B] mb-4">
                Our Mission
              </h3>

              <blockquote className="font-serif italic text-[16px] sm:text-[17.5px] text-[#2c3e50] leading-relaxed border-l-2 border-[#BD9256]/50 pl-4 mb-6">
                &ldquo;{missionText}&rdquo;
              </blockquote>

              <p className="text-[13.5px] text-[#777777] leading-relaxed">
                Direct, hands-on intervention that breaks cycles of poverty and empowers marginalized families with tangible, sustainable everyday assistance.
              </p>
            </div>

            {/* Bottom Key Values */}
            <div className="mt-8 pt-5 border-t border-[#f0e8dc] flex items-center gap-4 text-xs font-semibold text-[#14283B]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#BD9256]" />
                Integrity
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#BD9256]" />
                Empathy
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#BD9256]" />
                Dignity
              </span>
            </div>
          </div>

          {/* Card 2: VISION */}
          <div className="group relative bg-white rounded-2xl p-8 sm:p-10 border border-[#e2d6c5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            {/* Top gold bar indicator */}
            <div className="absolute top-0 left-8 right-8 h-[3.5px] bg-[#14283B] rounded-t-full group-hover:bg-[#BD9256] transition-colors" />

            <div>
              {/* Icon & Label */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-xl bg-[#F8F6F0] border border-[#ebdcc9] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6 text-[#BD9256]" strokeWidth={1.8} />
                </div>
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#777777] uppercase bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#ebdcc9]">
                  LONG-TERM GOAL
                </span>
              </div>

              <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#14283B] mb-4">
                Our Vision
              </h3>

              <blockquote className="font-serif italic text-[16px] sm:text-[17.5px] text-[#2c3e50] leading-relaxed border-l-2 border-[#14283B]/50 pl-4 mb-6">
                &ldquo;{visionText}&rdquo;
              </blockquote>

              <p className="text-[13.5px] text-[#777777] leading-relaxed">
                Building an India founded on equity, compassionate stewardship, and civic opportunities where social background never limits human potential.
              </p>
            </div>

            {/* Bottom Key Values */}
            <div className="mt-8 pt-5 border-t border-[#f0e8dc] flex items-center gap-4 text-xs font-semibold text-[#14283B]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#BD9256]" />
                Inclusivity
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#BD9256]" />
                Compassion
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#BD9256]" />
                Prosperity
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
