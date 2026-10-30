import React from 'react';
import { Sparkles, HeartHandshake, Compass, Users } from 'lucide-react';

export const AboutStory: React.FC = () => {
  return (
    <section id="biography" className="py-16 sm:py-20 lg:py-24 bg-[#FFFFFF] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait Composition with Golden Accents (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:sticky lg:top-28">
            <div className="relative w-full max-w-[440px]">
              
              {/* Back ambient frame */}
              <div className="absolute -inset-3 rounded-2xl bg-[#F8F6F0] border border-[#ebdcc9] -z-10 rotate-[-1.5deg]" />

              {/* Main Portrait of Deven Jha */}
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-[#BD9256]/60 bg-white">
                <img
                  src="/images/about-portrait.png"
                  alt="Devendra Kumar Jha (Deven Jha) - Dedicated to Social Work"
                  className="w-full h-auto object-cover"
                />
                
                {/* Gold gradient edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14283B]/50 via-transparent to-transparent pointer-events-none" />

                {/* Subtitle tag overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-serif italic text-white/95">
                    &ldquo;Serving humanity is not a task — it is a lifelong commitment.&rdquo;
                  </p>
                </div>
              </div>

              {/* Signature Overlay */}
              <div className="absolute -bottom-8 -right-2 z-20 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-lg border border-[#BD9256]/40 shadow-lg">
                <img
                  src="/images/signature.png"
                  alt="Deven Jha Signature"
                  className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-xs"
                />
                <span className="text-[9px] font-bold tracking-widest text-[#777777] uppercase block text-center">
                  Founder &amp; President
                </span>
              </div>

              {/* Mini Highlights Pill */}
              <div className="mt-12 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#ebdcc9] text-center">
                  <span className="font-serif text-2xl font-bold text-[#14283B] block">20+</span>
                  <span className="text-[11px] font-medium text-[#777777]">Years of Service</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F8F6F0] border border-[#ebdcc9] text-center">
                  <span className="font-serif text-2xl font-bold text-[#BD9256] block">15 States</span>
                  <span className="text-[11px] font-medium text-[#777777]">National Outreach</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Editorial Biography Storytelling (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Gold Section Label */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-[1.5px] bg-[#BD9256]" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
                MY STORY
              </span>
            </div>

            {/* Editorial Heading */}
            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-bold text-[#14283B] leading-[1.18] tracking-tight mb-8">
              A Life Dedicated to <br />
              <span className="font-serif italic text-[#BD9256]">Making a Difference.</span>
            </h2>

            {/* Structured Biography Content */}
            <div className="space-y-5 text-[15px] sm:text-[16px] text-[#2c3e50] leading-relaxed">
              
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#BD9256] first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                Hey! Myself <strong className="font-semibold text-[#14283B]">Devendra Kumar Jha</strong>,
                popularly known as <strong className="text-[#BD9256] font-semibold">Deven Jha</strong>,
                born in Madhubani, Bihar, India.
              </p>

              <p>
                By the grace of God, I have been serving society as a social worker for many years.
                I undertake different types of social work with the aim of understanding today&apos;s
                society and serving it better.
              </p>

              {/* Highlight callout box for 2004 Delhi migration */}
              <div className="bg-[#F8F6F0] border-l-[3.5px] border-[#BD9256] p-4 sm:p-5 rounded-r-lg my-6">
                <p className="text-[14.5px] sm:text-[15.5px] text-[#14283B] font-medium">
                  With a deep passion for doing something meaningful for society, I came to
                  <span className="text-[#BD9256] font-bold"> New Delhi in 2004</span> to contribute
                  towards building a better society and achieving my dream of a prosperous India.
                </p>
              </div>

              <p>
                While residing in New Delhi, I started helping poor and needy people in different ways
                to improve their quality of life. From initial grassroots efforts to community support,
                every step reinforced my conviction in social empowerment.
              </p>

              {/* Parents Tribute */}
              <div className="py-2.5 px-4 rounded-lg bg-[#FAF7F2] border border-[#ebdcc9] text-[14px] text-[#4a5568] flex items-center gap-3">
                <HeartHandshake className="w-5 h-5 text-[#BD9256] shrink-0" />
                <span>
                  My parents, Mother <strong className="text-[#14283B]">Mrs. Ranjana Jha</strong> and
                  my father <strong className="text-[#14283B]">Late Shri Vidhyanath Jha</strong>,
                  have been an important source of support and inspiration in my journey.
                </span>
              </div>

              <p>
                To make social service a regular part of my life, I decided to establish my own NGO,
                <strong className="text-[#14283B] font-semibold"> People&apos;s Association</strong>,
                in <strong className="text-[#BD9256] font-semibold">2016</strong>.
              </p>

              <p>
                Today, our NGO is working across <strong className="text-[#BD9256] font-semibold">15 states</strong> of
                the country. As its President, I continue to work with my dedicated team to support
                people who need assistance.
              </p>

              {/* Key Support Pillars List */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-2">
                <div className="p-3 bg-white border border-[#e2d6c5] rounded-lg text-center shadow-xs">
                  <span className="text-xs font-bold text-[#14283B] block">Free Education</span>
                  <span className="text-[10.5px] text-[#777777]">Youth &amp; Children</span>
                </div>
                <div className="p-3 bg-white border border-[#e2d6c5] rounded-lg text-center shadow-xs">
                  <span className="text-xs font-bold text-[#14283B] block">Food Assistance</span>
                  <span className="text-[10.5px] text-[#777777]">Nutritional Relief</span>
                </div>
                <div className="p-3 bg-white border border-[#e2d6c5] rounded-lg text-center shadow-xs">
                  <span className="text-xs font-bold text-[#14283B] block">Clothing Support</span>
                  <span className="text-[10.5px] text-[#777777]">Winter &amp; Essentials</span>
                </div>
                <div className="p-3 bg-white border border-[#e2d6c5] rounded-lg text-center shadow-xs">
                  <span className="text-xs font-bold text-[#14283B] block">Healthcare</span>
                  <span className="text-[10.5px] text-[#777777]">Medical Relief Camps</span>
                </div>
              </div>

              <p className="pt-2 text-[15.5px] font-serif italic text-[#14283B] border-t border-[#ebdcc9]">
                &ldquo;My vision has always been to create opportunities for people, improve lives and
                contribute towards building a prosperous and inclusive India.&rdquo;
              </p>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
