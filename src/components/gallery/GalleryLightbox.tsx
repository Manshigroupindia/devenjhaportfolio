import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Calendar,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { GalleryImageItem } from '../../types/gallery.ts';

interface GalleryLightboxProps {
  items: GalleryImageItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length, onClose, onNavigate]);

  if (currentIndex === null || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  const handleZoomToggle = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2.0 : 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0a121e]/95 backdrop-blur-md animate-fadeIn select-none">
      
      {/* Top Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#1f3247] bg-[#0d1826]/80 z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#BD9256] bg-[#1a2d42] px-2.5 py-1 rounded">
            {currentItem.category.toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
          <button
            onClick={handleZoomToggle}
            className="p-2 rounded-lg bg-[#162536] hover:bg-[#BD9256] hover:text-white transition-colors cursor-pointer"
            title={`Zoom (${Math.round(zoomLevel * 100)}%)`}
          >
            {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          <a
            href={currentItem.image}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg bg-[#162536] hover:bg-[#BD9256] hover:text-white transition-colors"
            title="Open raw image"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#162536] hover:bg-red-600 hover:text-white transition-colors cursor-pointer ml-2"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Center Image Display with Navigation Chevrons */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            aria-label="Previous photograph"
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-[#14283B]/80 hover:bg-[#BD9256] text-white border border-[#2b4461] transition-all hover:scale-110 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < items.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            aria-label="Next photograph"
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-[#14283B]/80 hover:bg-[#BD9256] text-white border border-[#2b4461] transition-all hover:scale-110 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* The Image Viewport Frame */}
        <div
          className="max-w-5xl max-h-[72vh] flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="p-2 bg-white rounded-lg shadow-2xl border-2 border-[#BD9256]/60">
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="max-h-[66vh] max-w-full object-contain rounded"
            />
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-6 py-4 bg-[#0d1826]/90 border-t border-[#1f3247] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-white">
            {currentItem.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
            {currentItem.date && (
              <span className="flex items-center gap-1.5 text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-[#BD9256]" />
                {currentItem.date}
              </span>
            )}
            {currentItem.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#BD9256]" />
                {currentItem.location}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-300 sm:max-w-md hidden md:block">
          {currentItem.description}
        </p>
      </div>

    </div>
  );
};

