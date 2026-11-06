import React, { useState, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

/**
 * Determine currently active language code from Google Translate cookies or select combo.
 */
export function getActiveLanguage(): string {
  if (typeof document === 'undefined') return 'en';
  try {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo && combo.value) {
      return combo.value;
    }
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    // Ignore restricted storage errors
  }
  return 'en';
}

/**
 * Programmatically switch language by updating Google Translate's select combo & cookies.
 */
export function setLanguage(langCode: string): void {
  try {
    const isEnglish = langCode === 'en' || !langCode;

    // 1. Try to set value on Google Translate combo element
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (combo) {
      combo.value = isEnglish ? '' : langCode;
      combo.dispatchEvent(new Event('change'));
    }

    // 2. Set or clear googtrans cookies for persistent translation
    const host = window.location.hostname;
    const cookiePath = '/';
    if (isEnglish) {
      // Clear cookie to revert back to original language
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
      if (host) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=${host};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath}; domain=.${host};`;
      }
    } else {
      const cookieVal = `/en/${langCode}`;
      const expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath};`;
      if (host) {
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath}; domain=${host};`;
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=${cookiePath}; domain=.${host};`;
      }
    }

    // 3. Fallback: if combo not found, reload to let Google Translate read cookie
    if (!combo) {
      window.location.reload();
    }
  } catch (err) {
    console.warn('Language switch notice:', err);
  }
}

interface LanguageSwitcherProps {
  variant?: 'mobile-drawer' | 'footer' | 'compact';
  className?: string;
  onLanguageChanged?: (langCode: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'mobile-drawer',
  className = '',
  onLanguageChanged,
}) => {
  const [activeLang, setActiveLang] = useState<string>('en');

  useEffect(() => {
    setActiveLang(getActiveLanguage());

    // Listen for changes from other widgets or Google Translate
    const interval = setInterval(() => {
      const current = getActiveLanguage();
      setActiveLang((prev) => (prev !== current ? current : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSelectLanguage = (code: string) => {
    setActiveLang(code);
    setLanguage(code);
    if (onLanguageChanged) {
      onLanguageChanged(code);
    }
  };

  // Find active language display name
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === activeLang) || SUPPORTED_LANGUAGES[0];

  // 1. Mobile Navigation Drawer Layout
  if (variant === 'mobile-drawer') {
    const quickLanguages = SUPPORTED_LANGUAGES.slice(0, 5); // English, Hindi, Bengali, Marathi, Punjabi

    return (
      <div
        className={`bg-[#FAF8F5] border border-[#ebdcc9] rounded-xl p-3 select-none ${className}`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Globe className="w-3.5 h-3.5 text-[#a87932] shrink-0" />
            <span className="text-[11.5px] font-bold text-[#14283B] uppercase tracking-wide truncate">
              Language / भाषा
            </span>
          </div>
          <span className="text-[10px] font-semibold text-[#a87932] bg-white px-2 py-0.5 rounded border border-[#ebdcc9] shrink-0">
            {currentLangObj.native}
          </span>
        </div>

        {/* Quick select pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {quickLanguages.map((lang) => {
            const isSelected = activeLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#b8863b] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#475569] border border-[#e2d9cc] hover:border-[#b8863b] hover:text-[#14283B]'
                }`}
              >
                {lang.native}
              </button>
            );
          })}
        </div>

        {/* Dropdown for complete list */}
        <div className="relative">
          <select
            value={activeLang}
            onChange={(e) => handleSelectLanguage(e.target.value)}
            className="w-full pl-2.5 pr-8 py-1.5 bg-white border border-[#e2d9cc] rounded-lg text-xs font-medium text-[#1e293b] focus:outline-none focus:border-[#b8863b] cursor-pointer appearance-none"
            aria-label="Select full website language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>
    );
  }

  // 2. Footer Layout (Dark Navy theme)
  if (variant === 'footer') {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#142233] hover:bg-[#18293d] border border-[#23354c] hover:border-[#b8863b]/70 rounded text-[11px] text-gray-300 transition-colors">
          <Globe className="w-3 h-3 text-[#b8863b] shrink-0" />
          <select
            value={activeLang}
            onChange={(e) => handleSelectLanguage(e.target.value)}
            className="bg-transparent text-gray-200 text-[11px] cursor-pointer focus:outline-none pr-1"
            aria-label="Select footer language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#0e1927] text-gray-100">
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // 3. Compact inline layout
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
      <Globe className="w-3.5 h-3.5 text-[#b8863b]" />
      <select
        value={activeLang}
        onChange={(e) => handleSelectLanguage(e.target.value)}
        className="bg-white border border-[#e2d9cc] rounded px-2 py-1 text-xs cursor-pointer focus:outline-none"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.native}
          </option>
        ))}
      </select>
    </div>
  );
};

