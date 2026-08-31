import React from 'react';
import exnessLogoImg from './Abandoned Baby Candlestick Pattern _ Best Forex Brokers For Scalping.jpg';
import exnessThumbnailImg from './Online trading platform for global markets _ Exness.jpg';

interface ExnessLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}

export const ExnessLogo: React.FC<ExnessLogoProps> = ({ 
  className = '', 
  size = 'md',
  showName = true,
}) => {
  const imgSizeMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-14',
  };

  const textSizeMap = {
    sm: 'text-[18px]',
    md: 'text-[22px]',
    lg: 'text-[24px] sm:text-[28px]',
    xl: 'text-[28px] sm:text-[32px]',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src={exnessLogoImg}
        alt="Exness Logo"
        className={`${imgSizeMap[size]} w-auto object-contain rounded-lg shadow-2xs`}
        loading="lazy"
      />
      {showName && (
        <div className="flex flex-col">
          <span className={`font-manrope font-extrabold text-[#091C35] tracking-tight leading-none ${textSizeMap[size]}`}>
            exness
          </span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-0.5 font-inter">
            Recommended Broker
          </span>
        </div>
      )}
    </div>
  );
};

export const ExnessBrandCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full min-h-[190px] sm:min-h-[220px] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-slate-900 flex items-center justify-center ${className}`}>
      <img
        src={exnessThumbnailImg}
        alt="Exness Review"
        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
};
