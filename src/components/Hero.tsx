import React from 'react';
import { ArrowRight, MapPin, Mouse } from 'lucide-react';
import { HomePageContent } from '../types/cms.ts';

interface HeroProps {
  onOpenAppointment: () => void;
  onExploreJourney?: () => void;
  content?: HomePageContent['hero'];
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment, onExploreJourney, content }) => {
  const eyebrow = content?.eyebrow || 'A Journey of Purpose, Leadership & Social Impact';
  const titleLine1 = content?.titleLine1 || 'Building a';
  const titleHighlight1 = content?.titleHighlight1 || 'Better Society.';
  const titleLine2 = content?.titleLine2 || 'Creating a';
  const titleHighlight2 = content?.titleHighlight2 || 'Lasting Impact.';
  const description =
    content?.description ||
    'From social initiatives to entrepreneurial ventures, my journey has always been driven by a vision to create meaningful change and build a prosperous India.';
  const fullName = content?.fullName || 'DEVENDRA KUMAR JHA';
  const subname = content?.subname || 'Popularly Known as Deven Jha.';
  const location = content?.location || 'New Delhi, India';
  const portraitImage = content?.portraitImage || '/images/hero-portrait.png';
  const exploreBtnText = content?.exploreBtnText || 'Explore My Journey';
  const connectBtnText = content?.connectBtnText || 'Connect With Me';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f3] via-[#f7f2e9] to-[#f5efe4] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 border-b border-[#ebdcc9]">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#dfc08f]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Content (approx 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-[1.5px] bg-[#b8863b]" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#a87932] uppercase">
                {eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-[34px] sm:text-[44px] lg:text-[50px] xl:text-[54px] font-bold text-[#111c2a] leading-[1.18] tracking-[-0.01em] mb-4">
              {titleLine1}{' '}
              <span className="text-[#a87932] italic font-serif">{titleHighlight1}</span>
              <br />
              {titleLine2}{' '}
              <span className="text-[#a87932] italic font-serif">{titleHighlight2}</span>
            </h1>

            {/* Subheading description */}
            <p className="text-[14px] sm:text-[15.5px] text-[#4a5568] leading-relaxed max-w-xl mb-6">
              {description}
            </p>

            {/* Persona Callout */}
            <div className="mb-8">
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#111c2a] tracking-wide uppercase">
                {fullName}
              </h2>
              <p className="text-[13px] sm:text-[13.5px] text-[#6b7280] font-medium">
                {subname}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              {onExploreJourney ? (
                <button
                  onClick={onExploreJourney}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#a87932] hover:bg-[#946927] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>{exploreBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#a87932] hover:bg-[#946927] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <span>{exploreBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              <a
                href="#social"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 hover:bg-white active:scale-[0.98] text-[#1f2937] text-[13.5px] font-semibold border border-[#d6c7b3] hover:border-[#a87932] rounded-md shadow-sm transition-all duration-200"
              >
                <span>{connectBtnText}</span>
              </a>
            </div>

            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#5c687a]">
              <MapPin className="w-3.5 h-3.5 text-[#a87932]" />
              <span>{location}</span>
            </div>
          </div>

          {/* Right Column: Hero Portrait (approx 5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] group">
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
                <img
                  src={portraitImage}
                  alt={fullName}
                  className="w-full h-auto object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-500"
                />
                
                {/* Soft gradient bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Decorative subtle backdrop ornament */}
              <div className="absolute -bottom-4 -left-4 w-28 h-28 border-b-2 border-l-2 border-[#b8863b]/50 rounded-bl-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-28 h-28 border-t-2 border-r-2 border-[#b8863b]/50 rounded-tr-2xl -z-10" />
            </div>
          </div>

        </div>

        {/* Scroll Down Indicator (bottom right) */}
        <div className="hidden lg:flex justify-end mt-4">
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#64748b] hover:text-[#a87932] uppercase transition-colors"
          >
            <Mouse className="w-3.5 h-3.5 animate-bounce" />
            <span>Scroll Down</span>
          </a>
        </div>
      </div>
    </section>
  );
};
