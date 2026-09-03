import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Send, 
  AlertCircle, 
  UserPlus, 
  RefreshCw, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  Info,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { NavTab } from '../types';
import { AdminContactModal } from './AdminContactModal';

interface VipGuideViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const VipGuideView: React.FC<VipGuideViewProps> = ({ setActiveTab }) => {
  const { settings, addInboxMessage } = useSite();
  // userType can be null (initial question screen), 'new', or 'existing'
  const [userType, setUserType] = useState<'new' | 'existing' | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSupportMessage, setCopiedSupportMessage] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAdminContactModalOpen, setIsAdminContactModalOpen] = useState(false);

  const partnerLink = settings.vipGuide?.partnerLink || "https://one.exnessonelink.com/a/yxxz5mlw1n";
  const partnerCode = settings.vipGuide?.partnerCode || "1046090975706890644";
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

    setTimeout(() => {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  return (
    <div className="w-full max-w-full overflow-hidden pb-16 text-[#091C35]">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-300 shadow-sm flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 text-[13px] sm:text-[14px] font-bold text-slate-800 hover:text-[#0053CF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminContactModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0053CF] hover:bg-[#0040A2] text-white text-[12px] sm:text-[13px] font-bold rounded-lg transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
        {/* Title Header */}
        <div className="text-center space-y-2 mb-5 sm:mb-6 px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] sm:text-[12px] font-bold text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF] shrink-0" />
            <span>OFFICIAL VIP ONBOARDING PORTAL</span>
          </div>

          <h1 className="font-manrope text-[24px] sm:text-[32px] md:text-[36px] font-black text-slate-900 tracking-tight leading-tight">
            {settings.vipGuide?.title || "Join our trading community"}
          </h1>

          <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-lg mx-auto leading-relaxed">
            Gain immediate access to institutional trade setups and signals. Opening an Exness broker account is completely optional.
          </p>
        </div>

        {/* STANDALONE BLUE CTA: PROCEED TO TELEGRAM */}
        <div className="w-full mb-6">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3 py-3 sm:px-6 sm:py-3.5 bg-[#0053CF] hover:bg-[#0042A6] text-white font-inter font-black text-[13px] sm:text-[15px] rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] border border-blue-600 group"
          >
            <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span className="whitespace-nowrap">Proceed to Telegram Channel</span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* STEP 0: QUESTION CHOOSER */}
        {userType === null ? (
          <div className="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-300 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-black tracking-widest text-[#0053CF] uppercase">
                Recommended Broker Setup (Optional)
              </span>
              <h2 className="font-manrope text-[18px] sm:text-[22px] font-black text-slate-900 leading-snug">
                Do you want to set up an Exness account for raw spreads?
              </h2>
              <p className="text-[12.5px] sm:text-[13px] text-slate-600 font-inter max-w-md mx-auto">
                Opening an Exness account is <strong>optional</strong>. If you already want raw institutional spreads, choose your status below, or skip straight to Telegram.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Option A: New User */}
              <button
                onClick={() => setUserType('new')}
                className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-300 hover:border-[#0053CF] bg-slate-50/70 hover:bg-blue-50/50 text-left transition-all shadow-2xs cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0053CF] text-white flex items-center justify-center shrink-0">
                    <UserPlus className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900 group-hover:text-[#0053CF] transition-colors leading-tight">
                      No, I am a New Trader
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-0.5 font-inter">
                      Register with VIP partner link (Optional)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0053CF] shrink-0" />
              </button>

              {/* Option B: Existing User */}
              <button
                onClick={() => setUserType('existing')}
                className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-300 hover:border-[#0053CF] bg-slate-50/70 hover:bg-blue-50/50 text-left transition-all shadow-2xs cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-manrope font-bold text-[14.5px] sm:text-[15.5px] text-slate-900 group-hover:text-[#0053CF] transition-colors leading-tight">
                      Yes, I Have An Account
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-0.5 font-inter">
                      Switch partner code (Optional)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0053CF] shrink-0" />
              </button>
            </div>

            {/* Option C: Direct Skip to Telegram */}
            <div className="pt-2 border-t border-slate-200 text-center">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 text-slate-700 hover:text-[#0053CF] font-inter text-[13px] font-bold hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#0053CF]" />
                <span>Skip Broker Setup & Proceed Directly to Telegram Channel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* STEP DETAILS */
          <div className="w-full max-w-full space-y-4">
            {/* Status bar */}
            <div className="w-full bg-white px-4 py-3 rounded-xl border border-slate-300 shadow-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[12.5px] sm:text-[13px] font-bold text-slate-700">
                <span className="text-slate-500">Selected:</span>
                <span className="text-[#0053CF] truncate max-w-[200px] sm:max-w-none">
                  {userType === 'new' ? 'New Account Registration (Optional)' : 'Existing User (Switch IB) (Optional)'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[#0053CF] font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Proceed to Telegram</span>
                </a>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => { setUserType(null); setIsCompleted(false); }}
                  className="text-[12px] text-slate-600 hover:text-[#0053CF] font-bold underline transition-colors cursor-pointer shrink-0"
                >
                  Change Selection
                </button>
              </div>
            </div>

            {/* TRACK 1: NEW EXNESS USER */}
            {userType === 'new' && (
              <div className="w-full max-w-full bg-white rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-300 space-y-4 sm:space-y-5 overflow-hidden">
                {/* Step 1 */}
                <div className="w-full max-w-full p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-manrope font-extrabold text-[15.5px] sm:text-[17px] text-slate-900 leading-snug">
                        Step 1 (Optional): Create Your Exness Account
                      </h3>
                      <p className="text-[12px] text-slate-500 mt-0.5 font-medium">
                        Optional: Register if you wish to trade with 0.0 pip raw spreads and institutional execution.
                      </p>
                    </div>
                  </div>

                  <p className="text-[13px] sm:text-[14px] text-slate-800 font-inter leading-relaxed">
                    Create your Exness trading account using our official partner link below:
                  </p>

                  {/* Responsive Link Box */}
                  <div className="w-full max-w-full overflow-hidden flex flex-col gap-2 p-3 bg-white border border-slate-300 rounded-lg shadow-2xs">
                    <div className="w-full font-mono text-[11.5px] sm:text-[12.5px] text-slate-900 bg-slate-100 p-2.5 rounded-md break-all select-all font-semibold">
                      {partnerLink}
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-md text-[12.5px] font-bold transition-colors cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800">Copied Link!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-700 shrink-0" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={partnerLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-md text-[12.5px] font-bold transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Open Registration</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Advisory Notice */}
                  <div className="w-full flex items-start gap-2.5 p-3 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-950 text-[12.5px] sm:text-[13px] font-inter">
                    <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">
                      <strong>Exness is optional:</strong> You do not have to register with Exness to join our channel. You can proceed directly to Telegram anytime!
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="w-full max-w-full p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-2 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
                      2
                    </div>
                    <h3 className="font-manrope font-extrabold text-[15.5px] sm:text-[17px] text-slate-900">
                      Step 2 (Optional): Verify & Fund Your Account
                    </h3>
                  </div>
                  <p className="text-[13px] text-slate-700 font-inter leading-relaxed">
                    If you created an Exness account, complete quick verification and fund your account (minimum $10) using your preferred deposit method.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="w-full max-w-full p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3 overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#0053CF] text-white flex items-center justify-center font-bold text-[13px] shrink-0">
                      3
                    </div>
                    <h3 className="font-manrope font-extrabold text-[15.5px] sm:text-[17px] text-slate-900">
                      Step 3: Proceed to Telegram Channel
                    </h3>
                  </div>

                  <p className="text-[13px] text-slate-700 font-inter">
                    Enter your Exness Account ID (optional) and tap below to proceed directly to our Telegram channel:
                  </p>

                  <form onSubmit={handleCompleteAndRedirect} className="w-full space-y-2.5">
                    <input
                      type="text"
                      placeholder="Exness Account ID (Optional - e.g. 19284712)"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-md text-[13px] sm:text-[13.5px] font-inter focus:outline-hidden focus:border-[#0053CF]"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[14px] rounded-md transition-colors shadow-sm cursor-pointer active:scale-99"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">Proceed to Telegram Channel</span>
                    </button>

                    <div className="pt-1 flex items-center justify-between text-[11.5px] text-slate-500 font-inter">
                      <span>Prefer manual verification?</span>
                      <button
                        type="button"
                        onClick={() => setIsAdminContactModalOpen(true)}
                        className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Send to Admin Email or Support</span>
                      </button>
                    </div>

                    {isCompleted && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-md text-emerald-900 text-[12px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Opening Telegram... <a href={telegramUrl} target="_blank" rel="noreferrer" className="underline font-bold">Click here</a> if not opened.</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* TRACK 2: EXISTING EXNESS USER */}
            {userType === 'existing' && (
              <div className="w-full max-w-full bg-white rounded-xl sm:rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-300 space-y-4 sm:space-y-5 overflow-hidden">
                {/* Intro banner */}
                <div className="w-full p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
                  <h3 className="font-manrope font-extrabold text-[15px] sm:text-[16px] text-slate-900 leading-snug">
                    Already registered under another partner? Here’s how to switch:
                  </h3>
                  <p className="text-[12.5px] sm:text-[13px] text-slate-700 font-inter">
                    Exness allows you to change your IB partner anytime via customer support or by opening a fresh account. Follow the instructions below:
                  </p>
                </div>

                {/* Steps container */}
                <div className="w-full max-w-full p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-4 overflow-hidden">
                  <h4 className="font-manrope font-extrabold text-[16px] text-slate-900">
                    How to Change Your Exness Partnership
                  </h4>

                  <div className="space-y-3.5 text-[13px] sm:text-[13.5px] font-inter text-slate-800">
                    {/* Step 1 */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11.5px] font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="leading-snug pt-0.5">
                        <strong>Log in to your Exness account</strong> (via the mobile app or official website).
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11.5px] font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="space-y-1 pt-0.5 min-w-0 flex-1">
                        <p className="leading-snug">
                          To change your IB, contact <strong>Exness customer support</strong> directly via <strong>Live Chat</strong> or <strong>Support Section</strong>.
                        </p>
                        <p className="leading-snug text-slate-600 text-[12px]">
                          Request an IB change link from support to update your partner.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 (Solid Partner Code Box) */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11.5px] font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="w-full min-w-0 space-y-2.5 pt-0.5">
                        <p className="leading-snug">
                          After you receive the link, use my partner code below 👇
                        </p>

                        {/* Solid High-Contrast Partner Code Box */}
                        <div className="w-full max-w-full overflow-hidden bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-700 shadow-sm flex flex-col gap-3">
                          <div className="space-y-1 min-w-0">
                            <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 block">
                              Exness Partner Code (IB Number)
                            </span>
                            <div className="font-mono text-[20px] sm:text-[24px] font-black tracking-wider text-amber-300 select-all break-all">
                              {partnerCode}
                            </div>
                            <p className="text-[11.5px] text-slate-300 leading-snug">
                              Paste this exact number into the Exness partner change link.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyCode}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-md text-[13px] font-bold transition-colors shadow-xs cursor-pointer"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                                <span className="text-emerald-200">Copied Partner Code!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 shrink-0" />
                                <span>Copy Partner Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Quick Message Helper */}
                        <div>
                          <button
                            type="button"
                            onClick={handleCopySupportMessage}
                            className="text-[11.5px] sm:text-[12px] text-[#0053CF] hover:text-[#0040A2] font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-left"
                          >
                            {copiedSupportMessage ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-emerald-700">Copied message to send to Exness support!</span>
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                                <span>Click here to copy sample message for Exness Live Chat</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fallback Box */}
                <div className="w-full max-w-full p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2.5 overflow-hidden">
                  <div className="flex items-center gap-2 text-amber-950 font-manrope font-bold text-[14.5px] sm:text-[15px]">
                    <Info className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>If Exness doesn’t allow the change:</span>
                  </div>

                  <p className="text-[12.5px] sm:text-[13px] text-amber-950 font-inter leading-relaxed">
                    Simply create a new Exness account using a <strong>different email address</strong> (you can keep the same personal details and phone number) through this link:
                  </p>

                  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-white border border-amber-300 rounded-lg overflow-hidden">
                    <div className="w-full sm:flex-1 font-mono text-[11.5px] sm:text-[12px] text-slate-900 break-all px-2.5 py-1 select-all bg-slate-100 rounded-md">
                      {partnerLink}
                    </div>
                    <a
                      href={partnerLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-[12px] font-bold transition-colors shadow-2xs cursor-pointer shrink-0"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </div>

                  <p className="text-[12px] text-amber-900 font-semibold italic">
                    Just make sure you remain on the website until the registration is fully completed.
                  </p>
                </div>

                {/* Final step & Done CTA */}
                <div className="w-full max-w-full p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-3 overflow-hidden">
                  <h4 className="font-manrope font-extrabold text-[15.5px] sm:text-[16px] text-slate-900">
                    Step 4: Proceed to Telegram Channel
                  </h4>

                  <p className="text-[13px] text-slate-700 font-inter">
                    Enter your Exness Account ID (optional) and click below to access the VIP Telegram channel:
                  </p>

                  <form onSubmit={handleCompleteAndRedirect} className="w-full space-y-2.5">
                    <input
                      type="text"
                      placeholder="Exness Account ID after switching (Optional)"
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-md text-[13px] sm:text-[13.5px] font-inter focus:outline-hidden focus:border-[#0053CF]"
                    />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0053CF] hover:bg-[#0040A2] text-white font-inter font-bold text-[14px] rounded-md transition-colors shadow-sm cursor-pointer active:scale-99"
                    >
                      <Send className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">Proceed to Telegram Channel</span>
                    </button>

                    <div className="pt-1 flex items-center justify-between text-[11.5px] text-slate-500 font-inter">
                      <span>Questions about IB switch?</span>
                      <button
                        type="button"
                        onClick={() => setIsAdminContactModalOpen(true)}
                        className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Contact Admin & Support Desk</span>
                      </button>
                    </div>

                    {isCompleted && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-md text-emerald-900 text-[12px] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Opening Telegram... <a href={telegramUrl} target="_blank" rel="noreferrer" className="underline font-bold">Click here</a> if not opened.</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Help Banner */}
        <div className="mt-6 text-center px-2">
          <p className="text-[12.5px] sm:text-[13px] text-slate-600">
            Need assistance with Exness setup or account verification?{' '}
            <button
              type="button"
              onClick={() => setIsAdminContactModalOpen(true)}
              className="text-[#0053CF] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer ml-1"
            >
              <span>Contact our Admin & Support Desk</span>
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
