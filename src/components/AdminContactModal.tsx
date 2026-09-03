import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  Send,
  CheckCircle2, 
  Phone
} from 'lucide-react';
import { useSite } from '../context/SiteContext';

interface AdminContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountId?: string;
}

export const AdminContactModal: React.FC<AdminContactModalProps> = ({
  isOpen,
  onClose,
  defaultAccountId = '',
}) => {
  const { settings, addInboxMessage } = useSite();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPartnerCode, setCopiedPartnerCode] = useState(false);
  
  // Message Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountId: defaultAccountId,
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  if (!isOpen) return null;

  const adminEmail = settings.social?.supportEmail || 'ushforex@gmail.com';
  const partnerCode = settings.vipGuide?.partnerCode || '1046090975706890644';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPartnerCode = () => {
    navigator.clipboard.writeText(partnerCode);
    setCopiedPartnerCode(true);
    setTimeout(() => setCopiedPartnerCode(false), 2000);
  };

  const handleOpenEmailClient = () => {
    const subject = encodeURIComponent(
      `[Exness Support] ${formData.accountId ? `Account #${formData.accountId}` : 'Trader Inquiry'}`
    );
    const body = encodeURIComponent(
      `Hello Admin,\n\nName: ${formData.name || 'Trader'}\nExness Account ID: ${formData.accountId || 'N/A'}\n\nMessage:\n${formData.message || 'I need help with Exness setup / verification.'}\n\nThank you!`
    );
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    addInboxMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      accountId: formData.accountId.trim(),
      topic: 'Exness IB & VIP Setup Support',
      message: formData.message.trim(),
      source: 'admin_support',
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-soft-fade"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 shadow-xl border border-slate-300 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-2.5 border-b border-slate-200 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-[#0053CF] shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="font-manrope text-[15px] sm:text-[16px] font-black text-slate-900 leading-tight">
                Contact Admin
              </h2>
              <p className="font-inter text-[11.5px] text-slate-500">
                Direct administrative & IB assistance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Admin Email Row - Compact Inline Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-2 flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block leading-none mb-1">
              Admin Email:
            </span>
            <span className="font-mono text-[12px] sm:text-[13px] font-bold text-slate-900 select-all truncate block">
              {adminEmail}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Copy Email Address"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenEmailClient}
              className="py-1 px-2 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Open Mail Client"
            >
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </button>
          </div>
        </div>

        {/* Partner IB Code Box - Compact Inline Row */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0 pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block leading-none mb-1">
              Exness IB Code:
            </span>
            <span className="font-mono text-[12px] sm:text-[13px] font-bold text-slate-900 select-all">
              {partnerCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyPartnerCode}
            className="py-1 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
          >
            {copiedPartnerCode ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Message Form */}
        <div>
          <div className="text-[11.5px] font-bold text-slate-800 mb-1.5 font-manrope">
            Send Message Directly:
          </div>

          {formSubmitted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-center space-y-1 animate-soft-fade">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <div className="font-manrope text-[13px] font-bold text-emerald-900">
                Message Sent
              </div>
              <p className="text-[11.5px] text-emerald-800 font-inter">
                Admin will reply to your email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 mb-0.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded px-2.5 py-1.5 text-[12px] text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-700 mb-0.5">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded px-2.5 py-1.5 text-[12px] text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-700 mb-0.5">
                  Exness Account ID <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 19284712"
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded px-2.5 py-1.5 text-[12px] text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-700 mb-0.5">
                  Message
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="How can we assist you with Exness verification?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-[#0053CF] rounded px-2.5 py-1.5 text-[12px] text-slate-900 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[12.5px] rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs mt-1"
              >
                <Send className="w-3 h-3" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
