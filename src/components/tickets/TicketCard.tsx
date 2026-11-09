import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Ticket as TicketType, Event } from '../../types';
import { formatDate, formatTime } from '../../lib/utils';
import { Calendar, MapPin, User, Download, Printer, ShieldCheck, TicketIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';

interface TicketCardProps {
  ticket: TicketType;
  event?: Event;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, event: propEvent }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const event = propEvent || ticket.event;
  if (!event) return null;

  const handleDownloadPdf = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    toast.info('Generating high-resolution PDF ticket...', 'PDF Engine');

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0F172A'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });

      const imgWidth = 148;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save(`EVENTORA-${ticket.ticket_number}.pdf`);
      toast.success('Ticket downloaded successfully!', 'Ready for Event');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again or print directly.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    ticket_id: ticket.id,
    ticket_number: ticket.ticket_number,
    qr_token: ticket.qr_token,
    event_id: ticket.event_id
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Printable Ticket Container */}
      <div
        ref={ticketRef}
        className="relative rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 p-6 sm:p-8"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-dashed border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <TicketIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-extrabold tracking-wider text-white">EVENTORA</span>
              <span className="block text-[9px] uppercase tracking-widest text-purple-400">OFFICIAL E-TICKET</span>
            </div>
          </div>

          <div className="text-right">
            <Badge
              variant={ticket.status === 'checked_in' ? 'warning' : 'success'}
              size="sm"
            >
              {ticket.status === 'checked_in' ? 'CHECKED IN' : 'VALID ENTRY'}
            </Badge>
          </div>
        </div>

        {/* Main Ticket Body */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Left Column: Event & Attendee Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                {ticket.ticket_type?.name || 'Standard Pass'}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight mt-0.5">
                {event.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date & Time</span>
                <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  {formatDate(event.start_date)}
                </span>
                <span className="text-slate-400 text-[11px] block">{formatTime(event.start_time)}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Location</span>
                <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {event.venue_name || event.city}
                </span>
                <span className="text-slate-400 text-[11px] block">{event.city}, {event.country}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Attendee</span>
                <span className="font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  {ticket.attendee_name}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Ticket Number</span>
                <span className="font-mono font-bold text-purple-300 mt-0.5 block">
                  {ticket.ticket_number}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: QR Code Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-900 border border-slate-200">
            <QRCodeSVG
              value={ticket.qr_token}
              size={140}
              level="H"
              includeMargin={false}
              className="rounded"
            />
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-2 tracking-wider">
              SCAN AT VENUE
            </span>
            <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-semibold mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Tamper-Proof Token</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-dashed border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Booking ID: <strong className="text-slate-300 font-mono">{ticket.booking_id}</strong></span>
          <span>Please present this digital or printed ticket with photo ID at entrance</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>

        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Generating PDF...' : 'Download PDF Ticket'}</span>
        </button>
      </div>
    </div>
  );
};
