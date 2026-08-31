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
    <div className="w-full flex flex-col gap-8 md:gap-12 pt-4 pb-12">
      {/* Header Section */}
      <section className="text-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider mb-3">
          RECOMMENDED BROKER
        </span>
        <h1 className="font-manrope text-[30px] sm:text-[40px] md:text-[46px] font-extrabold text-[#091C35] mb-3 tracking-tight leading-[1.15]">
          Recommended Broker Setup
        </h1>
        <p className="font-inter text-[15px] sm:text-[17px] text-[#44474D] max-w-2xl mx-auto leading-relaxed">
          At U.S.H Forex, execution quality, raw zero-spread liquidity, and instant withdrawals are non-negotiable. That is why our community trades on Exness.
        </p>
      </section>

      {/* Broker Bento Grid */}
      <section className="px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Broker Info Card */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Abstract Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40 grid-bg-subtle" />

            <div className="relative z-10">
              {/* Top row with Exness Logo & clean status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <ExnessLogo size="lg" />

                <div className="flex gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-[#EBF3FF] text-[#0053CF] px-3 py-1 rounded-md text-[12px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Regulated</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#EBF3FF] text-[#0053CF] px-3 py-1 rounded-md text-[12px] font-semibold">
                    <Lock className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Trusted</span>
                  </span>
                </div>
              </div>

              {/* Core Benefits & Exness Main Brand Thumbnail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-center">
                {/* Benefits List */}
                <div className="lg:col-span-6 space-y-3">
                  <h3 className="font-manrope text-[15px] font-bold text-[#091C35] uppercase tracking-wider mb-2">
                    Benefits of Using Exness
                  </h3>
                  <ul className="space-y-3 font-inter text-[14px] sm:text-[14.5px] text-[#181C20]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Ultra-low raw spreads starting from 0.0 pips</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Instant 24/7 automated withdrawals with zero delay</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>0% deposit and withdrawal commission fees</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Sub-millisecond execution with zero requotes</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                      <span>Multi-regulated Tier-1 security (FCA, CySEC, FSCA)</span>
                    </li>
                  </ul>
                </div>

                {/* Exness Main Brand Logo & Graphic Thumbnail */}
                <div className="lg:col-span-6">
                  <ExnessBrandCard />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 pt-6 border-t border-[#F1F4F9] flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onOpenBrokerModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-8 py-3.5 rounded-xl font-inter text-[15px] font-semibold glow-blue transition-all cursor-pointer shadow-md"
              >
                <span>Open Exness Account</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTelegram}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#44474D] hover:text-[#091C35] px-4 py-2 font-inter text-[14px] font-medium cursor-pointer"
              >
                <span>Need setup help? Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Column Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Regulation Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3 text-[#091C35]">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
                    <Gavel className="w-5 h-5" />
                  </div>
                  <h3 className="font-manrope text-[20px] font-bold">Tier-1 Regulated</h3>
                </div>
                <p className="font-inter text-[14px] text-[#44474D] leading-relaxed mb-4">
                  Multi-regulated and globally compliant, ensuring segregated client funds and strict financial oversight.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#F1F4F9]">
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  FCA
                </span>
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  CySEC
                </span>
                <span className="bg-[#F1F4F9] border border-[#E5E8ED] px-3 py-1 rounded text-[12px] font-bold text-[#091C35]">
                  FSCA
                </span>
              </div>
            </div>

            {/* Lightning Execution Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3 text-[#091C35]">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-manrope text-[20px] font-bold">Lightning Execution</h3>
                </div>
                <p className="font-inter text-[14px] text-[#44474D] leading-relaxed mb-4">
                  Capitalize on market movements with ultra-fast order execution and deep institutional liquidity.
                </p>
              </div>

              <div className="flex items-baseline gap-2 text-[#0053CF] pt-2 border-t border-[#F1F4F9]">
                <span className="font-manrope text-[30px] font-extrabold tracking-tight">&lt; 0.01s</span>
                <span className="font-inter text-[12px] text-[#44474D]">Avg. Execution Speed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
