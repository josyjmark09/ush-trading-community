import React from 'react';
import exnessLogoUploadedImg from './Online trading platform for global markets _ Exness (1).jpg';
import exnessThumbnailImg from './Online trading platform for global markets _ Exness.jpg';

interface ExnessLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showSubtitle?: boolean;
  textColor?: string;
}

export const ExnessEmblem: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-6',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-14',
  };

  return (
    <img
      src={exnessLogoUploadedImg}
      alt="Exness Logo"
      className={`${sizeMap[size]} w-auto object-contain shrink-0 ${className}`}
      loading="eager"
    />
  );
};

export const ExnessLogo: React.FC<ExnessLogoProps> = ({ 
  className = '', 
  size = 'md',
  showName = true,
  showSubtitle = true,
}) => {
  const imgHeightMap = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-15',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Uploaded official Exness Logo image */}
      <img
        src={exnessLogoUploadedImg}
        alt="Exness"
        className={`${imgHeightMap[size]} w-auto max-w-[200px] sm:max-w-[260px] object-contain shrink-0`}
        loading="eager"
      />

      {showSubtitle && (
        <div className="hidden sm:flex flex-col border-l border-slate-300 pl-3">
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider font-inter">
            Partner Broker
          </span>
          <span className="text-[11px] font-bold text-slate-500 font-inter">
            Raw Zero Spreads
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
        alt="Exness Platform"
        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
};

