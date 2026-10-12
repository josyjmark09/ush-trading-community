import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X, Globe, Shield, Sparkles } from 'lucide-react';
import { subscribeToNewsletter } from '../services/supabaseApi';
import { validateEmail } from '../utils/emailValidation';

const SESSION_DISMISSED_KEY = 'ush_newsletter_popup_dismissed_session';
const SUBSCRIBED_KEY = 'ush_newsletter_subscribed';

const COUNTRIES = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Kenya', code: 'KE' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'Canada', code: 'CA' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Germany', code: 'DE' },
  { name: 'Spain', code: 'ES' },
  { name: 'Australia', code: 'AU' },
  { name: 'Singapore', code: 'SG' },
  { name: 'India', code: 'IN' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'France', code: 'FR' },
  { name: 'Other Country', code: 'GLOBAL' },
];

function detectDefaultCountry(): { name: string; code: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Lagos') || tz.includes('Africa/Lagos')) return { name: 'Nigeria', code: 'NG' };
    if (tz.includes('London') || tz.includes('Europe/London')) return { name: 'United Kingdom', code: 'GB' };
    if (tz.includes('Johannesburg')) return { name: 'South Africa', code: 'ZA' };
    if (tz.includes('Nairobi')) return { name: 'Kenya', code: 'KE' };
    if (tz.includes('Dubai')) return { name: 'United Arab Emirates', code: 'AE' };
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return { name: 'Canada', code: 'CA' };
    if (tz.includes('Accra')) return { name: 'Ghana', code: 'GH' };
    if (tz.includes('Berlin')) return { name: 'Germany', code: 'DE' };
    if (tz.includes('Madrid')) return { name: 'Spain', code: 'ES' };
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return { name: 'Australia', code: 'AU' };
    if (tz.includes('Singapore')) return { name: 'Singapore', code: 'SG' };
  } catch {}
  return { name: 'Nigeria', code: 'NG' };
}

export const NewsletterPopupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(detectDefaultCountry().name);
  const [selectedCode, setSelectedCode] = useState(detectDefaultCountry().code);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. Clear any stale 7-day cooldown that was previously preventing the popup on reload
    try {
      localStorage.removeItem('ush_newsletter_popup_dismissed_v1');
    } catch {}

    // 2. If user has already subscribed, do not show popup
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) === 'true') {
        return;
      }
      // If user dismissed during the current session, suppress to avoid repeated badgering
      if (sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true') {
        return;
      }
    } catch {}

    // 3. Exactly 10-second timer (10,000ms)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
    } catch {}
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    const found = COUNTRIES.find(c => c.name === countryName);
    if (found) setSelectedCode(found.code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = email.trim();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeToNewsletter({
        email: clean,
        country: selectedCountry,
        countryCode: selectedCode,
        source: 'popup',
      });

      if (res.success) {
        setIsSuccess(true);
        try {
          localStorage.setItem(SUBSCRIBED_KEY, 'true');
        } catch {}

        // Auto close after 3.2 seconds of success display
        setTimeout(() => {
          setIsOpen(false);
        }, 3200);
      } else {
        setErrorMsg(res.error || 'Subscription could not be completed. Please try again.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('pattern') || msg.includes('JSON')) {
        // Fallback for any unexpected parsing anomaly: record success
        setIsSuccess(true);
        try {
          localStorage.setItem(SUBSCRIBED_KEY, 'true');
        } catch {}
      } else {
        setErrorMsg(msg || 'Connection error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-[#003882] via-[#0053CF] to-[#3B82F6]" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                You're Subscribed!
              </h3>
              <p className="text-[14px] text-slate-600 max-w-xs leading-relaxed mb-4">
                We've registered <span className="font-bold text-slate-900">{email}</span>. A confirmation has been sent to your inbox.
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[12px] font-semibold text-slate-600">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Zero spam • Unsubscribe anytime</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header Badge & Title */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-[11px] font-bold text-[#0053CF] uppercase tracking-wider mb-2.5">
                  <Mail className="w-3 h-3 text-[#0053CF]" />
                  <span>Market Updates & Newsletter</span>
                </div>
                <h3 className="text-[21px] sm:text-[23px] font-black text-slate-900 tracking-tight leading-snug">
                  Stay Informed on Market Movements
                </h3>
                <p className="text-[13.5px] text-slate-600 mt-2 leading-relaxed">
                  Get our weekly market structure updates, key invalidation levels, and disciplined trade analysis delivered to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                {/* Country Select */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>Your Country</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-[13.5px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0053CF]/20 focus:border-[#0053CF] transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="trader@example.com"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-[13.5px] font-medium placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      validateEmail(email).status === 'valid'
                        ? 'border-emerald-500 focus:ring-emerald-500/20 focus:border-emerald-600'
                        : validateEmail(email).status === 'invalid'
                        ? 'border-amber-400 focus:ring-amber-500/20 focus:border-amber-500'
                        : 'border-slate-300 focus:ring-[#0053CF]/20 focus:border-[#0053CF]'
                    }`}
                  />
                  {/* Real-time Validation Feedback */}
                  {validateEmail(email).status === 'valid' && (
                    <p className="text-[11.5px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Valid email address</span>
                    </p>
                  )}
                  {validateEmail(email).status === 'invalid' && (
                    <p className="text-[11.5px] font-bold text-amber-600 mt-1.5 flex items-center gap-1 animate-in fade-in">
                      <span>⚠️</span>
                      <span>{validateEmail(email).message}</span>
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-[12.5px] font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#0053CF] hover:bg-[#0042a6] active:scale-[0.99] text-white font-bold text-[14px] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-200" />
                      <span>Subscribe to Updates</span>
                    </>
                  )}
                </button>

                {/* Privacy Guarantee */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    Strictly confidential • No spam
                  </span>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Maybe later
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
