import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';

export const OtpVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOtp, isLoading } = useAuth();
  const toast = useToast();

  const email = searchParams.get('email') || '';

  // 6 digit code inputs
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for Resend (60s)
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [demoCodeHint, setDemoCodeHint] = useState<string>('123456');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Focus first box
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1); // Only take latest char
    if (char && !/^\d+$/.test(char)) return; // Only numbers

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance focus to next box
    if (char && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const chars = pasted.split('');
      setDigits(chars);
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = digits.join('');
    if (token.length !== 6) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      await verifyOtp(email, token);
      navigate('/');
    } catch (err) {
      // Handled in AuthContext
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const res = await authService.sendEmailOtp(email);
      setCountdown(60);
      setCanResend(false);
      if (res.demoCode) setDemoCodeHint(res.demoCode);
      toast.success(`A new verification code has been dispatched to ${email}`, 'Code Resent');
    } catch (err: any) {
      toast.error('Failed to resend verification code');
    }
  };

  const handleQuickFillCode = () => {
    const chars = demoCodeHint.split('');
    setDigits(chars);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-950/40">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Verify Your Email</h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We sent a 6-digit activation code to <strong className="text-purple-300">{email || 'your email'}</strong>. Enter the code below to complete registration.
          </p>
        </div>

        {/* Verification Card */}
        <form onSubmit={handleVerify} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          
          {/* 6 Digit Inputs */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3 text-center">
              Enter 6-Digit Code
            </label>

            <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 text-center text-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Quick Demo Helper */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Demo test code: <strong className="text-white font-mono">{demoCodeHint}</strong></span>
            <button
              type="button"
              onClick={handleQuickFillCode}
              className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold hover:bg-purple-900 transition-colors"
            >
              Auto-Fill
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length !== 6}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Code...' : 'Verify & Activate Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Resend Timer */}
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Verification Code</span>
              </button>
            ) : (
              <span>Resend another code in <strong className="text-slate-200">{countdown}s</strong></span>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-slate-400">
          Entered the wrong email?{' '}
          <Link to="/register" className="text-purple-400 font-semibold hover:underline">
            Go Back & Change
          </Link>
        </p>

      </div>
    </div>
  );
};
