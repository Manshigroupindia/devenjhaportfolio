import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Tv,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Play,
  Calendar,
  Layers,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { usePrintMedia, useDigitalMedia } from '../hooks/useCMSContent.ts';

interface MediaPageProps {
  onNavigatePrint?: () => void;
  onNavigateDigital?: () => void;
  onOpenAppointment: () => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({
  onNavigatePrint,
  onNavigateDigital,
  onOpenAppointment,
}) => {
  const { data: printItems, loading: loadingPrint } = usePrintMedia(true);
  const { data: digitalItems, loading: loadingDigital } = useDigitalMedia(true);
  const isLoading = loadingPrint || loadingDigital;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Media Coverage | Devendra Kumar Jha (Deven Jha)';
  }, []);

  return (
    <div className="bg-[#FFFFFF] animate-fadeIn min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-18 sm:py-24 bg-[#14283B] text-white">
        {/* Subtle media gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1420] via-[#14283B] to-[#0e1c2b]" />
        <div className="absolute inset-0 bg-[radial-gradient(#BD9256_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#BD9256]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <div className="max-w-3xl mx-auto">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1e3852] border border-[#BD9256]/40 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#BD9256]" />
              <span className="text-[11px] font-bold tracking-[0.22em] text-[#BD9256] uppercase">
                PRESS &amp; PUBLIC RECOGNITION
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-[36px] sm:text-[46px] lg:text-[54px] font-bold text-white leading-tight mb-4 tracking-tight">
              My Journey Through <br />
              <span className="font-serif italic text-[#BD9256]">The Media</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              A collection of media appearances, newspaper publications, interviews and stories reflecting my journey and social contributions.
            </p>

            {/* Quick jump anchor pill */}
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BD9256]" />
                National Dailies
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BD9256]" />
                Magazines
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#BD9256]" />
                Television Interviews
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Two Large Premium Category Cards */}
      <section className="py-16 sm:py-20 bg-[#F8F6F0] border-b border-[#ebdcc9]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase block mb-1">
              MEDIA CATEGORIES
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#14283B]">
              Explore Media Archives
            </h2>
            <div className="w-16 h-[2px] bg-[#BD9256] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Card 1: PRINT MEDIA */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-[#e2d6c5] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-[#BD9256]">
              {/* Image Banner / Collage */}
              <div className="relative h-64 sm:h-72 bg-[#f4ece0] overflow-hidden flex items-center justify-center">
                {printItems.length >= 2 && (printItems[0].image || printItems[0].imageUrl) && (printItems[1].image || printItems[1].imageUrl) ? (
                  <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3 transform group-hover:scale-105 transition-transform duration-500">
                    <div className="rounded-lg overflow-hidden border border-white shadow-sm bg-white">
                      <img
                        src={printItems[0].image || printItems[0].imageUrl}
                        alt={printItems[0].title || 'Print Media'}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="rounded-lg overflow-hidden border border-white shadow-sm bg-white">
                      <img
                        src={printItems[1].image || printItems[1].imageUrl}
                        alt={printItems[1].title || 'Print Media'}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                ) : printItems.length >= 1 && (printItems[0].image || printItems[0].imageUrl) ? (
                  <div className="absolute inset-0 p-3 transform group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={printItems[0].image || printItems[0].imageUrl}
                      alt={printItems[0].title || 'Print Media'}
                      className="w-full h-full object-cover object-top rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#9f8d7b] p-6 text-center">
                    <Newspaper className="w-16 h-16 text-[#BD9256] mb-2" />
                    <span className="font-serif text-lg font-bold text-[#14283B]">Print Media Archive</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#14283B]/90 via-[#14283B]/40 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#14283B] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Newspaper className="w-3.5 h-3.5 text-[#BD9256]" />
                  <span>Press Archive</span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold tracking-wider text-[#BD9256] uppercase block">
                    Category 01
                  </span>
                  <h3 className="font-serif text-2xl font-bold">
                    PRINT MEDIA
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <p className="text-sm text-[#4a5568] leading-relaxed mb-6">
                  Newspapers, magazines and print publications featuring my journey, work and achievements. Highlighting reports from Dainik Jagran, The Times of India, and India Today.
                </p>

                <div className="pt-4 border-t border-[#f0e8dc] flex items-center justify-between">
                  <Link
                    to="/media-coverage/print"
                    onClick={onNavigatePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#14283B] hover:bg-[#BD9256] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Explore Print Media</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-xs font-semibold text-[#777777]">
                    {printItems.length ? `${printItems.length} Published Clippings` : 'Press Clippings'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: DIGITAL MEDIA */}
            <div className="group bg-white rounded-2xl overflow-hidden border border-[#e2d6c5] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-[#BD9256]">
              {/* Image Banner / Video Mock */}
              <div className="relative h-64 sm:h-72 bg-[#0e1b2b] overflow-hidden flex items-center justify-center">
                {digitalItems.length > 0 && (digitalItems[0].thumbnail || digitalItems[0].youtubeId) ? (
                  <img
                    src={
                      digitalItems[0].thumbnail ||
                      `https://img.youtube.com/vi/${digitalItems[0].youtubeId}/hqdefault.jpg`
                    }
                    alt={digitalItems[0].title || 'Digital Video'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                    <Tv className="w-16 h-16 text-[#BD9256] mb-2" />
                    <span className="font-serif text-lg font-bold text-white">Broadcast Archive</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#14283B]/90 via-[#14283B]/40 to-transparent pointer-events-none" />

                {/* Simulated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#BD9256] text-white shadow-xl flex items-center justify-center transform group-hover:scale-115 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#14283B] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Tv className="w-3.5 h-3.5 text-[#BD9256]" />
                  <span>Broadcast Archive</span>
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold tracking-wider text-[#BD9256] uppercase block">
                    Category 02
                  </span>
                  <h3 className="font-serif text-2xl font-bold">
                    DIGITAL MEDIA
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <p className="text-sm text-[#4a5568] leading-relaxed mb-6">
                  Television appearances, digital publications, interviews and video features. Direct on-site playback of interviews with Aaj Tak and Janta Live News broadcasts.
                </p>

                <div className="pt-4 border-t border-[#f0e8dc] flex items-center justify-between">
                  <Link
                    to="/media-coverage/digital"
                    onClick={onNavigateDigital}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#BD9256] hover:bg-[#a67d43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Explore Digital Media</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <span className="text-xs font-semibold text-[#777777]">
                    6+ Video Features
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Featured Recent Media Highlights */}
      <section className="py-16 sm:py-20 bg-[#FFFFFF]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#BD9256] uppercase block mb-1">
                TOP COVERAGE
              </span>
              <h2 className="font-serif text-[28px] sm:text-[32px] font-bold text-[#14283B]">
                Featured Press Highlights
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigatePrint}
                className="text-xs font-semibold text-[#BD9256] hover:text-[#14283B] transition-colors"
              >
                All Print Stories →
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={onNavigateDigital}
                className="text-xs font-semibold text-[#BD9256] hover:text-[#14283B] transition-colors"
              >
                All Video Interviews →
              </button>
            </div>
          </div>

          {/* 4 Featured Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading && (
              <>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-[#FAF8F5] rounded-xl border border-[#ebdcc9] p-4 animate-pulse">
                    <div className="aspect-[4/3] bg-[#ede5d8] rounded-lg mb-3" />
                    <div className="h-3 bg-[#ede5d8] rounded w-1/2 mb-2" />
                    <div className="h-4 bg-[#ede5d8] rounded w-3/4 mb-1" />
                    <div className="h-3 bg-[#ede5d8] rounded w-2/3" />
                  </div>
                ))}
              </>
            )}

            {!isLoading && (
              <>
                {/* Print Clippings */}
                {printItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={onNavigatePrint}
                    className="group bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#ebdcc9] p-4 cursor-pointer hover:shadow-lg transition-all hover:border-[#BD9256]"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mb-3 border border-[#e2d6c5] flex items-center justify-center">
                      {item.image || item.imageUrl ? (
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.title || 'Print Media'}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#9f8d7b] p-3 text-center">
                          <Newspaper className="w-8 h-8 text-[#BD9256] mb-1" />
                          <span className="text-[10px] font-bold uppercase">{item.publication || 'Press'}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                      {item.publication || 'Newspaper'}{item.date ? ` • ${item.date}` : ''}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#14283B] group-hover:text-[#BD9256] transition-colors line-clamp-2 mb-1">
                      {item.title || item.publication || 'Archival Press Clipping'}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-[#777777] line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}

                {/* Digital Video */}
                {digitalItems.slice(0, 1).map((video) => {
                  const thumb =
                    video.thumbnail ||
                    (video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : '');

                  return (
                    <div
                      key={video.id}
                      onClick={onNavigateDigital}
                      className="group bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#ebdcc9] p-4 cursor-pointer hover:shadow-lg transition-all hover:border-[#BD9256]"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black mb-3 border border-[#e2d6c5] relative flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                          />
                        ) : (
                          <Tv className="w-10 h-10 text-[#BD9256]" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#BD9256] flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#BD9256] block mb-1">
                        {video.channel || 'Broadcast'}{video.date ? ` • ${video.date}` : ''}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#14283B] group-hover:text-[#BD9256] transition-colors line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="text-xs text-[#777777] line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

        </div>
      </section>

      {/* 4. Press & Media Inquiries Callout */}
      <section className="py-14 bg-[#14283B] text-white border-t border-[#223952]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#1a334d] p-8 rounded-2xl border border-[#2b4d73]">
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#BD9256] block mb-1">
                FOR EDITORS &amp; BROADCAST DESKS
              </span>
              <h3 className="font-serif text-2xl font-bold mb-2">
                Media &amp; Press Engagements
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                For interview requests, television debate participation, quotes, or official press kit inquiries, please contact our media communication desk.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="mailto:info@devenjha.com?subject=Media%20Interview%20Request%20-%20Deven%20Jha"
                className="px-5 py-2.5 bg-[#BD9256] hover:bg-[#a67d43] text-white text-xs font-semibold rounded-lg shadow-sm transition"
              >
                Contact Press Desk
              </a>
              <button
                onClick={onOpenAppointment}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition cursor-pointer"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

