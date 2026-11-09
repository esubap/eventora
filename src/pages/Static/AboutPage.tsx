import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Sparkles, ShieldCheck, Globe, Users, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>About Eventora</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
          Powering the World’s Most Electrifying Live Experiences
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          EVENTORA was founded with a single mission: to eliminate ticket scalping, empower visionary event organizers, and deliver seamless digital ticketing to attendees across Africa and the world.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Fraud Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every ticket generated on Eventora contains a tamper-proof cryptographic token, verified in real-time at the venue gates.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Local & Global Payments</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seamless integration with Telebirr, Chapa, CBE Birr, and international cards, making events truly accessible.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Creator First Tools</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From flexible multi-tier pricing to instant mobile camera QR check-ins and payout tracking, we arm organizers with superpowers.
          </p>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900 to-slate-950 border border-purple-500/30 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">150,000+</span>
          <span className="text-xs text-purple-300 mt-1 block">Tickets Issued</span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">850+</span>
          <span className="text-xs text-purple-300 mt-1 block">Events Hosted</span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">99.98%</span>
          <span className="text-xs text-purple-300 mt-1 block">Gate Uptime</span>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono block">4.9 / 5</span>
          <span className="text-xs text-purple-300 mt-1 block">Attendee Rating</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-2xl font-bold text-white">Ready to Host Your Next Event?</h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/register?role=organizer"
            className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <span>Get Started as Organizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
