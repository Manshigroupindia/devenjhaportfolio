import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowUp,
} from 'lucide-react';
import { PageType } from './Navbar.tsx';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLink = (page: PageType, hash?: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (hash) {
      setTimeout(() => {
        const elem = document.querySelector(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0b1420] text-gray-300 pt-16 pb-8 border-t border-[#1a293d]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 6 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="font-serif text-[20px] font-bold text-white tracking-wider mb-0.5">
              Deven Jha
            </h3>
            <p className="text-[8.5px] font-semibold tracking-[0.16em] text-[#b8863b] uppercase mb-3">
              SOCIAL WORKER | ENTREPRENEUR | LEADER
            </p>
            <p className="text-[11.5px] text-gray-400 leading-relaxed mb-4">
              Working for a better society, creating opportunities and building a prosperous India.
            </p>

            {/* Social Icons row */}
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/Devenjha96"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#162436] hover:bg-[#b8863b] flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                title="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="https://instagram.com/devenjha96"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#162436] hover:bg-[#b8863b] flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                title="Instagram"
              >
                <span className="text-[10px] font-bold">in</span>
              </a>
              <a
                href="https://www.youtube.com/c/jantalivenews/"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#162436] hover:bg-[#b8863b] flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                title="YouTube"
              >
                <span className="text-[10px] font-bold">yt</span>
              </a>
              <a
                href="https://linkedin.com/in/devenjha"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#162436] hover:bg-[#b8863b] flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                title="LinkedIn"
              >
                <span className="text-[10px] font-bold">li</span>
              </a>
              <a
                href="https://x.com/Devenjha96"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-[#162436] hover:bg-[#b8863b] flex items-center justify-center transition-colors text-gray-300 hover:text-white"
                title="X"
              >
                <span className="text-[10px] font-bold">X</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[11.5px] text-gray-400">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('media')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Media Coverage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-awards')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('home', '#businesses')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Connect Me
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('home', '#contact')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Media Coverage */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-3">
              Media Coverage
            </h4>
            <ul className="space-y-2 text-[11.5px] text-gray-400">
              <li>
                <button
                  onClick={() => handleLink('media-print')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Print Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('media-digital')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Digital Media
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('media')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Press Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Gallery (6 Categories) */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-3">
              Gallery
            </h4>
            <ul className="space-y-2 text-[11.5px] text-gray-400">
              <li>
                <button
                  onClick={() => handleLink('gallery-awards')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Awards
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-celebrities')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Pictures With Celebrities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-social')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Social Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-invitations')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Program Invitations
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-videos')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Videos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('gallery-personal')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Personal Pictures
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Business */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-3">
              Business
            </h4>
            <ul className="space-y-2 text-[11.5px] text-gray-400">
              <li>
                <a
                  href="https://peoplesassociation.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b8863b] transition-colors"
                >
                  People&apos;s Association
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/jantalivenews/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b8863b] transition-colors"
                >
                  Janta Live
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleLink('home', '#businesses')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  Production House
                </button>
              </li>
              <li>
                <a
                  href="https://celebritybulaye.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b8863b] transition-colors"
                >
                  Celebrity Bulaye
                </a>
              </li>
              <li>
                <button
                  onClick={() => handleLink('home', '#businesses')}
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left"
                >
                  More Businesses
                </button>
              </li>
            </ul>
          </div>

          {/* Col 6: Get In Touch */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-white mb-3">
              Get In Touch
            </h4>
            <ul className="space-y-2.5 text-[11.5px] text-gray-400 mb-4">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#b8863b] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#b8863b] shrink-0" />
                <a href="mailto:info@devenjha.com" className="hover:text-white transition-colors">
                  info@devenjha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#b8863b] shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>

            {/* Language indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#142233] border border-[#23354c] rounded text-[11px] text-gray-300">
              <Globe className="w-3 h-3 text-[#b8863b]" />
              <span>Select Language</span>
            </div>
          </div>

        </div>

        {/* Divider line */}
        <div className="border-t border-[#172537] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2025 Deven Jha. All Rights Reserved.</p>

          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <a href="#" className="hover:text-[#b8863b] transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="hover:text-[#b8863b] transition-colors">
              Terms &amp; Conditions
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-8 h-8 rounded-full bg-[#1b2b40] hover:bg-[#b8863b] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
