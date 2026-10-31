import React from 'react';
import { Link } from 'react-router-dom';
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

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1420] text-gray-300 pt-16 pb-8 border-t border-[#1a293d]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 6 Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#23384d] flex items-center justify-center p-1 shrink-0 shadow-xs">
                <img
                  src="/images/logo.png"
                  alt="Deven Jha Official Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-[18px] font-bold text-white tracking-wider leading-tight">
                  Deven Jha
                </h3>
                <p className="text-[7.5px] font-semibold tracking-[0.16em] text-[#b8863b] uppercase">
                  LEADER | ENTREPRENEUR
                </p>
              </div>
            </div>
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
                <Link
                  to="/"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/media-coverage"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Media Coverage
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/awards"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/#businesses"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Connect Me
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Contact Us
                </Link>
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
                <Link
                  to="/media-coverage/print"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Print Media
                </Link>
              </li>
              <li>
                <Link
                  to="/media-coverage/digital"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Digital Media
                </Link>
              </li>
              <li>
                <Link
                  to="/media-coverage"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Press Releases
                </Link>
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
                <Link
                  to="/gallery/awards"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Awards
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/celebrity"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Pictures With Celebrities
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/social-events"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Social Events
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/invitations"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Program Invitations
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/videos"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery/personal"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Personal Pictures
                </Link>
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
                  className="hover:text-[#b8863b] transition-colors block"
                >
                  People&apos;s Association
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/c/jantalivenews/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b8863b] transition-colors block"
                >
                  Janta Live
                </a>
              </li>
              <li>
                <Link
                  to="/#businesses"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  Production House
                </Link>
              </li>
              <li>
                <a
                  href="https://celebritybulaye.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#b8863b] transition-colors block"
                >
                  Celebrity Bulaye
                </a>
              </li>
              <li>
                <Link
                  to="/#businesses"
                  className="hover:text-[#b8863b] transition-colors cursor-pointer text-left block"
                >
                  More Businesses
                </Link>
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
        <div className="border-t border-[#172537] pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2025 Deven Jha. All Rights Reserved.</p>

          {/* Manshi Group Website Credit */}
          <div className="text-center">
            <a
              href="https://www.manshigroup.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#b8863b] transition-colors duration-200 inline-block font-medium tracking-wide"
            >
              Designed &amp; Developed by Manshi Group Of Services
            </a>
          </div>

          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <button
              onClick={() => alert("Privacy Policy: Deven Jha's official website respects your privacy. Any personal details submitted through our forms are kept confidential and used solely for communication.")}
              className="hover:text-[#b8863b] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => alert("Terms & Conditions: All media, photographs, and archival records on this site are the property of Devendra Kumar Jha and respective publication owners.")}
              className="hover:text-[#b8863b] transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-8 h-8 rounded-full bg-[#1b2b40] hover:bg-[#b8863b] text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer ml-1"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
