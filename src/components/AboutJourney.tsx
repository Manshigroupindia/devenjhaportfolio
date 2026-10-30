import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';

interface AboutJourneyProps {
  onOpenAppointment: () => void;
}

export const AboutJourney: React.FC<AboutJourneyProps> = ({ onOpenAppointment }) => {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-[#faf7f1] border-b border-[#ece2d3]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Overlapping Photo Composition (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[460px]">
              
              {/* Back Image: Group / Community Work */}
              <div className="w-[62%] sm:w-[65%] rounded-lg overflow-hidden shadow-lg border-4 border-white bg-white rotate-[-3deg] hover:rotate-0 transition-transform duration-300">
                <img
                  src="/images/about-group.png"
                  alt="Social initiatives and community upliftment"
                  className="w-full h-auto object-cover grayscale contrast-110"
                />
              </div>

              {/* Front Image: Deven Jha Portrait in Suit */}
              <div className="absolute top-[18%] right-2 w-[68%] sm:w-[70%] rounded-xl overflow-hidden shadow-2xl border-4 border-[#e0cba8] bg-white rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
                <img
                  src="/images/about-portrait.png"
                  alt="Devendra Kumar Jha in suit"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Signature Overlay */}
              <div className="absolute -bottom-6 left-6 z-20">
                <img
                  src="/images/signature.png"
                  alt="Deven Jha Signature"
                  className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md"
                />
                <span className="font-signature text-2xl text-[#a87932] block sm:hidden">
                  Deven Jha
                </span>
              </div>

            </div>
          </div>

          {/* Right Side: Biography & Quote (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#a87932] uppercase">
                ABOUT MY JOURNEY
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-[30px] sm:text-[38px] lg:text-[42px] font-bold text-[#111c2a] leading-[1.2] mb-6">
              Driven by Purpose.<br />
              <span className="text-[#111c2a]">Guided by Humanity.</span>
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-[14px] sm:text-[15px] text-[#4a5568] leading-relaxed mb-8">
              <p>
                Hey! Myself Devendra Kumar Jha, popularly known as Deven Jha, born in Madhubani,
                Bihar, India.
              </p>
              <p>
                With a deep passion for serving society, I came to New Delhi in 2004 with a vision of
                contributing towards a better and more prosperous India.
              </p>
              <p>
                In 2016, I founded <strong className="text-[#111c2a] font-semibold">People&apos;s Association</strong>,
                an NGO that has expanded its presence across 15 states of India. Through dedicated
                teamwork, we work towards supporting underprivileged communities through free education,
                food, clothing, and healthcare assistance.
              </p>
            </div>

            {/* Elegant Quote Callout Box */}
            <div className="w-full bg-[#f4ece0]/70 border-l-[3.5px] border-[#a87932] rounded-r-lg p-4 sm:p-5 mb-8 flex items-start gap-3">
              <Quote className="w-6 h-6 text-[#a87932] shrink-0 mt-0.5 opacity-80" />
              <p className="font-serif italic text-[15px] sm:text-[16px] text-[#2c3644] leading-relaxed">
                &ldquo;True success lies in the positive difference we make in the lives of others.&rdquo;
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#a87932] hover:bg-[#946927] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <span>Discover My Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

