import React, { useEffect, useState, useRef } from 'react';
import { Users, Smile, Coffee, Calendar, Award, Heart } from 'lucide-react';
import { StatItemDoc } from '../types/cms.ts';

interface ImpactStatsProps {
  stats?: StatItemDoc[];
}

const defaultStats: StatItemDoc[] = [
  {
    id: 'stat-1',
    iconName: 'Users',
    target: 412,
    formattedTarget: '412',
    label: 'Social Events',
  },
  {
    id: 'stat-2',
    iconName: 'Smile',
    target: 33458,
    formattedTarget: '33,458',
    label: 'Happy Peoples',
  },
  {
    id: 'stat-3',
    iconName: 'Coffee',
    target: 4124,
    formattedTarget: '4,124',
    label: 'Cups of Coffee',
  },
  {
    id: 'stat-4',
    iconName: 'Calendar',
    target: 2051,
    formattedTarget: '2,051',
    label: 'Total Events',
  },
];

export const ImpactStats: React.FC<ImpactStatsProps> = ({ stats }) => {
  const activeStats = stats && stats.length ? stats : defaultStats;
  const [counts, setCounts] = useState<number[]>(activeStats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800; // ms
          const steps = 40;
          const stepTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(
              activeStats.map((stat) => Math.round(stat.target * easeOutProgress))
            );

            if (currentStep >= steps) {
              clearInterval(timer);
              setCounts(activeStats.map((stat) => stat.target));
            }
          }, stepTime);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, activeStats]);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Smile':
        return <Smile className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
      case 'Calendar':
        return <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
      case 'Award':
        return <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
      case 'Heart':
        return <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
      case 'Users':
      default:
        return <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#b8863b]" strokeWidth={1.5} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 bg-[#f7f3ec] border-y border-[#ebdcc9]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kicker Header */}
        <div className="text-center mb-10">
          <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.22em] text-[#a87932] uppercase">
            NUMBERS THAT REFLECT OUR JOURNEY
          </span>
        </div>

        {/* 4 Stats Grid with elegant dividers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#e2d5c2]">
          {activeStats.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex flex-col items-center text-center px-4 ${
                index > 0 ? 'pt-6 lg:pt-0' : ''
              }`}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#f2e7d5] flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110">
                {renderIcon(item.iconName)}
              </div>

              {/* Counter Display */}
              <div className="font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[#111c2a] tracking-tight leading-none mb-1">
                {hasAnimated ? counts[index]?.toLocaleString() || item.target.toLocaleString() : item.formattedTarget}
              </div>

              {/* Label */}
              <div className="text-[13px] sm:text-[14px] font-medium text-[#64748b]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
