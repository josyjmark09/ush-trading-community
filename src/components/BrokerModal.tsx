import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Zap, Check } from 'lucide-react';
import { ExnessLogo } from './ExnessLogo';

interface BrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerModal: React.FC<BrokerModalProps> = ({ isOpen, onClose }) => {
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-[#E2E8F0] relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#75777E] hover:text-[#091C35] p-1.5 rounded-lg hover:bg-[#F1F4F9] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pt-1">
          <ExnessLogo size="md" />
          <div className="flex items-center gap-1.5 bg-[#EBF3FF] text-[#0053CF] px-3 py-1 rounded-full text-[12px] font-semibold border border-[#D5E3FF]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Recommended Broker</span>
          </div>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="space-y-4 mb-6">
          <h4 className="font-inter text-[13px] font-bold text-[#091C35] uppercase tracking-wider">
            3 Simple Steps to Start
          </h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F7FAFF] border border-[#E2E8F0]">
              <div className="w-6 h-6 rounded-full bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="block text-[14px] font-manrope text-[#091C35]">Create Your Account</strong>
                <span className="text-[13px] font-inter text-[#44474D]">
                  Sign up through the link to ensure access to raw spread conditions and institutional routing.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F7FAFF] border border-[#E2E8F0]">
              <div className="w-6 h-6 rounded-full bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="block text-[14px] font-manrope text-[#091C35]">Verify Identification</strong>
                <span className="text-[13px] font-inter text-[#44474D]">
                  Quick KYC verification under FCA/CySEC/FSCA regulatory protection.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#F7FAFF] border border-[#E2E8F0]">
              <div className="w-6 h-6 rounded-full bg-[#0053CF] text-white flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="block text-[14px] font-manrope text-[#091C35]">Connect MT4/MT5 & Trade</strong>
                <span className="text-[13px] font-inter text-[#44474D]">
                  Deposit funds with 0% transaction fees and instant automated withdrawals.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Protection Bar */}
        <div className="bg-[#EBF3FF] p-3.5 rounded-xl border border-[#B2C5FF]/50 flex items-center justify-between mb-6 text-[12px] font-inter text-[#0053CF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0053CF] shrink-0" />
            <span className="font-semibold">Tier-1 Regulatory Oversight (FCA, CySEC, FSCA)</span>
          </div>
          <span className="font-bold">&lt;0.01s Execution</span>
        </div>

        {/* Checkbox agreement */}
        <label className="flex items-start gap-2.5 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded text-[#0053CF] focus:ring-[#0053CF]"
          />
          <span className="font-inter text-[12px] text-[#44474D]">
            I understand that trading forex and CFDs carries financial risk and I have reviewed the risk disclosure statement.
          </span>
        </label>

        {/* Primary CTA */}
        <a
          href="https://one.exness-track.com"
          target="_blank"
          rel="noreferrer"
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-inter text-[15px] font-semibold transition-all text-center ${
            agreed
              ? 'bg-[#0053CF] hover:bg-[#0040A2] text-white shadow-md glow-blue'
              : 'bg-[#E5E8ED] text-[#75777E] pointer-events-none'
          }`}
        >
          <span>Proceed to Exness Official Portal</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
