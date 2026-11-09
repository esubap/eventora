import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Send, ShieldCheck, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to Eventora Insiders!', 'Subscription Confirmed');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-24">
      {/* Newsletter Bar */}
      <div className="border-b border-slate-900/80 bg-gradient-to-b from-slate-950 to-slate-900/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span>Stay Ahead of the Hype</span>
              <span className="text-purple-400">⚡</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md">
              Receive exclusive early-bird drops, private concert invites, and tech summit discounts delivered directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-sky-400 p-[2px]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Ticket className="w-4 h-4 text-purple-400 transform -rotate-12" />
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-wider text-white font-display">
              EVENTORA
            </span>
          </Link>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            The next-generation live events and ticket booking platform. Connecting attendees, creators, and organizers with instant QR tickets, anti-fraud verification, and flexible multi-currency payments.
          </p>

          <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Bole Subcity, Africa Avenue, Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>contact@eventora.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+251 11 667 8900</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Event Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/events?category=music-concerts" className="hover:text-purple-400 transition-colors">Music & Concerts</Link></li>
            <li><Link to="/events?category=technology" className="hover:text-purple-400 transition-colors">Technology & Startups</Link></li>
            <li><Link to="/events?category=business" className="hover:text-purple-400 transition-colors">Business & Conferences</Link></li>
            <li><Link to="/events?category=sports" className="hover:text-purple-400 transition-colors">Sports & Marathons</Link></li>
            <li><Link to="/events?category=festivals" className="hover:text-purple-400 transition-colors">Festivals & Culture</Link></li>
            <li><Link to="/events?category=education" className="hover:text-purple-400 transition-colors">Education & Masterclasses</Link></li>
          </ul>
        </div>

        {/* For Organizers & Customers */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/events" className="hover:text-purple-400 transition-colors">Browse All Events</Link></li>
            <li><Link to="/dashboard/organizer" className="hover:text-purple-400 transition-colors">Organizer Hub</Link></li>
            <li><Link to="/dashboard/organizer/events/new" className="hover:text-purple-400 transition-colors">Host an Event</Link></li>
            <li><Link to="/dashboard/organizer/check-in" className="hover:text-purple-400 transition-colors">QR Scanner Tool</Link></li>
            <li><Link to="/about" className="hover:text-purple-400 transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="hover:text-purple-400 transition-colors">Help & FAQ</Link></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Security & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            <li><span className="text-emerald-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted</span></li>
            <li><span className="text-slate-400">Anti-Scalp QR Verification</span></li>
            <li><span className="text-slate-400">Guaranteed Genuine Tickets</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EVENTORA Inc. All rights reserved. Built for global scale.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Supported Gateways:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-sky-400 font-semibold border border-slate-800 text-[10px]">
              Telebirr
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-purple-400 font-semibold border border-slate-800 text-[10px]">
              Chapa
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-semibold border border-slate-800 text-[10px]">
              Stripe / Visa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
