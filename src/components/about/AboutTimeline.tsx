import React from 'react';
import { Flag, Building2, Globe2, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { TimelineItemDoc } from '../../types/cms.ts';

interface Milestone {
  year: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  tagline: string;
}

const defaultMilestones: Milestone[] = [
  {
    year: '2004',
    badge: 'A New Beginning',
    title: 'The Journey Commences in Delhi',
    description:
      'Moved to New Delhi with a vision of serving society and contributing towards a better, prosperous India. Began hands-on grassroots social welfare for needy communities.',
    icon: <Flag className="w-5 h-5 text-[#BD9256]" />,
    tagline: 'Migration & Purpose',
  },
  {
    year: '2016',
    badge: 'Institutional Foundation',
    title: "Foundation of People's Association",
    description:
      "Established People's Association to formalize and structure social service as a lifelong institutional commitment, providing systematic assistance in education and relief.",
    icon: <Building2 className="w-5 h-5 text-[#BD9256]" />,
    tagline: 'Non-Profit NGO Establishment',
  },
  {
    year: 'PRESENT',
    badge: 'Expanding Impact',
    title: 'Pan-India Reach Across 15 States',
    description:
      'Working across 15 states of India with a dedicated team to support underprivileged families through free education, food relief, clothing drives, and healthcare assistance.',
    icon: <Globe2 className="w-5 h-5 text-[#BD9256]" />,
    tagline: 'Nationwide Footprint',
  },
];

interface AboutTimelineProps {
  timeline?: TimelineItemDoc[];
}

export const AboutTimeline: React.FC<AboutTimelineProps> = ({ timeline }) => {
  const displayMilestones = React.useMemo(() => {
    if (timeline && timeline.length) {
      return timeline.map((t, idx) => ({
        year: t.year,
        badge: t.tag || 'Milestone',
        title: t.title,
        description: t.description || t.subtitle,
        icon: idx === 0 ? <Flag className="w-5 h-5 text-[#BD9256]" /> : idx === 1 ? <Building2 className="w-5 h-5 text-[#BD9256]" /> : <Globe2 className="w-5 h-5 text-[#BD9256]" />,
        tagline: t.subtitle || 'Milestone Record',
      }));
    }
    return defaultMilestones;
  }, [timeline]);

  return (
    <section className="py-20 lg:py-28 bg-[#14283B] text-white relative overflow-hidden border-b border-[#223b54]">
      {/* Subtle background ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#BD9256]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#BD9256]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3852] border border-[#BD9256]/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#BD9256]" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase">
              MILESTONES &amp; LEGACY
            </span>
          </div>

          <h2 className="font-serif text-[32px] sm:text-[40px] lg:text-[44px] font-bold text-white leading-tight">
            Milestones That Shaped <br />
            <span className="font-serif italic text-[#BD9256]">My Journey</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-3 leading-relaxed">
            Key defining moments from arriving in the capital to establishing a nationwide network of community support.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Visible on lg+) */}
        <div className="hidden lg:block relative pt-12 pb-6">
          
          {/* Continuous Gold Connecting Line */}
          <div className="absolute top-[48px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#BD9256]/40 via-[#BD9256] to-[#BD9256]/40 z-0" />

          {/* Horizontal Milestone Columns */}
          <div className={`grid grid-cols-${Math.min(displayMilestones.length, 3)} gap-8 relative z-10`}>
            {displayMilestones.slice(0, 3).map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                
                {/* Node indicator */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#14283B] border-2 border-[#BD9256] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#BD9256] transition-all duration-300">
                    <div className="group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                  </div>
                  {/* Glowing center pip */}
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#BD9256] border-2 border-[#14283B]" />
                </div>

                {/* Milestone Card */}
                <div className="w-full bg-[#1b334d]/90 hover:bg-[#1b334d] border border-[#2a496b] hover:border-[#BD9256] rounded-xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between min-h-[360px]">
                  <div>
                    {/* Year badge */}
                    <div className="flex items-center justify-between mb-3 border-b border-[#2d4d70] pb-2">
                      <span className="font-serif text-[32px] font-bold text-[#BD9256] tracking-tight">
                        {item.year}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-gray-300 bg-[#254668] px-2.5 py-1 rounded">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Visual photograph snippet */}
                  {item.image && (
                    <div className="mt-5 pt-3 border-t border-[#2d4d70] flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#BD9256]/50 bg-white/10 shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#BD9256] font-semibold tracking-wide uppercase block">
                          Archival Record
                        </span>
                        <span className="text-xs text-gray-200 font-medium">
                          {item.tagline}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Mobile & Tablet Vertical Timeline (Visible on < lg) */}
        <div className="lg:hidden relative pl-6 border-l-2 border-[#BD9256]/60 space-y-10 ml-4 sm:ml-8">
          {displayMilestones.map((item, index) => (
            <div key={index} className="relative group">
              
              {/* Vertical bullet */}
              <div className="absolute -left-[33px] top-1.5 w-5 h-5 rounded-full bg-[#14283B] border-2 border-[#BD9256] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#BD9256]" />
              </div>

              {/* Card */}
              <div className="bg-[#1b334d] border border-[#2a496b] rounded-xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif text-2xl font-bold text-[#BD9256]">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-bold text-gray-300 bg-[#254668] px-2 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
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
