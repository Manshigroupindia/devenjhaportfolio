import React from 'react';
import {
  GraduationCap,
  Utensils,
  Shirt,
  HeartPulse,
  MapPin,
  ArrowRight,
  ExternalLink,
  Shield,
} from 'lucide-react';

interface AboutPeoplesAssociationProps {
  onOpenAppointment: () => void;
  image?: string;
}

const initiatives = [
  {
    icon: <MapPin className="w-5 h-5 text-[#BD9256]" />,
    title: 'Across 15 States',
    description: 'Active grassroots presence and volunteer network working across 15 states of India.',
    tag: 'Nationwide Network',
  },
  {
    icon: <GraduationCap className="w-5 h-5 text-[#BD9256]" />,
    title: 'Free Education',
    description: 'Supplying school books, stationery, learning kits, and tutoring support to underprivileged children.',
    tag: 'Empowering Youth',
  },
  {
    icon: <Utensils className="w-5 h-5 text-[#BD9256]" />,
    title: 'Food Assistance',
    description: 'Organizing nutrition and ration distribution drives for vulnerable families and community kitchens.',
    tag: 'Hunger Relief',
  },
  {
    icon: <Shirt className="w-5 h-5 text-[#BD9256]" />,
    title: 'Clothing Support',
    description: 'Annual winter warm-clothing drives, blankets, and essential apparel provision for needy households.',
    tag: 'Dignified Living',
  },
  {
    icon: <HeartPulse className="w-5 h-5 text-[#BD9256]" />,
    title: 'Healthcare Assistance',
    description: 'Free medical checkup camps, essential medicine distribution, and emergency health support guidance.',
    tag: 'Wellness & Health',
  },
];

export const AboutPeoplesAssociation: React.FC<AboutPeoplesAssociationProps> = ({
  onOpenAppointment,
  image,
}) => {
  return (
    <section className="py-18 sm:py-24 bg-[#FFFFFF] border-b border-[#ebdcc9] relative overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center mb-16">
          
          {/* Left Text & Overview (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#BD9256]" />
              <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
                PEOPLE&apos;S ASSOCIATION (ESTD. 2016)
              </span>
            </div>

            <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-bold text-[#14283B] leading-[1.18] mb-4">
              Turning Compassion <br />
              <span className="font-serif italic text-[#BD9256]">Into Action.</span>
            </h2>

            <p className="text-[15px] sm:text-[16px] text-[#4a5568] leading-relaxed mb-6 max-w-2xl">
              Through People&apos;s Association, our commitment is to reach people in need and make a meaningful difference in their lives.
              Founded in 2016, the organization operates under the guiding principle of selfless service, providing direct humanitarian relief across rural and semi-urban communities.
            </p>

            {/* Quick Tagline Callout */}
            <div className="p-4 rounded-lg bg-[#F8F6F0] border-l-4 border-[#BD9256] mb-8">
              <p className="text-xs sm:text-sm font-semibold text-[#14283B]">
                &ldquo;Where compassion meets structured commitment, real societal change takes root.&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAppointment}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#BD9256] hover:bg-[#a67d43] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Explore Our Initiatives</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://facebook.com/Devenjha96"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-[#14283B] hover:text-[#BD9256] transition-colors"
              >
                <span>View Field Updates</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Photograph Composition (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[460px]">
              
              {/* Backing decorative border */}
              <div className="absolute -inset-3 rounded-2xl border-2 border-[#ebdcc9] bg-[#FAF7F2] -z-10 rotate-1" />

              {/* Archival Community Photograph or Editorial Emblem */}
              <div className="relative rounded-xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-br from-[#14283B] via-[#1a344d] to-[#14283B] aspect-[4/3] flex flex-col justify-between p-6">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="People's Association Community Outreach and Relief"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#BD9256]/20 border border-[#BD9256]/40 flex items-center justify-center text-[#BD9256]">
                        <Shield className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#BD9256] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        Est. 2016
                      </span>
                    </div>

                    <div className="relative z-10 my-auto text-center py-4">
                      <h4 className="font-serif text-2xl font-bold text-white tracking-tight">
                        People&apos;s Association
                      </h4>
                      <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">
                        Dedicated to Education, Relief &amp; Nationwide Grassroots Welfare
                      </p>
                    </div>
                  </>
                )}

                <div className="relative z-10 pt-3 border-t border-white/10 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block">
                    Community Fieldwork
                  </span>
                  <p className="text-xs text-white/95 font-medium">
                    People&apos;s Association youth &amp; community service initiatives
                  </p>
                </div>
              </div>

              {/* Floating Stat Pill */}
              <div className="absolute -top-4 -left-4 bg-[#14283B] text-white px-4 py-2.5 rounded-lg border border-[#BD9256]/50 shadow-lg">
                <span className="font-serif text-lg font-bold text-[#BD9256] block leading-none">
                  15 States
                </span>
                <span className="text-[10px] text-gray-300 font-medium">
                  Active Presence
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* 5 Core Initiatives Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          {initiatives.map((item, index) => (
            <div
              key={index}
              className="bg-[#F8F6F0] rounded-xl p-5 border border-[#ebdcc9] shadow-xs hover:shadow-md hover:border-[#BD9256] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-white border border-[#e2d6c5] flex items-center justify-center mb-3.5 shadow-xs">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-bold text-[14px] text-[#14283B] mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

