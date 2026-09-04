import React, { useState } from 'react';
import { X, Send, Copy, Check, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { openTelegram, isMobileDevice } from '../utils/telegramLink';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useSite();
  const [copied, setCopied] = useState(false);
  const rawUrl = settings.social?.telegramUrl || settings.vipGuide?.vipTelegramUrl;
  const telegramUrl = (!rawUrl || rawUrl === 'https://t.me/ushforex_official') 
    ? 'https://t.me/+wHFuFFkA2i0xZTA8' 
    : rawUrl;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl max-w-lg w-full p-6 md:p-8 shadow-xl border border-slate-300 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-lg bg-[#0053CF] flex items-center justify-center text-white shadow-xs">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-manrope text-[19px] font-black text-slate-900">USH Community of Traders Telegram</h3>
              <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
            </div>
            <p className="font-inter text-[13px] text-slate-600">Official Free Community & Market Insights</p>
          </div>
        </div>

        {/* Channel Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-300">
            <div className="font-manrope text-[17px] font-black text-slate-900">5,420+</div>
            <div className="font-inter text-[11px] text-slate-500 font-medium">Active Traders</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-300">
            <div className="font-manrope text-[17px] font-black text-[#0053CF]">08:00 UTC</div>
            <div className="font-inter text-[11px] text-slate-500 font-medium">London Prep</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-300">
            <div className="font-manrope text-[17px] font-black text-emerald-700">100% Free</div>
            <div className="font-inter text-[11px] text-slate-500 font-medium">Public Access</div>
          </div>
        </div>

        {/* Live Channel Preview Card */}
        <div className="bg-slate-900 text-white p-4 rounded-lg mb-5 text-[13px] font-inter space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
            <span className="font-bold tracking-wider uppercase">Pinned Daily Brief</span>
            <span>Today, 07:45 UTC</span>
          </div>
          <div className="flex items-start gap-2 text-slate-200">
            <TrendingUp className="w-4 h-4 text-[#93C5FD] mt-0.5 shrink-0" />
            <p className="font-normal text-slate-200">
              <strong className="text-white">EUR/USD Institutional Liquidity Note:</strong> Price swept Asian high at 1.0855 into 4H bearish order block. Looking for MSB confirmation on 15M before London session open.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11.5px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1">
              <span>242 reactions</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>68 comments</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <a
            href={telegramUrl}
            onClick={(e) => openTelegram(telegramUrl, e)}
            target={isMobileDevice() ? '_self' : '_blank'}
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-3 px-6 rounded-lg font-inter text-[14.5px] font-bold shadow-xs transition-colors cursor-pointer text-center"
          >
            <Send className="w-4 h-4" />
            <span>Open Telegram Channel</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2.5 px-4 rounded-lg font-inter text-[13px] font-bold shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Channel Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
