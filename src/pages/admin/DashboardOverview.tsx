import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Tv,
  Images,
  Briefcase,
  Share2,
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
} from 'lucide-react';
import {
  usePrintMedia,
  useDigitalMedia,
  useBusinesses,
  useSocialProfiles,
} from '../../hooks/useCMSContent.ts';
import { useVisitorCounter } from '../../hooks/useVisitorCounter.ts';
import { checkMigrationStatus, runMigration, MigrationStatus } from '../../services/migrationService.ts';

export const DashboardOverview: React.FC = () => {
  const { data: printItems } = usePrintMedia(false);
  const { data: digitalItems } = useDigitalMedia(false);
  const { data: businessItems } = useBusinesses(false);
  const { data: socialItems } = useSocialProfiles(false);
  const { formattedCount: visitorCount } = useVisitorCounter();

  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({ completed: false });
  const [migrating, setMigrating] = useState(false);
  const [migrationNotice, setMigrationNotice] = useState<string | null>(null);

  useEffect(() => {
    checkMigrationStatus().then((status) => {
      setMigrationStatus(status);
    });
  }, []);

  const handleRunMigration = async (force: boolean = false) => {
    if (force && !window.confirm('Force re-seeding will write default data to Firestore. Proceed?')) {
      return;
    }

    setMigrating(true);
    setMigrationNotice(null);
    try {
      const res = await runMigration(force);
      setMigrationNotice(res.message);
      const updatedStatus = await checkMigrationStatus();
      setMigrationStatus(updatedStatus);
    } catch (err: any) {
      setMigrationNotice(`Migration failed: ${err.message}`);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111c2a] via-[#1a2c42] to-[#111c2a] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-[#2b3e56]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#b8863b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8863b]/20 text-[#ebd7ba] text-[11px] font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#b8863b]" />
            Dynamic Portfolio CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Welcome to the Deven Jha CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your personal portfolio website with live Firebase Firestore content sync and Cloudinary image asset hosting. All changes reflect on the live website immediately.
          </p>
        </div>
      </div>

      {/* Migration Alert Banner (if needed) */}
      {migrationNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{migrationNotice}</span>
          </div>
          <button
            onClick={() => setMigrationNotice(null)}
            className="text-xs font-semibold text-emerald-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-5 border border-[#e5decb] shadow-xs group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#a87932] transition-colors">
              Visitors
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#b8863b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a] tabular-nums">
            {visitorCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified Sessions</p>
        </div>

        <Link
          to="/admin/print-media"
          className="bg-white rounded-xl p-5 border border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#a87932] transition-colors">
              Print Media
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#b8863b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a]">
            {printItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Clippings &amp; Articles</p>
        </Link>

        <Link
          to="/admin/digital-media"
          className="bg-white rounded-xl p-5 border border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#a87932] transition-colors">
              Digital Media
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#b8863b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tv className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a]">
            {digitalItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Videos &amp; Broadcasts</p>
        </Link>

        <Link
          to="/admin/my-business"
          className="bg-white rounded-xl p-5 border border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#a87932] transition-colors">
              Businesses
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#b8863b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a]">
            {businessItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ventures &amp; Initiatives</p>
        </Link>

        <Link
          to="/admin/connect-me"
          className="bg-white rounded-xl p-5 border border-[#e5decb] shadow-xs hover:shadow-md hover:border-[#b8863b] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#a87932] transition-colors">
              Social Links
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#faf6ee] text-[#b8863b] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#111c2a]">
            {socialItems.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active Profiles</p>
        </Link>
      </div>

      {/* Two Column Grid: System Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Firestore Database & Migration Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5decb] shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#b8863b] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111c2a]">
                Firestore Database &amp; Content Seed
              </h3>
              <p className="text-[11px] text-slate-500">
                Automated one-time migration and sync status
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-[#faf7f2] rounded-xl border border-[#eee5d8] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Database Project:</span>
              <span className="font-mono font-semibold text-slate-800">
                portfolio-f52ae
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Seed Status:</span>
              {migrationStatus.completed ? (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Initialized
                </span>
              ) : (
                <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Pending Initial Seed
                </span>
              )}
            </div>
            {migrationStatus.migratedAt && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Last Migrated:</span>
                <span className="text-slate-700">
                  {new Date(migrationStatus.migratedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => handleRunMigration(false)}
              disabled={migrating || migrationStatus.completed}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8863b] hover:bg-[#a0742f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${migrating ? 'animate-spin' : ''}`} />
              <span>{migrating ? 'Migrating...' : 'Run Seed Migration'}</span>
            </button>

            <button
              onClick={() => handleRunMigration(true)}
              disabled={migrating}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
              title="Overwrites existing Firestore collections with initial default data"
            >
              <span>Force Re-Seed Defaults</span>
            </button>
          </div>
        </div>

        {/* Cloudinary Integration Card */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5decb] shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111c2a]">
                Cloudinary Media Storage
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct client-side unsigned upload configuration
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-[#f8fafc] rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Cloud Name:</span>
              <span className="font-mono font-semibold text-slate-800">vzyortxi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">API Key:</span>
              <span className="font-mono font-semibold text-slate-800">765291828458343</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Base Folder:</span>
              <span className="font-mono font-semibold text-slate-800">portfolio</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Upload Preset:</span>
              <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                portfolio_unsigned
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
            All images uploaded across Home, About, Print Media and Businesses are automatically organized into dedicated subfolders (`portfolio/home`, `portfolio/about`, `portfolio/print-media`, `portfolio/business-logos`).
          </p>
        </div>
      </div>

      {/* Quick Access Modules Grid */}
      <div>
        <h3 className="font-serif text-lg font-bold text-[#111c2a] mb-4">
          Manage Website Sections
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/home"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                Home Page CMS
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Edit hero headline, portrait, bio excerpt &amp; impact numbers
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/about"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                About Us CMS
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage personal biography, journey timeline &amp; mission/vision
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/print-media"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                Print Media Clippings
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Upload newspaper clippings to Cloudinary with publication details
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/digital-media"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                Digital Media &amp; Videos
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add YouTube broadcast interviews &amp; video documentaries
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/media"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                Media &amp; Gallery CMS
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage all 6 gallery subcategories with category bulk uploads
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/my-business"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                My Business Ventures
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Add entrepreneurial ventures, company logos &amp; links
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>

          <Link
            to="/admin/contact-details"
            className="p-5 bg-white rounded-xl border border-[#e5decb] hover:border-[#b8863b] shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div>
              <h4 className="font-bold text-sm text-[#111c2a] group-hover:text-[#a87932] transition-colors">
                Contact Details &amp; Map
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Update phone, email, WhatsApp, address &amp; Google Map
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#b8863b] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

