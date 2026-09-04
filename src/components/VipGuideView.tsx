import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  AlertCircle, 
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
import { NavTab } from '../types';
import { AdminContactModal } from './AdminContactModal';
import { openTelegram, isMobileDevice } from '../utils/telegramLink';

interface VipGuideViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const VipGuideView: React.FC<VipGuideViewProps> = ({ setActiveTab }) => {
  const { settings, addInboxMessage } = useSite();
  const [userType, setUserType] = useState<'new' | 'existing'>('new');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSupportMessage, setCopiedSupportMessage] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAdminContactModalOpen, setIsAdminContactModalOpen] = useState(false);

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

  const handleCompleteAndRedirect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCompleted(true);

    let finalUrl = telegramUrl;
    if (accountId.trim()) {
      addInboxMessage({
        name: 'VIP Trader',
        email: 'direct_vip@telegram.community',
        accountId: accountId.trim(),
        topic: 'VIP Onboarding with Exness ID',
        message: `Trader provided Exness ID: ${accountId.trim()} upon joining VIP Telegram.`,
        source: 'vip_onboarding',
      });

      const msg = encodeURIComponent(
        `Hello Admin! I have completed my VIP registration under Partner Code ${partnerCode}. My Exness Account ID is: ${accountId.trim()}. Please grant me access to the Free VIP Group!`
      );
      const cleanTgUrl = telegramUrl.replace(/\/+$/, '');
      finalUrl = `${cleanTgUrl}?text=${msg}`;
    }

    openTelegram(finalUrl);
  };

  return (
    <div className="w-full max-w-full overflow-hidden pb-12 text-[#091C35] box-border">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 text-[13px] sm:text-[14px] font-bold text-slate-700 hover:text-[#0053CF] transition-colors cursor-pointer py-1.5 px-2 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminContactModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0053CF] hover:bg-[#0040A2] text-white text-[12px] sm:text-[13px] font-bold rounded-lg transition-all shadow-2xs shrink-0 cursor-pointer min-h-[40px]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-5">
        {/* Title Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2.5 px-2">
          <h1 className="font-manrope text-[24px] sm:text-[30px] md:text-[34px] font-black text-slate-900 tracking-tight leading-tight text-center">
            {settings.vipGuide?.title || "Join our trading community"}
          </h1>

          <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-lg mx-auto leading-relaxed text-center">
            Gain immediate access to institutional trade setups and signals. Opening an Exness broker account is completely optional.
          </p>
        </div>

        {/* STANDALONE BLUE CTA: PROCEED TO TELEGRAM */}
        <div className="w-full">
          <a
            href={telegramUrl}
            onClick={(e) => openTelegram(telegramUrl, e)}
            target={isMobileDevice() ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-4 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[14px] sm:text-[15px] rounded-xl sm:rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer active:scale-[0.99] border border-blue-600 group min-h-[50px] text-center"
          >
            <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>Proceed to Telegram Channel</span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* STEP CHOOSER TABS */}
        <div className="w-full bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 shadow-2xs border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Tab 1: New Trader */}
            <button
              type="button"
              onClick={() => setUserType('new')}
              className={`w-full p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] min-h-[56px] ${
                userType === 'new'
                  ? 'bg-blue-50/90 border-[#0053CF] shadow-2xs ring-1 ring-[#0053CF]/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  userType === 'new' ? 'bg-[#0053CF] text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <UserPlus className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-manrope font-bold text-[13.5px] sm:text-[14.5px] leading-tight ${
                    userType === 'new' ? 'text-[#0053CF]' : 'text-slate-900'
                  }`}>
                    No, I am a New Trader
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 font-inter truncate">
                    Register with VIP partner link (Optional)
                  </p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${userType === 'new' ? 'bg-[#0053CF]' : 'bg-slate-300'}`} />
            </button>

            {/* Tab 2: Existing User */}
            <button
              type="button"
              onClick={() => setUserType('existing')}
              className={`w-full p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] min-h-[56px] ${
                userType === 'existing'
                  ? 'bg-blue-50/90 border-[#0053CF] shadow-2xs ring-1 ring-[#0053CF]/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  userType === 'existing' ? 'bg-[#0053CF] text-white' : 'bg-slate-800 text-white'
                }`}>
                  <RefreshCw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-manrope font-bold text-[13.5px] sm:text-[14.5px] leading-tight ${
                    userType === 'existing' ? 'text-[#0053CF]' : 'text-slate-900'
                  }`}>
                    Yes, I Have An Account
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 font-inter truncate">
                    Switch partner code (Optional)
                  </p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${userType === 'existing' ? 'bg-[#0053CF]' : 'bg-slate-300'}`} />
            </button>
          </div>
        </div>

        {/* STEP DETAILS CARD - Clean, non-nested senior architecture */}
        <div className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xs border border-slate-200 space-y-6">
          
          {/* TRACK 1: NEW EXNESS USER */}
          {userType === 'new' && (
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-manrope font-bold text-[15px] sm:text-[16.5px] text-slate-900">
                        Create Your Exness Account
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Optional
                      </span>
                    </div>
                    <p className="text-[12px] sm:text-[12.5px] text-slate-500 mt-0.5 font-inter leading-relaxed">
                      Register with our official VIP partner link to trade with 0.0 pip raw spreads:
                    </p>
                  </div>
                </div>

                {/* Partner Link Display Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                  <div className="font-mono text-[11px] sm:text-[12px] text-slate-800 bg-white border border-slate-200 p-2.5 rounded-lg break-all select-all font-medium">
                    {partnerLink}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[12.5px] font-bold transition-colors cursor-pointer active:scale-99"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-emerald-700">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-600 shrink-0" />
                          <span>Copy Partner Link</span>
                        </>
                      )}
                    </button>

                    <a
                      href={partnerLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-lg text-[12.5px] font-bold transition-colors shadow-2xs cursor-pointer active:scale-99"
                    >
                      <span>Open Registration</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Partner Code Callout during sign up */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[12px] sm:text-[12.5px] font-inter">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0053CF] shrink-0" />
                    <span className="text-slate-700 font-medium">
                      Partner code to use during sign up &ndash;{' '}
                      <strong className="font-mono text-[13px] text-[#0053CF] font-bold tracking-wide select-all">
                        {partnerCode}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[11.5px] font-bold bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md transition-all shrink-0 cursor-pointer shadow-2xs active:scale-95"
                    title="Copy Partner Code"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-manrope font-bold text-[15px] sm:text-[16.5px] text-slate-900">
                        Verify & Fund Your Account
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        Optional
                      </span>
                    </div>
                    <p className="text-[12.5px] sm:text-[13px] text-slate-600 mt-1 font-inter leading-relaxed">
                      If you created an Exness account, complete quick ID verification and deposit (minimum $10) using your preferred local deposit method.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-manrope font-bold text-[15px] sm:text-[16.5px] text-slate-900">
                      Proceed to Telegram Channel
                    </h3>
                    <p className="text-[12.5px] sm:text-[13px] text-slate-600 mt-0.5 font-inter">
                      Enter your Exness Account ID (optional) and tap below to enter the channel:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCompleteAndRedirect} className="space-y-3 pt-1">
                  <input
                    type="text"
                    placeholder="Exness Account ID (Optional - e.g. 19284712)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] sm:text-[13.5px] font-inter focus:outline-hidden focus:bg-white focus:border-[#0053CF] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[14px] rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-99"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Proceed to Telegram Channel</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[11.5px] text-slate-500 font-inter pt-1">
                    <span>Prefer manual verification?</span>
                    <button
                      type="button"
                      onClick={() => setIsAdminContactModalOpen(true)}
                      className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Contact Admin & Support Desk</span>
                    </button>
                  </div>

                  {isCompleted && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[12px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Opening Telegram... <a href={telegramUrl} onClick={(e) => openTelegram(telegramUrl, e)} target={isMobileDevice() ? '_self' : '_blank'} rel="noreferrer" className="underline font-bold">Click here</a> if not redirected.</span>
                    </div>
                  )}
                </form>
              </div>

            </div>
          )}

          {/* TRACK 2: EXISTING EXNESS USER */}
          {userType === 'existing' && (
            <div className="space-y-6">
              {/* Intro Banner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <h3 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900">
                  Already registered under another partner?
                </h3>
                <p className="text-[12px] sm:text-[12.5px] text-slate-600 font-inter leading-relaxed">
                  Exness allows you to change your IB partner anytime via customer support or by opening a fresh account. Follow these simple steps:
                </p>
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900">
                    Log in to your Exness account
                  </h4>
                  <p className="text-[12px] sm:text-[12.5px] text-slate-600 mt-0.5 font-inter">
                    Open the Exness mobile app or official website and sign in.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900">
                    Open Exness Live Chat Support
                  </h4>
                  <p className="text-[12px] sm:text-[12.5px] text-slate-600 mt-0.5 font-inter">
                    Navigate to the Support / Live Chat section and request an IB change link.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Step 3: Partner Code Box */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900">
                      Submit Our Partner Code
                    </h4>
                    <p className="text-[12px] sm:text-[12.5px] text-slate-600 mt-0.5 font-inter">
                      When requested by support, provide the following IB partner code:
                    </p>
                  </div>
                </div>

                {/* High Contrast Partner Code Box */}
                <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-800 shadow-2xs space-y-3">
                  <div>
                    <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                      OFFICIAL EXNESS PARTNER CODE
                    </span>
                    <div className="font-mono text-[22px] sm:text-[26px] font-black tracking-wider text-amber-400 select-all break-all mt-0.5">
                      {partnerCode}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-lg text-[13px] font-bold transition-colors cursor-pointer active:scale-99"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span className="text-emerald-100">Copied Partner Code!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 shrink-0" />
                        <span>Copy Partner Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySupportMessage}
                    className="w-full text-center text-[11.5px] text-blue-300 hover:text-white font-medium flex items-center justify-center gap-1.5 pt-1 cursor-pointer transition-colors"
                  >
                    {copiedSupportMessage ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">Message copied! Paste in Live Chat.</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span>Tap to copy quick chat message for support</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Fallback alternative */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-[12px] sm:text-[12.5px] font-inter text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Info className="w-3.5 h-3.5 text-[#0053CF] shrink-0" />
                    <span>Alternative: Create a new account with another email</span>
                  </div>
                  <p className="leading-relaxed">
                    If Exness doesn't allow the partner change, you can simply open a new account using a different email:
                  </p>
                  <a
                    href={partnerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#0053CF] font-bold hover:underline"
                  >
                    <span>Open New Account via Partner Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Step 4 */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900">
                      Proceed to Telegram Channel
                    </h4>
                    <p className="text-[12px] sm:text-[12.5px] text-slate-600 mt-0.5 font-inter">
                      Enter your account ID (optional) and enter our official Telegram:
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCompleteAndRedirect} className="space-y-3 pt-1">
                  <input
                    type="text"
                    placeholder="Exness Account ID (Optional)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg text-[13px] sm:text-[13.5px] font-inter focus:outline-hidden focus:bg-white focus:border-[#0053CF] transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[14px] rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-99"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Proceed to Telegram Channel</span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[11.5px] text-slate-500 font-inter pt-1">
                    <span>Questions about IB switch?</span>
                    <button
                      type="button"
                      onClick={() => setIsAdminContactModalOpen(true)}
                      className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Contact Admin & Support Desk</span>
                    </button>
                  </div>

                  {isCompleted && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[12px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Opening Telegram... <a href={telegramUrl} onClick={(e) => openTelegram(telegramUrl, e)} target={isMobileDevice() ? '_self' : '_blank'} rel="noreferrer" className="underline font-bold">Click here</a> if not redirected.</span>
                    </div>
                  )}
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Help Banner */}
        <div className="text-center px-2 pt-2">
          <p className="text-[12.5px] sm:text-[13px] text-slate-600">
            Need assistance with setup or verification?{' '}
            <button
              type="button"
              onClick={() => setIsAdminContactModalOpen(true)}
              className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Contact our Support Desk</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </p>
        </div>
      </div>

      {/* Admin Contact Details Modal with Email, Telegram Redirect, and Form */}
      <AdminContactModal
        isOpen={isAdminContactModalOpen}
        onClose={() => setIsAdminContactModalOpen(false)}
        defaultAccountId={accountId}
      />
    </div>
  );
};
