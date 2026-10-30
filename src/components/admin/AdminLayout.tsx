import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Home,
  User,
  Newspaper,
  Tv,
  Share2,
  Briefcase,
  PhoneCall,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    name: 'Home Page',
    path: '/admin/home',
    icon: <Home className="w-4 h-4" />,
  },
  {
    name: 'About Us',
    path: '/admin/about',
    icon: <User className="w-4 h-4" />,
  },
  {
    name: 'Print Media',
    path: '/admin/print-media',
    icon: <Newspaper className="w-4 h-4" />,
  },
  {
    name: 'Digital Media',
    path: '/admin/digital-media',
    icon: <Tv className="w-4 h-4" />,
  },
  {
    name: 'Connect Me',
    path: '/admin/connect-me',
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    name: 'My Business',
    path: '/admin/my-business',
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    name: 'Contact Details',
    path: '/admin/contact-details',
    icon: <PhoneCall className="w-4 h-4" />,
  },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the Admin CMS?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#111c2a] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#22354c] z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#b8863b] flex items-center justify-center font-bold text-xs text-white">
            DJ
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">
            Deven Jha CMS
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-[#182739] text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#111c2a] text-white flex flex-col justify-between border-r border-[#22354c] z-40 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="p-5 border-b border-[#22354c] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b8863b] to-[#8f6424] flex items-center justify-center shadow-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-sm font-bold tracking-wide text-white">
                  Deven Jha
                </h2>
                <p className="text-[10px] text-[#b8863b] font-medium tracking-wider uppercase">
                  Content Management
                </p>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-[#b8863b] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-[#182739] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-[#a87932] group-hover:text-white'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-[#22354c] bg-[#0c141f]">
          <div className="flex items-center justify-between mb-3">
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-white truncate">
                {user?.email || 'Administrator'}
              </p>
              <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                Authorized Admin
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Open Public Website"
              className="p-1.5 rounded-md bg-[#182739] text-[#b8863b] hover:text-white hover:bg-[#b8863b] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="hidden md:flex bg-white border-b border-[#e5decb] px-8 py-3.5 items-center justify-between shadow-xs sticky top-0 z-20">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#a87932] uppercase">
              Admin Portal
            </span>
            <h1 className="text-base font-bold text-[#111c2a]">
              Content Management &amp; Publishing
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f2ece0] text-[#111c2a] border border-[#ded4c3] rounded-lg text-xs font-semibold transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#a87932]" />
            </a>

            <div className="h-4 w-px bg-slate-200" />

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Signed in as</span>
              <span className="text-xs font-bold text-[#111c2a]">
                {user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

