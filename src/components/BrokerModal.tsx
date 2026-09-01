import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { ExnessLogo } from './ExnessLogo';
import { useSite } from '../context/SiteContext';

interface BrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerModal: React.FC<BrokerModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useSite();
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  const partnerLink = settings.vipGuide?.partnerLink || settings.broker.partnerLink || "https://one.exnessonelink.com/a/yxxz5mlw1n";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl max-w-xl w-full p-6 md:p-8 shadow-xl border border-slate-300 relative flex flex-col max-h-[90vh] overflow-y-auto"
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pt-1">
          <ExnessLogo size="md" />
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-[12px] font-bold border border-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
            <span>Recommended Broker</span>
          </div>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="space-y-3 mb-6">
          <h4 className="font-inter text-[13px] font-black text-slate-900 uppercase tracking-wider">
            3 Simple Steps to Start
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="block text-[14px] font-manrope font-black text-slate-900">Create Your Account</strong>
                <span className="text-[13px] font-inter text-slate-600">
                  Sign up through the link to ensure access to raw spread conditions and institutional routing.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="block text-[14px] font-manrope font-black text-slate-900">Verify Identification</strong>
                <span className="text-[13px] font-inter text-slate-600">
                  Quick KYC verification under FCA/CySEC/FSCA regulatory protection.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-slate-50 border border-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-black shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="block text-[14px] font-manrope font-black text-slate-900">Connect MT4/MT5 & Trade</strong>
                <span className="text-[13px] font-inter text-slate-600">
                  Deposit funds with 0% transaction fees and instant automated withdrawals.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Protection Bar */}
        <div className="bg-slate-100 p-3.5 rounded-lg border border-slate-300 flex items-center justify-between mb-5 text-[12px] font-inter text-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0053CF] shrink-0" />
            <span className="font-bold">Tier-1 Regulatory Oversight (FCA, CySEC, FSCA)</span>
          </div>
          <span className="font-black text-[#0053CF]">&lt;0.01s Execution</span>
        </div>

        {/* Checkbox agreement */}
        <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 rounded text-[#0053CF] focus:ring-[#0053CF]"
          />
          <span className="font-inter text-[12px] text-slate-600">
            I understand that trading forex and CFDs carries financial risk and I have reviewed the risk disclosure statement.
          </span>
        </label>

        {/* Primary CTA */}
        <a
          href={partnerLink}
          target="_blank"
          rel="noreferrer"
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-inter text-[14.5px] font-bold transition-colors text-center ${
            agreed
              ? 'bg-[#0053CF] hover:bg-[#0040A2] text-white shadow-xs cursor-pointer'
              : 'bg-slate-200 text-slate-400 pointer-events-none'
          }`}
        >
          <span>Proceed to Exness Official Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
