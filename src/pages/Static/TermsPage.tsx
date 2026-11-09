import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the EVENTORA platform ("Eventora", "we", "us", or "our"), including purchasing tickets, registering as an organizer, or using our mobile scanner software, you agree to comply with and be bound by these Terms of Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Ticket Purchases & Entry</h2>
        <p>
          All tickets purchased through Eventora represent a revocable license to attend the specific event. Tickets are issued digitally with unique tamper-proof QR codes. Each ticket may only be checked in once at the event gate. Counterfeit, duplicated, or unauthorized resale of tickets is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Organizer Obligations</h2>
        <p>
          Organizers who create events on Eventora warrant that they possess all legal authorizations, permits, and venue agreements necessary to host the advertised event. Organizers must honor all validly issued Eventora tickets and maintain reasonable safety standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. Refunds and Cancellations</h2>
        <p>
          Event cancellation and refund policies are established by the respective event organizer and displayed on the event details page. In the event of a total cancellation by the organizer, Eventora facilitates refunds to the original payment method according to platform dispute guidelines.
        </p>
      </section>
    </div>
  );
};
