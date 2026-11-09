import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
        <p>
          We collect personal information necessary to deliver tickets, verify gate admissions, and process secure payments. This includes your name, email address, phone number, and purchase transaction records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Use of Information</h2>
        <p>
          Your information is used solely to issue official digital tickets, send booking confirmation emails and SMS notifications, enable organizer check-in verification, and protect against fraudulent duplicate ticket presentations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. Data Security & Storage</h2>
        <p>
          All data is encrypted in transit using TLS 1.3 and stored in secure PostgreSQL database infrastructure with strict Row-Level Security (RLS) policies. Payment transactions are processed directly by certified gateway providers (Telebirr, Chapa, Stripe) and payment card details are never stored on our servers.
        </p>
      </section>
    </div>
  );
};
