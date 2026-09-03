import React from 'react';
import { NavTab } from '../types';
import { ExnessLogo, ExnessBrandCard } from './ExnessLogo';
import { 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Gavel, 
  Zap, 
  ExternalLink, 
  Lock
} from 'lucide-react';

interface BrokerViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenBrokerModal: () => void;
  onOpenTelegram?: () => void;
}

export const BrokerView: React.FC<BrokerViewProps> = ({
  setActiveTab,
  onOpenBrokerModal,
  onOpenTelegram,
}) => {
  return (
    <div className="w-full flex flex-col gap-5 md:gap-10 pt-1 sm:pt-2 pb-10 sm:pb-12">
      {/* Header Section */}
      <section className="text-center px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-slate-100 border border-slate-300 text-slate-800 font-inter text-[11px] sm:text-[12px] font-black py-1 px-3 rounded-md uppercase tracking-wider mb-2">
          RECOMMENDED BROKER
        </span>
        <h1 className="font-manrope text-[26px] sm:text-[36px] md:text-[44px] font-black text-slate-900 mb-2 tracking-tight leading-[1.15]">
          Recommended Broker Setup
        </h1>
        <p className="font-inter text-[13.5px] sm:text-[16px] text-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
          At USH Community of Traders, execution quality, raw zero-spread liquidity, and instant withdrawals are non-negotiable. That is why our community trades on Exness.
        </p>
      </section>

      {/* Broker Bento Grid */}
      <section className="px-3 sm:px-6 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Main Broker Info Card */}
          <div className="md:col-span-8 bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-7 md:p-8 flex flex-col justify-between">
            <div>
              {/* Top row with Exness Logo & clean status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <ExnessLogo size="lg" />

                <div className="flex gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-[12px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Regulated</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-[12px] font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Trusted</span>
                  </span>
                </div>
              </div>

              {/* Core Benefits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-center">
                <div className="lg:col-span-6 space-y-2.5">
                  <h3 className="font-manrope text-[13.5px] sm:text-[14px] font-black text-slate-900 uppercase tracking-wider">
                    Benefits of Using Exness
                  </h3>
                  <ul className="space-y-2 font-inter text-[13px] sm:text-[14px] text-slate-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Ultra-low raw spreads starting from 0.0 pips</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Instant 24/7 automated withdrawals with zero delay</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>0% deposit and withdrawal commission fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Sub-millisecond execution with zero requotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Multi-regulated Tier-1 security (FCA, CySEC, FSCA)</span>
                    </li>
                  </ul>
                </div>

                {/* Exness Main Brand Card */}
                <div className="lg:col-span-6">
                  <ExnessBrandCard />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <button
                onClick={onOpenBrokerModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-lg font-inter text-[13.5px] sm:text-[14.5px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Open Exness Account</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTelegram}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 px-3 py-2 font-inter text-[13px] font-bold cursor-pointer"
              >
                <span>Need setup help? Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Column Cards */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Regulation Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5 text-slate-900">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0053CF]">
                    <Gavel className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-manrope text-[17px] sm:text-[19px] font-black">Tier-1 Regulated</h3>
                </div>
                <p className="font-inter text-[13px] text-slate-600 leading-relaxed mb-3">
                  Multi-regulated and globally compliant, ensuring segregated client funds and strict financial oversight.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200">
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  FCA
                </span>
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  CySEC
                </span>
                <span className="bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md text-[11.5px] font-black text-slate-900">
                  FSCA
                </span>
              </div>
            </div>

            {/* Lightning Execution Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5 text-slate-900">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0053CF]">
                    <Zap className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-manrope text-[17px] sm:text-[19px] font-black">Lightning Execution</h3>
                </div>
                <p className="font-inter text-[13px] text-slate-600 leading-relaxed mb-3">
                  Capitalize on market movements with ultra-fast order execution and deep institutional liquidity.
                </p>
              </div>

              <div className="flex items-baseline gap-2 text-[#0053CF] pt-3 border-t border-slate-200">
                <span className="font-manrope text-[28px] font-black tracking-tight">&lt; 0.01s</span>
                <span className="font-inter text-[12px] text-slate-500 font-medium">Avg. Execution Speed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
