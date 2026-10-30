import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { GalleryCategoryKey, GalleryCategoryMeta } from '../../types/gallery.ts';
import { GALLERY_CATEGORIES } from '../../data/galleryData.ts';

interface GalleryHeroProps {
  currentCategory: GalleryCategoryKey;
  onSelectCategory: (key: GalleryCategoryKey) => void;
  onNavigateHome: () => void;
}

export const GalleryHero: React.FC<GalleryHeroProps> = ({
  currentCategory,
  onSelectCategory,
  onNavigateHome,
}) => {
  const meta = GALLERY_CATEGORIES[currentCategory];

  return (
    <section className="bg-gradient-to-b from-[#14283B] to-[#0e1c2b] text-white pt-12 pb-14 border-b border-[#243d57] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb / Back Link */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#BD9256] hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>

        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#BD9256]/20 border border-[#BD9256]/40 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#BD9256]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
              {meta.eyebrow}
            </span>
          </div>

          <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-tight mb-3">
            {meta.heading}
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#BD9256] mb-3">
            &ldquo;{meta.subtitle}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            {meta.description}
          </p>
        </div>

        {/* 6 Category Pills Switcher Bar */}
        <div className="pt-4 border-t border-[#233c56] flex items-center gap-2 overflow-x-auto pb-1">
          {(Object.keys(GALLERY_CATEGORIES) as GalleryCategoryKey[]).map((key) => {
            const cat = GALLERY_CATEGORIES[key];
            const isActive = currentCategory === key;
            return (
              <button
                key={key}
                onClick={() => onSelectCategory(key)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#BD9256] text-white shadow-md'
                    : 'bg-[#1b344e] text-gray-300 hover:text-white hover:bg-[#254668] border border-[#2c4e73]'
                }`}
              >
                {cat.navLabel}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};

