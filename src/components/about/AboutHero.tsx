import React from 'react';
import { ArrowDown, MapPin, Sparkles, Heart } from 'lucide-react';
import { AboutPageContent } from '../../types/cms.ts';

interface AboutHeroProps {
  onOpenAppointment: () => void;
  content?: AboutPageContent['hero'];
}

export const AboutHero: React.FC<AboutHeroProps> = ({ onOpenAppointment, content }) => {
  const eyebrow = content?.eyebrow || 'GET TO KNOW ME';
  const heading = content?.heading || 'The Journey Behind The Purpose.';
  const description =
    content?.description ||
    'Every journey begins with a purpose. Mine began with a deep desire to serve people and bring positive change in society. Over the past two decades, this journey has evolved into meaningful social welfare initiatives, community leadership, and impactful ventures.';
  const heroImage = content?.heroImage || '';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F6F0] via-[#FAF7F2] to-[#F4EDE0] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-[#ebdcc9]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 right-1/4 w-[420px] h-[420px] bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-[#14283B]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle gold grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Purpose (approx 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Eyebrow kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#BD9256]/10 border border-[#BD9256]/30 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#BD9256]" />
              <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
                {eyebrow}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[54px] xl:text-[58px] font-bold text-[#14283B] leading-[1.14] tracking-[-0.015em] mb-6">
              {heading}
            </h1>

            {/* Supporting Text */}
            <p className="font-serif italic text-[17px] sm:text-[19px] lg:text-[20px] text-[#2c3e50] leading-relaxed max-w-xl mb-7 border-l-2 border-[#BD9256] pl-4">
              &ldquo;{description}&rdquo;
            </p>

            {/* Name & Persona Callout */}
            <div className="mb-8 bg-white/70 backdrop-blur-xs px-5 py-3.5 rounded-lg border border-[#e5d8c6] shadow-xs inline-block">
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#14283B] tracking-wide uppercase">
                DEVENDRA KUMAR JHA
              </h2>
              <p className="text-[12.5px] sm:text-[13px] text-[#777777] font-medium">
                Popularly Known as Deven Jha.
              </p>
            </div>

            {/* Quick Actions & Location */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAppointment}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#BD9256] hover:bg-[#a67d43] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white/80" />
                <span>Take an Appointment</span>
              </button>

              <a
                href="#biography"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#faf7f0] active:scale-[0.98] text-[#14283B] text-[13.5px] font-semibold border border-[#d6c7b3] hover:border-[#BD9256] rounded-md shadow-xs transition-all duration-200"
              >
                <span>Read My Story</span>
                <ArrowDown className="w-4 h-4 text-[#BD9256]" />
              </a>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] pl-1">
                <MapPin className="w-3.5 h-3.5 text-[#BD9256]" />
                <span>New Delhi, India</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Portrait (approx 5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] group">
              
              {/* Outer decorative gold frame */}
              <div className="absolute -inset-2.5 rounded-2xl border-2 border-[#BD9256]/40 -z-10 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
              
              {/* Main Photo Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                {heroImage ? (
                  <>
                    <img
                      src={heroImage}
                      alt="Devendra Kumar Jha (Deven Jha) - Social Worker & Leader"
                      className="w-full h-auto block transform group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14283B]/40 via-transparent to-transparent pointer-events-none" />

                    {/* Corner Badge */}
                    <div className="absolute bottom-3 right-3 bg-[#14283B]/90 backdrop-blur-xs px-3 py-1.5 rounded border border-[#BD9256]/40 text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#BD9256] block">
                        Leadership &amp; Service
                      </span>
                      <span className="text-[12px] font-semibold text-white">
                        Since 2004
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full aspect-[4/5] animate-pulse bg-gradient-to-tr from-[#ece1cf] via-[#f7f2e8] to-[#ece1cf] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#dfd0b8]/60 mb-4" />
                    <div className="h-4 w-40 bg-[#dfd0b8]/70 rounded mb-2" />
                    <div className="h-3 w-28 bg-[#dfd0b8]/40 rounded" />
                  </div>
                )}
              </div>

              {/* Decorative gold embellishments */}
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-[#BD9256] rounded-bl-xl -z-10" />
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-[#BD9256] rounded-tr-xl -z-10" />
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-10 lg:mt-12">
          <a
            href="#biography"
            className="inline-flex flex-col items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#777777] hover:text-[#BD9256] uppercase transition-colors"
          >
            <span>Scroll to explore story</span>
            <ArrowDown className="w-4 h-4 text-[#BD9256] animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
};
