import React, { useEffect } from 'react';
import { X, Calendar, Tv, ExternalLink, Share2 } from 'lucide-react';

export interface DigitalMediaItem {
  id: string;
  youtubeId?: string;
  embedUrl?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'uploaded';
  thumbnail: string;
  title?: string;
  channel?: string;
  date?: string;
  category?: 'Television Interview' | 'Digital Broadcast' | 'News Coverage' | 'Documentary' | string;
  duration?: string;
  description?: string;
}

interface VideoPlayerModalProps {
  video: DigitalMediaItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0d1826] rounded-xl shadow-2xl border border-[#1f344e] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#101f30] border-b border-[#1f344e] flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] bg-[#1a2d42] px-2.5 py-0.5 rounded">
              {video.category || (video.videoType === 'uploaded' ? 'Video Feature' : 'Broadcast')}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-white line-clamp-1">
              {video.title || 'Official Video'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player (16:9 Aspect Ratio) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {video.videoType === 'uploaded' || video.videoUrl ? (
            <video
              src={video.videoUrl}
              poster={video.thumbnail}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <iframe
              src={video.embedUrl ? `${video.embedUrl}?autoplay=1&rel=0&modestbranding=1` : `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title || 'Video Player'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Video Details Bar */}
        <div className="p-5 bg-[#0d1826] overflow-y-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c2e44] pb-3">
            <div>
              {video.title && (
                <h3 className="font-serif text-lg font-bold text-white leading-snug">
                  {video.title}
                </h3>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                {video.channel && (
                  <span className="flex items-center gap-1.5 text-[#BD9256] font-medium">
                    <Tv className="w-3.5 h-3.5" />
                    {video.channel}
                  </span>
                )}
                {video.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {video.date}
                  </span>
                )}
                {video.duration && (
                  <span className="text-gray-500">
                    Duration: {video.duration}
                  </span>
                )}
              </div>
            </div>

            {video.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#BD9256] hover:bg-[#a67d43] text-white text-xs font-semibold rounded transition shrink-0"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {!video.youtubeId && video.videoUrl && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#BD9256] hover:bg-[#a67d43] text-white text-xs font-semibold rounded transition shrink-0"
              >
                <span>Open Raw Video</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {video.description && (
            <p className="text-xs text-gray-300 leading-relaxed">
              {video.description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

