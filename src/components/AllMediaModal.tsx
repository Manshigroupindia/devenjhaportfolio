import React from 'react';
import { X, ExternalLink, Calendar, Newspaper, Tv, Award } from 'lucide-react';
import { usePrintMedia, useDigitalMedia } from '../hooks/useCMSContent.ts';

interface AllMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllMediaModal: React.FC<AllMediaModalProps> = ({ isOpen, onClose }) => {
  const { data: printItems, loading: loadingPrint } = usePrintMedia(true);
  const { data: digitalItems, loading: loadingDigital } = useDigitalMedia(true);
  const isLoading = loadingPrint || loadingDigital;

  const combinedMedia = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      headline: string;
      date: string;
      publication: string;
      type: string;
      image: string;
      isVideo?: boolean;
    }> = [];

    printItems.forEach((p) => {
      list.push({
        id: p.id,
        title: p.publication || 'Press Clipping',
        headline: p.title || p.description || 'Media Recognition',
        date: p.date || '',
        publication: p.publication || 'Print Publication',
        type: p.category || 'Print Media',
        image: p.image || p.imageUrl || '',
        isVideo: false,
      });
    });

    digitalItems.forEach((v) => {
      list.push({
        id: v.id,
        title: v.channel || 'Broadcast Media',
        headline: v.title,
        date: v.date || '',
        publication: v.channel || 'Digital Channel',
        type: v.category || 'Video Broadcast',
        image:
          v.thumbnail ||
          (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : ''),
        isVideo: true,
      });
    });

    return list;
  }, [printItems, digitalItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#ebdcc9] overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-[#0e1b2b] text-white px-6 py-4 flex items-center justify-between border-b border-[#23354c] shrink-0">
          <div>
            <span className="text-[10.5px] font-bold tracking-[0.2em] text-[#b8863b] uppercase">
              Press &amp; Publications Archive
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold">
              Media Coverage &amp; Press Features
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#faf8f5]">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-lg p-4 border border-[#e2d6c5] flex gap-4 animate-pulse">
                  <div className="w-28 aspect-[4/3] bg-[#ede5d8] rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#ede5d8] rounded w-1/3" />
                    <div className="h-4 bg-[#ede5d8] rounded w-3/4" />
                    <div className="h-3 bg-[#ede5d8] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && combinedMedia.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Newspaper className="w-10 h-10 mx-auto text-[#b8863b] mb-2 opacity-60" />
              <p className="text-sm font-semibold">No media records currently published.</p>
            </div>
          )}

          {!isLoading && combinedMedia.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {combinedMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 border border-[#e2d6c5] shadow-xs flex flex-col sm:flex-row gap-4 items-center"
                >
                  <div className="w-full sm:w-32 aspect-[4/3] rounded overflow-hidden bg-[#f3ede3] shrink-0 border border-[#eee2d2] flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : item.isVideo ? (
                      <Tv className="w-8 h-8 text-[#b8863b]" />
                    ) : (
                      <Newspaper className="w-8 h-8 text-[#b8863b]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8863b] bg-[#f8f2e7] px-2 py-0.5 rounded">
                        {item.type}
                      </span>
                      {item.date && <span className="text-[11px] text-gray-500">{item.date}</span>}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#111c2a] leading-snug mb-1 line-clamp-2">
                      {item.headline}
                    </h4>
                    <p className="text-xs text-[#64748b]">
                      {item.publication}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#0e1b2b] text-white p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div>
              <h4 className="font-serif text-base font-bold text-white mb-0.5">
                Media &amp; Press Inquiries
              </h4>
              <p className="text-xs text-gray-300">
                For press releases, high-resolution media kits, or interview scheduling, please get in touch with our media desk.
              </p>
            </div>
            <a
              href="mailto:info@devenjha.com?subject=Press%20Inquiry%20-%20Deven%20Jha"
              className="shrink-0 px-4 py-2 bg-[#b8863b] hover:bg-[#a37430] text-white text-xs font-semibold rounded transition"
            >
              Contact Press Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

