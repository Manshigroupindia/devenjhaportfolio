import React from 'react';
import { X, Calendar, Tag, ExternalLink } from 'lucide-react';
import { MediaItem } from './MediaCoverage.tsx';

interface MediaModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#ebdcc9] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0e1b2b] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#23354c]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#b8863b] bg-[#162537] px-2 py-0.5 rounded">
              {item.category}
            </span>
            <span className="text-sm font-bold text-white font-serif">{item.title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          {item.isVideo ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-inner">
              <iframe
                src="https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews&autoplay=1"
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-[#e2d6c5] shadow-sm bg-[#faf8f5] flex justify-center p-2">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-[500px] w-auto object-contain rounded"
              />
            </div>
          )}

          {/* Details */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#64748b] border-t border-[#f0e8dc] pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#b8863b]" />
                {item.date}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#b8863b]" />
                {item.category}
              </span>
            </div>

            <a
              href="https://www.youtube.com/c/jantalivenews/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#b8863b] hover:text-[#9c6f2a] font-semibold"
            >
              <span>Visit Janta Live Media Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

