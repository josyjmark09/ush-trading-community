import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertTriangle, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import ushLogoPng from './ush logo.png';
import logoSvg from './image 1.svg';

interface ContactModalProps {
  isOpen: boolean;
  type: 'contact' | 'disclaimer';
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, type, onClose }) => {
  const { addInboxMessage, settings } = useSite();
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lastPayload, setLastPayload] = useState<{
    name: string;
    email: string;
    topic: string;
    message: string;
    gmailUrl: string;
    mailtoUrl: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
  });

  if (!isOpen) return null;

  const targetEmail = settings.social?.supportEmail || 'ushforex@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    // 1. Save directly to Admin Inbox via SiteContext
    addInboxMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      topic: formData.topic,
      message: formData.message.trim(),
      source: 'contact_form',
    });

    // 2. Prepare direct dispatch URLs for ushforex@gmail.com
    const subject = `USH Customer Care: Inquiry from ${formData.name.trim()} [${formData.topic}]`;
    const body = `Hello USH Customer Care,\n\nYou have received a new inquiry via the USH Community of Traders website:\n\nName: ${formData.name.trim()}\nSender Email: ${formData.email.trim()}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message.trim()}\n\n---\nDispatched to: ${targetEmail}\nUSH Community of Traders Customer Care Desk`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;

    setLastPayload({
      name: formData.name.trim(),
      email: formData.email.trim(),
      topic: formData.topic,
      message: formData.message.trim(),
      gmailUrl,
      mailtoUrl,
    });

    // Attempt to trigger mail client automatically
    try {
      window.location.href = mailtoUrl;
    } catch {
      // Ignored if blocked by browser
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setLastPayload(null);
    setFormData({
      name: '',
      email: '',
      topic: 'General Inquiry',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-soft-fade">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-300 relative flex flex-col max-h-[92vh] overflow-y-auto"
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
            {/* USH Customer Care Header with Brand Logo */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200 mb-4">
              <div className="h-12 w-auto max-w-[120px] flex items-center justify-center shrink-0">
                <img 
                  src={settings.branding?.logoUrl || ushLogoPng || logoSvg} 
                  alt="USH Community of Traders Logo" 
                  className="h-11 w-auto max-h-11 object-contain shrink-0" 
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-manrope text-[19px] sm:text-[21px] font-black text-slate-900 leading-tight">
                    USH Customer Care
                  </h3>
                  <span className="bg-blue-50 text-[#0053CF] border border-blue-200 text-[10.5px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="font-inter text-[12.5px] text-slate-600">
                  USH Community of Traders direct support & inquiries desk
                </p>
              </div>
            </div>

            {/* Official Support Email Banner with 1-Click Copy */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block leading-none mb-1">
                  Official Customer Care Email
                </span>
                <span className="font-mono text-[13px] sm:text-[14px] font-bold text-[#0053CF] select-all truncate block">
                  {targetEmail}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="py-1 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11.5px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Copy Support Email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {submitted && lastPayload ? (
              <div className="py-4 space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-manrope text-[19px] font-black text-slate-900">
                    Inquiry Logged in Admin Desk
                  </h4>
                  <p className="font-inter text-[13.5px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Your message has been stored in the USH Community of Traders admin center and prepared for direct dispatch to <strong>{targetEmail}</strong>.
                  </p>
                </div>

                {/* Direct Action Dispatch Buttons */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                  <span className="text-[11.5px] font-bold text-slate-600 uppercase tracking-wider block text-center">
                    Dispatch Directly to ushforex@gmail.com
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={lastPayload.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 px-3 rounded-lg font-inter text-[13px] font-bold transition-colors shadow-2xs text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in Gmail Web</span>
                    </a>

                    <a
                      href={lastPayload.mailtoUrl}
                      className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-3 rounded-lg font-inter text-[13px] font-bold transition-colors shadow-2xs text-center"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Email App</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-slate-600 hover:text-slate-900 font-inter text-[13px] font-semibold py-1.5 px-4 cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block font-inter text-[12px] font-bold text-slate-800 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Alex Vance"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2 text-[13.5px] text-slate-900 outline-hidden font-inter"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[12px] font-bold text-slate-800 mb-1">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="trader@example.com"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2 text-[13.5px] text-slate-900 outline-hidden font-inter"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[12px] font-bold text-slate-800 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3 py-2 text-[13px] text-slate-900 outline-hidden font-inter"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Broker Partnership & Exness Setup">Broker Partnership & Exness Setup</option>
                    <option value="Telegram Community Access">Telegram Community Access</option>
                    <option value="Trading Education & Mentorship">Trading Education & Mentorship</option>
                    <option value="Technical or Website Feedback">Technical or Website Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block font-inter text-[12px] font-bold text-slate-800 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can USH Customer Care assist your trading journey?"
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded-lg px-3.5 py-2 text-[13.5px] text-slate-900 outline-hidden font-inter resize-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-3 rounded-xl font-inter text-[14px] font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to USH Customer Care</span>
                  </button>
                  <p className="text-center font-inter text-[11px] text-slate-500 mt-2">
                    Logs into Admin Desk & delivers to <strong>{targetEmail}</strong>
                  </p>
                </div>
              </form>
            )}
          </div>
        ) : (
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
