import React, { useState } from 'react';
import { X, Send, Copy, Check, ShieldCheck, Users, TrendingUp, Sparkles, QrCode } from 'lucide-react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const telegramUrl = "https://t.me/ushforex_official";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(telegramUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-[#E2E8F0] relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#75777E] hover:text-[#091C35] p-1.5 rounded-lg hover:bg-[#F1F4F9] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0053CF] to-[#116AFE] flex items-center justify-center text-white shadow-md">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-manrope text-[20px] font-bold text-[#091C35]">U.S.H Forex Telegram</h3>
              <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
            </div>
            <p className="font-inter text-[13px] text-[#44474D]">Official Free Community & Market Insights</p>
          </div>
        </div>

        {/* Channel Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="bg-[#F1F4F9] p-3 rounded-xl border border-[#E5E8ED]">
            <div className="font-manrope text-[18px] font-bold text-[#091C35]">5,420+</div>
            <div className="font-inter text-[11px] text-[#44474D]">Active Traders</div>
          </div>
          <div className="bg-[#F1F4F9] p-3 rounded-xl border border-[#E5E8ED]">
            <div className="font-manrope text-[18px] font-bold text-[#0053CF]">08:00 UTC</div>
            <div className="font-inter text-[11px] text-[#44474D]">London Prep</div>
          </div>
          <div className="bg-[#F1F4F9] p-3 rounded-xl border border-[#E5E8ED]">
            <div className="font-manrope text-[18px] font-bold text-emerald-600">100% Free</div>
            <div className="font-inter text-[11px] text-[#44474D]">Public Access</div>
          </div>
        </div>

        {/* Live Channel Preview Card */}
        <div className="bg-[#091C35] text-white p-4 rounded-xl mb-6 text-[13px] font-inter space-y-2.5 border border-[#116AFE]/30">
          <div className="flex items-center justify-between text-[#B2C5FF] text-[11px] border-b border-white/10 pb-2">
            <span className="font-bold tracking-wider uppercase">Pinned Daily Brief</span>
            <span>Today, 07:45 UTC</span>
          </div>
          <p className="font-medium text-[#D5E3FF]">
            📈 <strong>EUR/USD Institutional Liquidity Note:</strong> Price swept Asian high at 1.0855 into 4H bearish order block. Looking for MSB confirmation on 15M before London session open.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#7484A3] pt-1">
            <span>🔥 242 reactions</span>
            <span>💬 68 comments</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#116AFE] to-[#0053CF] hover:from-[#0053CF] hover:to-[#0040A2] text-white py-3.5 px-6 rounded-xl font-inter text-[15px] font-semibold glow-blue shadow-md transition-all active:scale-98 text-center"
          >
            <Send className="w-4 h-4" />
            <span>Open Telegram Channel</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-[#F1F4F9] hover:bg-[#E5E8ED] text-[#091C35] py-3 px-4 rounded-xl font-inter text-[13px] font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Invite Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#75777E]" />
                <span>Copy Channel Invite Link</span>
              </>
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="font-inter text-[11px] text-[#75777E] text-center mt-5">
          We will never direct message you asking for investment funds or passwords. Always verify you are joining the official channel.
        </p>
      </div>
    </div>
  );
};
