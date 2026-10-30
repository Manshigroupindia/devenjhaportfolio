import React from 'react';
import { ArrowRight, Play, ExternalLink, Newspaper, Tv } from 'lucide-react';
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

export const MediaCoverage: React.FC<MediaCoverageProps> = ({ onSelectMedia, onViewAll }) => {
  const { data: printItems, loading: loadingPrint } = usePrintMedia(true);
  const { data: digitalItems, loading: loadingDigital } = useDigitalMedia(true);

  const isLoading = loadingPrint || loadingDigital;

  // Combine top 3 print clippings + 1 digital video for the homepage preview
  const displayItems: MediaItem[] = React.useMemo(() => {
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
      const videoThumb =
        vid.thumbnail ||
        (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : '');

      items.push({
        id: vid.id,
        image: videoThumb,
        title: vid.channel || vid.title,
        category: vid.category || 'Digital Media Interview',
        date: vid.date,
        isVideo: true,
        videoUrl: vid.embedUrl,
      });
    }

    return items;
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
          
          {/* Skeleton Cards while loading */}
          {isLoading && (
            <>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={`skeleton-${n}`}
                  className="bg-white rounded-lg overflow-hidden border border-[#e8ded0] p-3 animate-pulse"
                >
                  <div className="aspect-[4/3] bg-[#ede5d8] rounded mb-3" />
                  <div className="h-3.5 bg-[#ede5d8] rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-[#ede5d8] rounded w-1/2" />
                </div>
              ))}
            </>
          )}

          {/* 4 Regular Media Cards (taking 1 col each on lg) */}
          {!isLoading && displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMedia(item)}
              className="group bg-white rounded-lg overflow-hidden border border-[#e8ded0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[4/3] bg-[#f2ecdf] overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center text-[#9c8975]">
                    {item.isVideo ? (
                      <Tv className="w-8 h-8 mb-1 text-[#b8863b]" />
                    ) : (
                      <Newspaper className="w-8 h-8 mb-1 text-[#b8863b]" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                  </div>
                )}

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
            className="group relative sm:col-span-2 rounded-lg overflow-hidden border border-[#1e2e42] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[190px] flex flex-col justify-between p-5 bg-gradient-to-br from-[#0a1522] via-[#14283B] to-[#0d1d2d]"
          >
            {/* Subtle gold grid effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#BD9256]/15 rounded-full blur-2xl pointer-events-none" />

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
