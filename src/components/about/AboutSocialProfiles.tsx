import React from 'react';
import { Share2 } from 'lucide-react';
import { ReusableSocialGrid } from '../common/ReusableSocialGrid.tsx';

export const AboutSocialProfiles: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FFFFFF] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Share2 className="w-4 h-4 text-[#BD9256]" />
            <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
              COMMUNITY CHANNELS
            </span>
          </div>
          <h2 className="font-serif text-[30px] sm:text-[36px] font-bold text-[#14283B] leading-tight mb-2">
            Stay Connected With Me
          </h2>
          <p className="text-xs sm:text-[14px] text-[#777777]">
            Follow my journey, initiatives and activities across social platforms.
          </p>
        </div>

        {/* Reusable Social Cards Grid */}
        <ReusableSocialGrid variant="cards" />

      </div>
    </section>
  );
};
