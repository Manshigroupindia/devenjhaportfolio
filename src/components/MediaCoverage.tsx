import React from 'react';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { usePrintMedia, useDigitalMedia } from '../hooks/useCMSContent.ts';

export interface MediaItem {
  id: string;
  image: string;
  title: string;
  category: string;
  date: string;
  isVideo?: boolean;
  videoUrl?: string;
}

interface MediaCoverageProps {
  onSelectMedia: (item: MediaItem) => void;
  onViewAll: () => void;
}

const defaultMediaItems: MediaItem[] = [
  {
    id: 'dainik-jagran',
    image: '/images/media-dainik-jagran.png',
    title: 'Dainik Jagran',
    category: 'Newspaper Publication',
    date: '12 Mar 2024',
  },
  {
    id: 'times-of-india',
    image: '/images/media-toi.png',
    title: 'The Times of India',
    category: 'Newspaper Publication',
    date: '08 Feb 2024',
  },
  {
    id: 'india-today',
    image: '/images/media-india-today.png',
    title: 'India Today',
    category: 'Magazine Feature',
    date: '25 Jan 2024',
  },
  {
    id: 'aaj-tak',
    image: '/images/media-aaj-tak.png',
    title: 'Aaj Tak',
    category: 'Digital Media Interview',
    date: '14 Jun 2024',
    isVideo: true,
    videoUrl: 'https://www.youtube.com/embed/live_stream?channel=jantalivenews',
  },
];

export const MediaCoverage: React.FC<MediaCoverageProps> = ({ onSelectMedia, onViewAll }) => {
  const { data: printItems } = usePrintMedia(true);
  const { data: digitalItems } = useDigitalMedia(true);

  // Combine top 3 print clippings + 1 digital video for the homepage preview
  const displayItems: MediaItem[] = React.useMemo(() => {
    if (!printItems.length && !digitalItems.length) {
      return defaultMediaItems;
    }

    const items: MediaItem[] = [];
    // Top print items
    printItems.slice(0, 3).forEach((p) => {
      items.push({
        id: p.id,
        image: p.image || p.imageUrl || '',
        title: p.publication || p.title || 'Press Clipping',
        category: p.category || 'Newspaper Publication',
        date: p.date || '',
        isVideo: false,
      });
    });

    // Top video item
    if (digitalItems.length > 0) {
      const vid = digitalItems[0];
      items.push({
        id: vid.id,
        image: vid.thumbnail || '/images/media-aaj-tak.png',
        title: vid.channel || vid.title,
        category: vid.category || 'Digital Media Interview',
        date: vid.date,
        isVideo: true,
        videoUrl: vid.embedUrl,
      });
    }

    return items.length ? items : defaultMediaItems;
  }, [printItems, digitalItems]);

  return (
    <section id="media" className="py-14 sm:py-18 bg-[#fdfbf8] border-b border-[#ebdcc9]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-[#111c2a] leading-tight mb-1">
              In The Media
            </h2>
            <p className="text-xs sm:text-[13.5px] text-[#64748b]">
              A journey of social impact, recognition and public engagement.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-[#64748b] hover:text-[#a87932] transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Media Coverage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Media Cards Grid: 4 items + 1 big navy banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          
          {/* 4 Regular Media Cards (taking 1 col each on lg) */}
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="group bg-white rounded-lg overflow-hidden border border-[#e8ded0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[4/3] bg-[#f2ecdf] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />

                {/* Video Play Overlay */}
                {item.isVideo && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/35 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-[#a87932] fill-[#a87932] ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Subtle Hover Lens */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm p-1 rounded">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Details */}
              <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-[13px] sm:text-[13.5px] text-[#111c2a] group-hover:text-[#a87932] transition-colors line-clamp-1 mb-0.5">
                    {item.title}
                  </h3>
                  {item.category && (
                    <p className="text-[11px] text-[#64748b]">
                      {item.category}
                    </p>
                  )}
                </div>
                {item.date && (
                  <div className="mt-2 text-[10.5px] font-medium text-[#94a3b8]">
                    {item.date}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Prominent Dark Navy Media Banner (taking 2 cols on lg) */}
          <div
            onClick={onViewAll}
            className="group relative sm:col-span-2 rounded-lg overflow-hidden border border-[#1e2e42] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[190px] flex flex-col justify-between p-5 bg-[#0e1b2b]"
            style={{
              backgroundImage: 'url(/images/media-banner.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay with studio glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1826]/95 via-[#0d1826]/85 to-transparent z-0" />

            <div className="relative z-10">
              <span className="text-[10.5px] font-bold tracking-[0.18em] text-[#d4af62] uppercase block mb-1">
                Media Coverage
              </span>
              <h3 className="font-serif text-[18px] sm:text-[21px] font-bold text-white leading-tight">
                Newspapers, Magazines,<br />TV &amp; Digital Media
              </h3>
            </div>

            <div className="relative z-10 pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded shadow-sm transition-all duration-200"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
