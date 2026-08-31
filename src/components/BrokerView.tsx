import React from 'react';
import { NavTab } from '../types';
import { APP_IMAGES } from '../data/mockData';
import { 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Gavel, 
  Zap, 
  ExternalLink, 
  Layers, 
  DollarSign,
  Lock,
  Smartphone
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
    <div className="w-full flex flex-col gap-10 md:gap-14 pt-4 pb-12">
      {/* Header Section */}
      <section className="text-center px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <span className="inline-block bg-[#EBF3FF] text-[#0053CF] font-inter text-[12px] font-bold py-1 px-3.5 rounded uppercase tracking-wider mb-3">
          BROKER PARTNER
        </span>
        <h1 className="font-manrope text-[32px] sm:text-[42px] md:text-[48px] font-extrabold text-[#091C35] mb-3 tracking-tight leading-[1.15]">
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
          <div className="md:col-span-8 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Abstract Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-40 grid-bg-subtle" />

            <div className="relative z-10">
              {/* Top row with logo & clean inline status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-32 h-12 flex items-center justify-center bg-[#F1F4F9] rounded-xl px-3 border border-[#E2E8F0]">
                    <span className="font-manrope text-[24px] font-extrabold text-[#091C35] tracking-tight">
                      exness
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Official Partner
                  </span>
                </div>

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

              {/* Core Features & Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-center">
                <ul className="space-y-4 font-inter text-[15px] text-[#181C20]">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0053CF] mt-0.5 shrink-0" />
                    <span className="font-medium">Regulated by FCA, CySEC, FSCA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0053CF] mt-0.5 shrink-0" />
                    <span className="font-medium">Raw spreads starting from 0.0 pips</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0053CF] mt-0.5 shrink-0" />
                    <span className="font-medium">Fast execution with zero requotes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0053CF] mt-0.5 shrink-0" />
                    <span className="font-medium">Instant local & crypto withdrawals</span>
                  </li>
                </ul>

                <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] shadow-inner bg-[#091C35] h-48 md:h-full min-h-[160px]">
                  <img
                    src={APP_IMAGES.brokerCharts}
                    alt="Exness Trading Platform"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091C35] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-[12px] font-inter">
                    <span className="font-bold">MT4 / MT5 / WebTerminal</span>
                  </div>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#44474D] hover:text-[#091C35] px-4 py-2 font-inter text-[14px] font-medium"
              >
                <span>Need setup help? Contact Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side Column Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Regulation Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3 text-[#091C35]">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
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
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-3 text-[#091C35]">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF3FF] flex items-center justify-center text-[#0053CF]">
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
