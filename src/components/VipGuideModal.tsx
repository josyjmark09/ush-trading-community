import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  Sparkles, 
  UserPlus, 
  RefreshCw, 
  CheckCircle2, 
  MessageSquare,
  ArrowRight,
  Info,
  Mail,
  Phone
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { AdminContactModal } from './AdminContactModal';
import { openTelegram, isMobileDevice } from '../utils/telegramLink';

interface VipGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'new' | 'existing';
}

export const VipGuideModal: React.FC<VipGuideModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'new'
}) => {
  const { settings, addInboxMessage } = useSite();
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>(defaultTab);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSupportMessage, setCopiedSupportMessage] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [submittedId, setSubmittedId] = useState(false);
  const [isAdminContactOpen, setIsAdminContactOpen] = useState(false);

  if (!isOpen) return null;

  const partnerLink = settings.vipGuide?.partnerLink || "https://one.exnessonelink.com/a/yxxz5mlw1n";
  const partnerCode = settings.vipGuide?.partnerCode || "yxxz5mlw1n";
  const rawTg = settings.vipGuide?.vipTelegramUrl || settings.social?.telegramUrl;
  const telegramUrl = (!rawTg || rawTg === 'https://t.me/ushforex_official')
    ? 'https://t.me/+wHFuFFkA2i0xZTA8'
    : rawTg;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partnerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(partnerLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySupportMessage = () => {
    const message = `Hello Exness Support, I would like to change my Partner / IB code to: ${partnerCode}`;
    navigator.clipboard.writeText(message);
    setCopiedSupportMessage(true);
    setTimeout(() => setCopiedSupportMessage(false), 2500);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(true);
    
    let finalUrl = telegramUrl;
    if (accountId.trim()) {
      addInboxMessage({
        name: 'VIP Trader',
        email: 'vip_applicant@telegram.community',
        accountId: accountId.trim(),
        topic: 'VIP Access with Exness ID',
        message: `Trader submitted Exness ID: ${accountId.trim()} via VIP Modal.`,
        source: 'vip_onboarding',
      });

      const msg = encodeURIComponent(
        `Hello Admin! I have registered under your partner code (${partnerCode}). My Exness Account ID is: ${accountId.trim()}. Please add me to the Free VIP Group!`
      );
      const cleanTgUrl = telegramUrl.replace(/\/+$/, '');
      finalUrl = `${cleanTgUrl}?text=${msg}`;
    }
    
    openTelegram(finalUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-6 md:p-8 shadow-xl border border-slate-300 relative flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-start gap-1.5 mb-3 sm:mb-4 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] sm:text-[12px] font-black text-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-[#0053CF]" />
            <span>100% FREE VIP COMMUNITY ACCESS</span>
          </div>

          <h2 className="font-manrope text-[22px] sm:text-[26px] md:text-[28px] font-black text-slate-900 leading-tight tracking-tight">
            {settings.vipGuide?.title || "Join our trading community"}
          </h2>

          <p className="font-inter text-[13px] sm:text-[14px] text-slate-600 leading-relaxed">
            Gain immediate access to trade setups. Opening an Exness broker account is completely optional.
          </p>
        </div>

        {/* STANDALONE BLUE CTA: PROCEED TO TELEGRAM */}
        <div className="w-full mb-4">
          <a
            href={telegramUrl}
            onClick={(e) => openTelegram(telegramUrl, e)}
            target={isMobileDevice() ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-3 sm:px-5 sm:py-3.5 bg-[#0053CF] hover:bg-[#0042A6] text-white font-inter font-bold text-[13.5px] sm:text-[14.5px] rounded-xl shadow-sm hover:shadow transition-all cursor-pointer border border-blue-600 group text-center min-h-[48px]"
          >
            <Send className="w-4 h-4 text-white shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>Proceed to Telegram Channel</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* User Type Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg mb-5 border border-slate-300">
          <button
            onClick={() => { setActiveTab('new'); setSubmittedId(false); }}
            className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-md font-inter text-[12.5px] sm:text-[13px] font-bold transition-colors cursor-pointer ${
              activeTab === 'new'
                ? 'bg-white text-[#0053CF] shadow-2xs border border-slate-300'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4 shrink-0" />
            <span className="truncate">New Exness User</span>
          </button>

          <button
            onClick={() => { setActiveTab('existing'); setSubmittedId(false); }}
            className={`flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-md font-inter text-[12.5px] sm:text-[13px] font-bold transition-colors cursor-pointer ${
              activeTab === 'existing'
                ? 'bg-white text-[#0053CF] shadow-2xs border border-slate-300'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span className="truncate">Existing User (Switch IB)</span>
          </button>
        </div>

        {/* TAB 1: NEW EXNESS USER GUIDE */}
        {activeTab === 'new' && (
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-black text-[12px]">
                  1
                </div>
                <h3 className="font-manrope font-black text-[15px] sm:text-[16px] text-slate-900">
                  To Register: Create Your Exness Account
                </h3>
              </div>

              <p className="text-[13px] text-slate-600 font-inter">
                Create your Exness account using our official VIP partner registration link below:
              </p>

              {/* Direct Link Action Box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-white border border-slate-300 rounded-lg">
                <div className="flex-1 font-mono text-[12px] sm:text-[12.5px] text-slate-800 truncate px-2 py-1 select-all bg-slate-100 rounded-md">
                  {partnerLink}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-[12px] font-bold border border-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={partnerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-md text-[12px] font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Partner Code Callout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12px] font-inter">
                <span className="text-slate-600 font-medium">
                  Partner code to use during sign up &ndash;{' '}
                  <strong className="font-mono text-[12.5px] text-[#0053CF] font-bold tracking-wide select-all">
                    {partnerCode}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
                  title="Copy Partner Code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Warning box */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-[12.5px] font-inter">
                <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <p className="leading-snug">
                  <strong>Important:</strong> Make sure you stay on the website until you complete the full registration process.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-black text-[12px]">
                  2
                </div>
                <h3 className="font-manrope font-black text-[15px] sm:text-[16px] text-slate-900">
                  Verify & Fund Your Trading Account
                </h3>
              </div>
              <p className="text-[13px] text-slate-600 font-inter leading-relaxed">
                Complete quick KYC identification on Exness and fund your account with your preferred trading capital (minimum $10) to activate live trading permissions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3">
              <div className="flex items-center gap-2.5 text-slate-900">
                <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-black text-[12px]">
                  3
                </div>
                <h3 className="font-manrope font-black text-[15px] sm:text-[16px] text-slate-900">
                  Step 3: Proceed to Telegram Channel
                </h3>
              </div>
              <p className="text-[13px] text-slate-600 font-inter">
                Enter your Exness Account ID (optional) and click below to proceed to the Telegram channel:
              </p>

              {/* Verification Form */}
              <form onSubmit={handleVerifySubmit} className="space-y-2.5 pt-1">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Exness Account ID (Optional - e.g. 19284712)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] font-inter focus:outline-hidden focus:border-[#0053CF]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[13px] rounded-lg transition-colors shadow-2xs cursor-pointer min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>Proceed to Telegram Channel</span>
                  </button>
                </div>
                {submittedId && (
                  <p className="text-[12px] text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Opening Telegram channel...
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: EXISTING USER / SWITCH IB GUIDE */}
        {activeTab === 'existing' && (
          <div className="space-y-4">
            {/* Guide Header Banner */}
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300">
              <h3 className="font-manrope font-black text-[14px] sm:text-[15px] text-slate-900 mb-0.5">
                Already registered under another partner? Here's how to switch:
              </h3>
              <p className="text-[12.5px] text-slate-600 font-inter">
                Follow these simple steps to change your Exness partnership and unlock VIP group access for free.
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3.5">
              <h4 className="font-manrope font-black text-[15px] sm:text-[16px] text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0053CF]"></span>
                How to Change Your Exness Partnership
              </h4>

              <div className="space-y-3 text-[13px] font-inter text-slate-700">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="leading-snug pt-0.5">
                    <strong>Log in to your Exness account</strong> (via the mobile app or official website).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="leading-snug pt-0.5">
                    To change your IB, you need to contact <strong>Exness customer support</strong> directly via the <strong>Live Chat</strong> or <strong>Support Section</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="leading-snug pt-0.5">
                    Request an <strong>IB change</strong> from customer service, and they will provide you with a special link to update it.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="w-full space-y-2 pt-0.5">
                    <p className="leading-snug font-medium text-slate-900">
                      After you receive the link, use my partner code below 👇
                    </p>

                    {/* Partner Code Box */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                          Official VIP Partner Code / IB
                        </span>
                        <span className="font-mono text-[18px] sm:text-[20px] font-black tracking-wider text-amber-400">
                          {partnerCode}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="flex items-center justify-center gap-2 px-3.5 py-2 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-md text-[12.5px] font-bold transition-colors shadow-2xs cursor-pointer shrink-0"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">Copied Partner Code!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Partner Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick copy chat message template */}
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={handleCopySupportMessage}
                        className="text-[12px] text-[#0053CF] hover:text-[#0040A2] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedSupportMessage ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied ready-to-send support message!</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-[#0053CF]" />
                            <span>Copy sample live chat message for Exness support</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative fallback */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-950 font-manrope font-black text-[13.5px]">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>If Exness doesn't allow the change:</span>
              </div>

              <p className="text-[12.5px] text-amber-950 font-inter leading-relaxed">
                Simply create a new Exness account using a <strong>different email address</strong> (you can keep the same personal name, phone number, and ID details) through this link:
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-white border border-amber-300 rounded-md">
                <div className="flex-1 font-mono text-[11.5px] text-amber-950 truncate px-2 py-1 select-all bg-amber-50/50 rounded">
                  {partnerLink}
                </div>
                <a
                  href={partnerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-[12px] font-bold transition-colors cursor-pointer"
                >
                  <span>Open Registration</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[11.5px] text-amber-900 font-medium italic">
                Just make sure you remain on the website until the registration is fully completed.
              </p>
            </div>

            {/* Step 5 Verification */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2.5">
              <h4 className="font-manrope font-black text-[14px] text-slate-900">
                Step 5: Proceed to Telegram Channel
              </h4>
              <p className="text-[13px] text-slate-600 font-inter">
                Enter your Exness Account ID (optional) and click below to join the channel:
              </p>
              <form onSubmit={handleVerifySubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Exness Account ID after switching (Optional)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-[13px] font-inter focus:outline-hidden focus:border-[#0053CF]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[13px] rounded-lg transition-colors shadow-2xs cursor-pointer min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>Proceed to Telegram Channel</span>
                  </button>
                </div>
                {submittedId && (
                  <p className="text-[12px] text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Opening Telegram channel...
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
            <span>Zero subscription fees • Direct institutional VIP access</span>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminContactOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0053CF] hover:text-[#0040A2] font-bold text-[13px] py-1 transition-colors cursor-pointer"
          >
            <span>Need Help? Contact Admin & Support Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Contact Details Modal */}
      <AdminContactModal
        isOpen={isAdminContactOpen}
        onClose={() => setIsAdminContactOpen(false)}
        defaultAccountId={accountId}
      />
    </div>
  );
};
