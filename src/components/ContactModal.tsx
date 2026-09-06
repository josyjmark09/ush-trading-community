import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Globe, 
  Send, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink 
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { openTelegram } from '../utils/telegramLink';
import ushLogoPng from './ush logo.png';
import logoSvg from './image 1.svg';

interface ContactModalProps {
  isOpen: boolean;
  type: 'contact' | 'disclaimer';
  onClose: () => void;
}

type ContactView = 'menu' | 'email' | 'web';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, type, onClose }) => {
  const { addInboxMessage, settings } = useSite();
  const [view, setView] = useState<ContactView>('menu');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [webSubmitted, setWebSubmitted] = useState(false);

  // Email form state
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  // Web form state
  const [webFormData, setWebFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  const [lastEmailPayload, setLastEmailPayload] = useState<{
    gmailUrl: string;
    mailtoUrl: string;
  } | null>(null);

  // Reset view when opened or type changes
  useEffect(() => {
    if (isOpen) {
      setView('menu');
      setEmailSubmitted(false);
      setWebSubmitted(false);
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const targetEmail = settings.social?.supportEmail || 'ushforex@gmail.com';
  const rawSupportTg = settings.social?.supportTelegram;
  const telegramSupportUrl = 
    rawSupportTg && 
    rawSupportTg !== 'https://t.me/+wHFuFFkA2i0xZTA8' && 
    !rawSupportTg.includes('+wHFuFFkA2i0xZTA8')
      ? rawSupportTg 
      : 'https://t.me/USHFX';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTelegramOption = (e?: React.MouseEvent) => {
    openTelegram(telegramSupportUrl, e);
  };

  // Submit for Email Option
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailFormData.name.trim() || !emailFormData.email.trim() || !emailFormData.message.trim()) return;

    // Log to admin inbox as well for traceability
    addInboxMessage({
      name: emailFormData.name.trim(),
      email: emailFormData.email.trim(),
      topic: `[Email Desk] ${emailFormData.topic}`,
      message: emailFormData.message.trim(),
      source: 'contact_form',
    });

    const subject = `[Support Inquiry] ${emailFormData.topic} - from ${emailFormData.name.trim()}`;
    const body = 
`==============================================
USH CUSTOMER CARE INQUIRY
==============================================

CUSTOMER DETAILS
• Name: ${emailFormData.name.trim()}
• Email: ${emailFormData.email.trim()}
• Date & Time: ${new Date().toLocaleString()}

TOPIC
• ${emailFormData.topic}

MESSAGE
${emailFormData.message.trim()}

==============================================
Delivered via USH Community of Traders Support Desk
Target: ${targetEmail}
==============================================`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;

    setLastEmailPayload({ gmailUrl, mailtoUrl });

    // Open user's default email client pre-addressed to ushforex@gmail.com
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Handled by UI buttons if browser blocks popup
    }

    setEmailSubmitted(true);
  };

  // Submit for Web Option (Saves directly to website admin inbox)
  const handleWebSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webFormData.name.trim() || !webFormData.email.trim() || !webFormData.message.trim()) return;

    // Save directly to Admin Inbox for the admin to see on the website
    addInboxMessage({
      name: webFormData.name.trim(),
      email: webFormData.email.trim(),
      topic: webFormData.topic,
      message: webFormData.message.trim(),
      source: 'contact_form',
    });

    setWebSubmitted(true);
  };

  const resetAllForms = () => {
    setEmailSubmitted(false);
    setWebSubmitted(false);
    setEmailFormData({
      name: '',
      email: '',
      topic: 'General Inquiry',
      message: '',
    });
    setWebFormData({
      name: '',
      email: '',
      topic: 'General Inquiry',
      message: '',
    });
    setView('menu');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-soft-fade">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'contact' ? (
          <div>
            {/* Header: USH Customer Care */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
              <div className="h-10 w-auto max-w-[100px] flex items-center justify-center shrink-0">
                <img 
                  src={settings.branding?.logoUrl || ushLogoPng || logoSvg} 
                  alt="USH Logo" 
                  className="h-9 w-auto max-h-9 object-contain shrink-0" 
                />
              </div>

              <div className="min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-manrope text-[17px] sm:text-[18px] font-black text-slate-900 leading-tight">
                    USH Customer Care
                  </h3>
                  <span className="bg-blue-50 text-[#0053CF] border border-blue-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="font-inter text-[11px] sm:text-[12px] text-slate-500 truncate">
                  USH Community of Traders direct support & inquiries desk
                </p>
              </div>
            </div>

            {/* 1. MAIN MENU VIEW (Matching Image 1 & 2) */}
            {view === 'menu' && (
              <div className="animate-soft-fade">
                {/* Title & Description */}
                <div className="text-center my-5">
                  <h2 className="font-manrope text-[24px] sm:text-[26px] font-black text-slate-900 leading-tight mb-1.5">
                    Get in Touch
                  </h2>
                  <p className="font-inter text-[13px] sm:text-[13.5px] text-slate-600 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                    We are here to help. Choose your preferred way to contact our support team.
                  </p>
                </div>

                {/* 3 Contact Options */}
                <div className="space-y-3 mb-6">
                  {/* Option 1: Telegram */}
                  <a
                    href={telegramSupportUrl}
                    onClick={handleTelegramOption}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-[#0088cc] hover:bg-slate-50/70 transition-all text-left group cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 fill-current translate-x-[-1px] translate-y-[1px]" viewBox="0 0 24 24">
                          <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.459 0 .661-.21.917-.457l2.199-2.138 4.574 3.38c.843.465 1.45.226 1.66-.782l2.998-14.122c.307-1.233-.473-1.794-1.44-.922z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-manrope text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 group-hover:text-[#0088cc] transition-colors leading-snug">
                          Contact us on Telegram
                        </div>
                        <div className="font-inter text-[12px] sm:text-[12.5px] text-slate-500">
                          Instant reply
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </a>

                  {/* Option 2: Email */}
                  <button
                    type="button"
                    onClick={() => setView('email')}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-[#0053CF] hover:bg-slate-50/70 transition-all text-left group cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0053CF] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-manrope text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 group-hover:text-[#0053CF] transition-colors leading-snug">
                          Contact us on Email
                        </div>
                        <div className="font-inter text-[12px] sm:text-[12.5px] text-slate-500 truncate">
                          {targetEmail}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>

                  {/* Option 3: Web */}
                  <button
                    type="button"
                    onClick={() => setView('web')}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-[#0053CF] hover:bg-slate-50/70 transition-all text-left group cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0053CF] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-manrope text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 group-hover:text-[#0053CF] transition-colors leading-snug">
                          Contact on Web
                        </div>
                        <div className="font-inter text-[12px] sm:text-[12.5px] text-slate-500">
                          Send us a message through our website
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                </div>

                {/* Footer Shield Banner */}
                <div className="bg-[#f0f6ff] border border-blue-100 rounded-xl p-3 flex items-center justify-center gap-2.5 text-center">
                  <ShieldCheck className="w-4 h-4 text-[#0053CF] shrink-0" />
                  <div>
                    <div className="font-manrope text-[12px] font-bold text-slate-900 leading-tight">
                      Official USH Customer Care
                    </div>
                    <div className="font-inter text-[11px] text-slate-500 leading-tight">
                      Safe • Secure • Reliable Support
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. EMAIL SUBVIEW: Send Message to Support Email */}
            {view === 'email' && (
              <div className="pt-3 animate-soft-fade">
                <button
                  type="button"
                  onClick={() => { setView('menu'); setEmailSubmitted(false); }}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-slate-500 hover:text-slate-900 mb-3 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to options</span>
                </button>

                <div className="mb-3">
                  <h4 className="font-manrope text-[18px] font-black text-slate-900">
                    Contact us on Email
                  </h4>
                  <p className="font-inter text-[12px] text-slate-500">
                    Compose a message to appear on our support desk email.
                  </p>
                </div>

                {/* Target email bar with 1-click copy */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block leading-none mb-1">
                      Support Email
                    </span>
                    <span className="font-mono text-[12.5px] sm:text-[13px] font-bold text-[#0053CF] select-all truncate block">
                      {targetEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="py-1 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {emailSubmitted ? (
                  <div className="py-6 space-y-4 text-center animate-soft-fade">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-manrope text-[18px] font-black text-slate-900">
                        Ready for Email Dispatch
                      </h4>
                      <p className="font-inter text-[12.5px] text-slate-600 max-w-xs mx-auto leading-relaxed">
                        Your mail client has been opened to dispatch your message to <strong>{targetEmail}</strong>.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      {lastEmailPayload?.gmailUrl && (
                        <a
                          href={lastEmailPayload.gmailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-xl font-inter text-[13px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Send via Gmail Web</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => { setView('menu'); setEmailSubmitted(false); }}
                        className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-inter text-[12.5px] font-bold transition-colors cursor-pointer"
                      >
                        Back to Options
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={emailFormData.name}
                        onChange={(e) => setEmailFormData({ ...emailFormData, name: e.target.value })}
                        placeholder="e.g., Alex Vance"
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-1.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailFormData.email}
                        onChange={(e) => setEmailFormData({ ...emailFormData, email: e.target.value })}
                        placeholder="trader@example.com"
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-1.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={emailFormData.topic}
                        onChange={(e) => setEmailFormData({ ...emailFormData, topic: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-2.5 py-1.5 text-[13px] text-slate-900 outline-hidden font-inter"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Broker Partnership & Exness Setup">Broker Partnership & Exness Setup</option>
                        <option value="Telegram Community Access">Telegram Community Access</option>
                        <option value="Trading Education & Mentorship">Trading Education & Mentorship</option>
                        <option value="Technical or Website Feedback">Technical or Website Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={emailFormData.message}
                        onChange={(e) => setEmailFormData({ ...emailFormData, message: e.target.value })}
                        placeholder="Write the message you'd like to send to support..."
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-2 text-[13px] text-slate-900 outline-hidden font-inter resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 rounded-xl font-inter text-[13.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99] mt-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send to Support Email</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. WEB SUBVIEW: Send Message to Website Admin Desk */}
            {view === 'web' && (
              <div className="pt-3 animate-soft-fade">
                <button
                  type="button"
                  onClick={() => { setView('menu'); setWebSubmitted(false); }}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-slate-500 hover:text-slate-900 mb-3 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to options</span>
                </button>

                <div className="mb-3.5">
                  <h4 className="font-manrope text-[18px] font-black text-slate-900">
                    Contact on Web
                  </h4>
                  <p className="font-inter text-[12px] text-slate-500">
                    Send a message directly through our website to the admin desk.
                  </p>
                </div>

                {webSubmitted ? (
                  <div className="py-6 space-y-4 text-center animate-soft-fade">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-manrope text-[18px] font-black text-slate-900">
                        Message Sent to Admin Desk
                      </h4>
                      <p className="font-inter text-[12.5px] text-slate-600 max-w-xs mx-auto leading-relaxed">
                        Your message has been delivered to our website admin desk. Our team will review your inquiry and reply to your email shortly.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={resetAllForms}
                        className="w-full py-2.5 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-xl font-inter text-[13px] font-bold transition-colors cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-inter text-[12.5px] font-bold transition-colors cursor-pointer"
                      >
                        Done / Close Window
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWebSubmit} className="space-y-3">
                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={webFormData.name}
                        onChange={(e) => setWebFormData({ ...webFormData, name: e.target.value })}
                        placeholder="e.g., Alex Vance"
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-1.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={webFormData.email}
                        onChange={(e) => setWebFormData({ ...webFormData, email: e.target.value })}
                        placeholder="trader@example.com"
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-1.5 text-[13.5px] text-slate-900 outline-hidden font-inter"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={webFormData.topic}
                        onChange={(e) => setWebFormData({ ...webFormData, topic: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-2.5 py-1.5 text-[13px] text-slate-900 outline-hidden font-inter"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Broker Partnership & Exness Setup">Broker Partnership & Exness Setup</option>
                        <option value="Telegram Community Access">Telegram Community Access</option>
                        <option value="Trading Education & Mentorship">Trading Education & Mentorship</option>
                        <option value="Technical or Website Feedback">Technical or Website Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-inter text-[11.5px] font-bold text-slate-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={webFormData.message}
                        onChange={(e) => setWebFormData({ ...webFormData, message: e.target.value })}
                        placeholder="Write your message here..."
                        className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-2 text-[13px] text-slate-900 outline-hidden font-inter resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 rounded-xl font-inter text-[13.5px] font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99] mt-1"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit to Website Desk</span>
                    </button>
                    <p className="text-center font-inter text-[10.5px] text-slate-400">
                      Delivers directly to the website admin desk inbox
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Legal Disclaimer View */
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-[#BA1A1A]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope text-[19px] font-black text-slate-900">Risk & Legal Disclosure</h3>
                <p className="font-inter text-[13px] text-slate-600">Regulatory & Policy Statements</p>
              </div>
            </div>

            <div className="space-y-2.5 font-inter text-[13px] text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-300">
              <p>
                <strong className="text-slate-900">1. High-Risk Investment:</strong> Foreign exchange and CFD trading carries a significant level of risk to your capital. You should not invest money that you cannot afford to lose.
              </p>
              <p>
                <strong className="text-slate-900">2. Educational Purpose:</strong> All market analyses, chart setups, and commentary provided by USH Community of Traders are for educational purposes only and do not constitute financial or investment advice.
              </p>
              <p>
                <strong className="text-slate-900">3. Regulatory Separation:</strong> USH Community of Traders is an independent educational publisher and community platform. Brokerage services are provided directly by regulated third parties such as Exness.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-inter text-[14px] font-bold transition-colors cursor-pointer"
            >
              I Understand
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
