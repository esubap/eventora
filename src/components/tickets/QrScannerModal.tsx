import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Modal } from '../common/Modal';
import { ticketService, VerifyTicketResult } from '../../services/ticketService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Camera, CheckCircle2, AlertTriangle, XCircle, Search, RefreshCw, User, Calendar, Tag } from 'lucide-react';
import { Badge } from '../common/Badge';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string; // Optional: restrict check-ins to this specific event
  onCheckInSuccess?: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onCheckInSuccess
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const [scanResult, setScanResult] = useState<VerifyTicketResult | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Initialize Camera Scanner when Modal Opens
  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
      setScanResult(null);
      setScannerActive(false);
      return;
    }

    setScannerActive(true);

    const timer = setTimeout(() => {
      const element = document.getElementById('qr-reader');
      if (element && !scannerRef.current) {
        try {
          const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { 
              fps: 10, 
              qrbox: { width: 240, height: 240 },
              rememberLastUsedCamera: true
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              handleVerification(decodedText);
            },
            (error) => {
              // Ignore standard frame scanning noise
            }
          );

          scannerRef.current = scanner;
        } catch (err) {
          console.warn('Camera scanner initialization notice:', err);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleVerification = async (codeToVerify: string) => {
    if (!user || isVerifying) return;
    setIsVerifying(true);

    try {
      const result = await ticketService.verifyAndCheckIn(codeToVerify, user, eventId);
      setScanResult(result);

      if (result.status === 'VALID') {
        toast.success(result.message, 'Entry Approved');
        if (onCheckInSuccess) onCheckInSuccess();
      } else if (result.status === 'ALREADY_USED') {
        toast.warning(result.message, 'Duplicate Entry Detected');
      } else {
        toast.error(result.message, 'Verification Failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error verifying ticket');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleVerification(manualCode.trim());
      setManualCode('');
    }
  };

  const handleResetScanner = () => {
    setScanResult(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Live QR Ticket Scanner & Gate Verification" maxWidth="lg">
      <div className="space-y-6">
        
        {/* Verification Result Banner (Instant visual feedback) */}
        {scanResult && (
          <div
            className={`p-5 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
              scanResult.status === 'VALID'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : scanResult.status === 'ALREADY_USED'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {scanResult.status === 'VALID' && <CheckCircle2 className="w-7 h-7 text-emerald-400" />}
                {scanResult.status === 'ALREADY_USED' && <AlertTriangle className="w-7 h-7 text-amber-400" />}
                {scanResult.status !== 'VALID' && scanResult.status !== 'ALREADY_USED' && (
                  <XCircle className="w-7 h-7 text-rose-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {scanResult.status === 'VALID' ? 'ENTRY APPROVED' : scanResult.status}
                  </h4>
                  <Badge
                    variant={scanResult.status === 'VALID' ? 'success' : scanResult.status === 'ALREADY_USED' ? 'warning' : 'error'}
                    size="sm"
                  >
                    {scanResult.status}
                  </Badge>
                </div>

                <p className="text-xs mt-1 text-slate-300 leading-relaxed font-medium">
                  {scanResult.message}
                </p>

                {/* Scanned Attendee Card */}
                {scanResult.ticket && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendee</span>
                      <span className="font-semibold text-white flex items-center gap-1">
                        <User className="w-3 h-3 text-purple-400" />
                        {scanResult.ticket.attendee_name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Number</span>
                      <span className="font-mono text-purple-300 font-bold">
                        {scanResult.ticket.ticket_number}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleResetScanner}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Scan Next Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Camera View Box */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-hidden relative min-h-[280px] flex flex-col items-center justify-center">
          <div id="qr-reader" className="w-full max-w-sm overflow-hidden text-slate-300 text-xs text-center" />
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Camera className="w-4 h-4 text-purple-400" />
            <span>Point camera steadily at attendee's digital or printed QR code</span>
          </div>
        </div>

        {/* Manual QR Token or Ticket Number Entry */}
        <div className="border-t border-slate-800 pt-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Manual Ticket / QR Token Lookup
          </label>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. TKT-89AF20C1-01 or paste qr_token hash..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              type="submit"
              disabled={isVerifying || !manualCode.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isVerifying ? 'Checking...' : 'Check In'}</span>
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
