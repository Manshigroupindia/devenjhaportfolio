import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Globe, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentPage?: 'home' | 'about';
  onNavigate?: (page: 'home' | 'about') => void;
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenAppointment,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLinkClick = (page: 'home' | 'about', hash?: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
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
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#ebdcc9]'
          : 'bg-[#faf8f5]/90 backdrop-blur-sm border-b border-[#f0e8db]'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex flex-col group cursor-pointer text-left"
          >
            <span className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0d1826] tracking-[0.08em] group-hover:text-[#a87932] transition-colors leading-tight">
              DEVEN JHA
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.18em] text-[#64748b] uppercase mt-[1px]">
              SOCIAL WORKER | ENTREPRENEUR | LEADER
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[13.5px] font-medium text-[#2d3748]">
            {/* Home */}
            <button
              onClick={() => handleLinkClick('home')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              Home
            </button>

            {/* About Us */}
            <button
              onClick={() => handleLinkClick('about')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                currentPage === 'about'
                  ? 'text-[#a87932] font-semibold border-b-2 border-[#a87932]'
                  : 'hover:text-[#a87932]'
              }`}
            >
              About Us
            </button>

            {/* Media Coverage Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('media')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => toggleDropdown('media')}
                className="flex items-center gap-1 px-3 py-1.5 hover:text-[#a87932] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Media Coverage</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'media' && (
                <div className="absolute top-full left-0 w-52 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleLinkClick('home', '#media')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Print Media (Newspapers)
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#media')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Digital &amp; TV Interviews
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#media')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Press Releases &amp; Features
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('gallery')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => toggleDropdown('gallery')}
                className="flex items-center gap-1 px-3 py-1.5 hover:text-[#a87932] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Gallery</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'gallery' && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Awards &amp; Citations
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Pictures With Celebrities
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Social &amp; NGO Events
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Program Invitations
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Videos &amp; Documentaries
                  </button>
                  <button
                    onClick={() => handleLinkClick('home', '#gallery')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Personal Pictures
                  </button>
                </div>
              )}
            </div>

            {/* Connect Me Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('connect')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => toggleDropdown('connect')}
                className="flex items-center gap-1 px-3 py-1.5 hover:text-[#a87932] transition-colors focus:outline-none cursor-pointer"
              >
                <span>Connect Me</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
              </button>

              {activeDropdown === 'connect' && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-[#ede5d8] py-2 z-50 animate-fadeIn">
                  <a
                    href="https://peoplesassociation.org"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors"
                  >
                    People&apos;s Association (NGO)
                  </a>
                  <a
                    href="https://www.youtube.com/c/jantalivenews/"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors"
                  >
                    Janta Live News
                  </a>
                  <a
                    href="https://celebritybulaye.com"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors"
                  >
                    Celebrity Bulaye
                  </a>
                  <button
                    onClick={() => handleLinkClick('home', '#social')}
                    className="block w-full text-left px-4 py-2 text-xs text-[#334155] hover:bg-[#faf7f0] hover:text-[#a87932] transition-colors cursor-pointer"
                  >
                    Social Channels &amp; Handles
                  </button>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <button
              onClick={() => handleLinkClick('home', '#contact')}
              className="px-3 py-1.5 hover:text-[#a87932] transition-colors cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Right actions: Google Translate & Appointment CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Google Translate Wrapper */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f5ede2]/60 hover:bg-[#f5ede2] border border-[#e4d6c4] rounded-md transition-all text-xs font-medium text-[#4a5568]">
              <Globe className="w-3.5 h-3.5 text-[#a87932]" />
              <div id="google_translate_element" className="translate-widget" />
            </div>

            {/* Appointment Button */}
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b8863b] hover:bg-[#a37430] active:scale-[0.98] text-white text-[13px] font-medium tracking-wide rounded-md shadow-sm transition-all duration-200 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Take an Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAppointment}
              className="px-2.5 py-1.5 bg-[#b8863b] text-white text-xs font-medium rounded-md shadow-sm"
            >
              Appointment
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#334155] hover:text-[#a87932] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#ebdcc9] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => handleLinkClick('home')}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              currentPage === 'home' ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleLinkClick('about')}
            className={`block w-full text-left py-2 font-semibold border-b border-gray-100 ${
              currentPage === 'about' ? 'text-[#a87932]' : 'text-[#2d3748]'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleLinkClick('home', '#media')}
            className="block w-full text-left py-2 text-[#2d3748] font-medium hover:text-[#a87932] border-b border-gray-100"
          >
            Media Coverage
          </button>
          <button
            onClick={() => handleLinkClick('home', '#gallery')}
            className="block w-full text-left py-2 text-[#2d3748] font-medium hover:text-[#a87932] border-b border-gray-100"
          >
            Gallery
          </button>
          <button
            onClick={() => handleLinkClick('home', '#businesses')}
            className="block w-full text-left py-2 text-[#2d3748] font-medium hover:text-[#a87932] border-b border-gray-100"
          >
            Connect Me
          </button>
          <button
            onClick={() => handleLinkClick('home', '#contact')}
            className="block w-full text-left py-2 text-[#2d3748] font-medium hover:text-[#a87932] border-b border-gray-100"
          >
            Contact Us
          </button>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#b8863b] text-white font-medium text-sm rounded-md shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Take an Appointment</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
