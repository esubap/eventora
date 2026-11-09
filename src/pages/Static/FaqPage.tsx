import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Ticketing & Booking',
    question: 'How do I receive my tickets after purchasing?',
    answer: 'Tickets are generated instantly upon verified payment confirmation. You can view your QR codes directly on your screen, download a high-resolution PDF ticket, or access them at any time in your Customer Dashboard under "My Tickets".'
  },
  {
    category: 'Ticketing & Booking',
    question: 'Can I transfer or share my ticket with a friend?',
    answer: 'Yes! You can either download the official PDF ticket and send it to your friend, or enter their name during checkout for individual tickets. The venue check-in system verifies each ticket once by its unique tamper-proof QR code.'
  },
  {
    category: 'Payments',
    question: 'What payment methods does Eventora support?',
    answer: 'We support instant local mobile payments via Telebirr, fintech processing through Chapa (CBE Birr, Awash Birr, Dashen Bank), and international Visa, Mastercard, and American Express cards.'
  },
  {
    category: 'Payments',
    question: 'Are payments secure?',
    answer: 'Yes. All checkout sessions are encrypted with industry-standard 256-bit SSL protocols. We never store raw credit card numbers or PINs on our servers, and payment confirmations are verified via secure cryptographic server-side callbacks.'
  },
  {
    category: 'For Organizers',
    question: 'How does the QR Code Ticket Scanner work at event entrances?',
    answer: 'Organizers can launch the built-in QR Scanner directly from the Organizer Dashboard on their smartphone, tablet, or laptop. Simply point the camera at attendee tickets for instant verification. If a ticket was already checked in, the system flags it as ALREADY USED, completely preventing duplicate or counterfeit entry.'
  },
  {
    category: 'For Organizers',
    question: 'How do organizers get paid for ticket sales?',
    answer: 'Revenue settles directly to your verified bank account or mobile wallet according to your agreed payout schedule. Real-time sales charts and exportable attendee lists are available in your Organizer Dashboard 24/7.'
  }
];

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          Everything You Need to Know
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Clear answers about ticket delivery, gate verification, organizer payouts, and security.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.question}</h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
