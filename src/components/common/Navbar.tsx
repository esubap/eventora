import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { storage } from '../../lib/storage';
import { Notification, UserRole } from '../../types';
import {
  Ticket,
  Calendar,
  Search,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Shield,
  LayoutDashboard,
  CheckCircle,
  Compass,
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, isAuthenticated, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setRoleMenuOpen(false);
  }, [location.pathname]);

  // Load notifications for current user
  useEffect(() => {
    if (user?.id) {
      setNotifications(storage.getNotifications(user.id));
    } else {
      setNotifications([]);
    }

    const handleNotifUpdate = () => {
      if (user?.id) setNotifications(storage.getNotifications(user.id));
    };

    window.addEventListener('eventora:notifs-updated', handleNotifUpdate);
    return () => window.removeEventListener('eventora:notifs-updated', handleNotifUpdate);
  }, [user?.id]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'organizer') return '/dashboard/organizer';
    return '/dashboard/customer';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-400 p-[2px] shadow-lg shadow-purple-600/30 group-hover:shadow-purple-600/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Ticket className="w-5 h-5 text-purple-400 transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white font-display flex items-center gap-1.5">
                EVENTORA
                <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400/90 -mt-1">
                TICKETS & EXPERIENCES
              </span>
            </div>
          </Link>

          {/* 2. SEARCH BAR (DESKTOP) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concerts, tech, summits..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </form>

          {/* 3. NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link 
              to="/events" 
              className={`hover:text-white transition-colors flex items-center gap-1.5 ${location.pathname === '/events' ? 'text-purple-400 font-semibold' : ''}`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events</span>
            </Link>
            
            <Link 
              to="/about" 
              className={`hover:text-white transition-colors ${location.pathname === '/about' ? 'text-purple-400 font-semibold' : ''}`}
            >
              About
            </Link>

            <Link 
              to="/contact" 
              className={`hover:text-white transition-colors ${location.pathname === '/contact' ? 'text-purple-400 font-semibold' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* 4. ACTIONS & USER CONTROLS */}
          <div className="flex items-center gap-3">

            {/* Quick Persona / Demo Role Switcher (Crucial for Reviewers & Seamless Testing) */}
            <div className="relative hidden sm:block" ref={roleDropdownRef}>
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-colors"
                title="Switch demo persona for instant testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="capitalize">{role ? `${role}` : 'Demo Role'}</span>
                <ChevronDown className="w-3 h-3 text-purple-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700/70 shadow-2xl p-2 z-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Switch Active Persona:
                  </div>
                  <button
                    onClick={() => { switchDemoRole('customer'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${role === 'customer' ? 'text-purple-400 font-bold bg-slate-800/60' : 'text-slate-300'}`}
                  >
                    <span>Customer (Abebe)</span>
                    {role === 'customer' && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('organizer'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${role === 'organizer' ? 'text-purple-400 font-bold bg-slate-800/60' : 'text-slate-300'}`}
                  >
                    <span>Organizer (Selam)</span>
                    {role === 'organizer' && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setRoleMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between hover:bg-slate-800 transition-colors ${role === 'admin' ? 'text-purple-400 font-bold bg-slate-800/60' : 'text-slate-300'}`}
                  >
                    <span>Admin (Executive)</span>
                    {role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Notifications</span>
                      <span className="text-[11px] text-purple-400 font-medium">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              storage.markNotificationRead(n.id);
                              if (n.link) navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-xl text-left cursor-pointer transition-colors ${
                              n.is_read ? 'bg-slate-950/40 hover:bg-slate-800/50' : 'bg-purple-950/30 border border-purple-500/20 hover:bg-purple-900/30'
                            }`}
                          >
                            <h5 className="text-xs font-semibold text-white">{n.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[9px] text-slate-500 mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create Event CTA (Organizers or Unauthenticated) */}
            <Link
              to={isAuthenticated ? (role === 'organizer' ? '/dashboard/organizer/events/new' : '/dashboard/organizer') : '/register?role=organizer'}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </Link>

            {/* USER AVATAR / PROFILE DROPDOWN */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.full_name)}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
                  />
                  <span className="hidden md:block text-xs font-medium text-slate-200 max-w-[100px] truncate">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                        <span>My Dashboard</span>
                      </Link>

                      {role === 'customer' && (
                        <Link
                          to="/dashboard/customer"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Ticket className="w-3.5 h-3.5 text-sky-400" />
                          <span>My Tickets</span>
                        </Link>
                      )}

                      {role === 'organizer' && (
                        <Link
                          to="/dashboard/organizer/check-in"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>QR Ticket Scanner</span>
                        </Link>
                      )}

                      {role === 'admin' && (
                        <Link
                          to="/dashboard/admin"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-rose-400" />
                          <span>Admin Portal</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, cities, artists..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </form>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/events"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg"
            >
              Explore All Events
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg"
            >
              About Eventora
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 rounded-lg"
            >
              Contact Support
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="px-3 py-2 text-sm font-semibold text-purple-400 hover:bg-purple-950/30 rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to {role?.toUpperCase()} Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-left px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
