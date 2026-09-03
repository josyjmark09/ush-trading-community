import React from 'react';
import { X } from 'lucide-react';
import { 
  YouTubeLogo, 
  InstagramLogo, 
  TikTokLogo, 
  SnapchatLogo, 
  TelegramLogo 
} from './SocialIcons';

export type SocialPlatformType = 'youtube' | 'tiktok' | 'instagram' | 'snapchat' | 'telegram';

export interface SocialChannelOption {
  title: string;
  url: string;
  isMain?: boolean;
}

interface SocialLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: SocialPlatformType | null;
}

export const SOCIAL_CHANNELS_DATA: Record<SocialPlatformType, {
  name: string;
  renderLogo: (sizeClass?: string) => React.ReactNode;
  channels: SocialChannelOption[];
}> = {
  youtube: {
    name: 'YouTube',
    renderLogo: (sizeClass = 'w-11 h-11') => <YouTubeLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Forex 01',
        url: 'https://youtube.com/@ushforex01?si=W3LngDqtaJiICbqe',
        isMain: true,
      },
      {
        title: 'USH Forx 2',
        url: 'https://youtube.com/@ushforx?si=yv8yo6oll9BVu41D',
        isMain: false,
      },
      {
        title: 'Kings Forex',
        url: 'https://youtube.com/@kingsforex01?si=h1Bpgp3kM1XSWuzt',
        isMain: false,
      }
    ]
  },
  tiktok: {
    name: 'TikTok',
    renderLogo: (sizeClass = 'w-11 h-11') => <TikTokLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Forex',
        url: 'https://www.tiktok.com/@ush.forex?_r=1&_t=ZS-99MCYEw58JZ',
        isMain: true,
      },
      {
        title: 'USH Forex Official',
        url: 'https://www.tiktok.com/@ushforex?_r=1&_t=ZS-99ME9hRNyDd',
        isMain: false,
      },
      {
        title: 'Kings Forex',
        url: 'https://www.tiktok.com/@kingsforex01?_r=1&_t=ZS-99Mkdg1J4Oz',
        isMain: false,
      }
    ]
  },
  instagram: {
    name: 'Instagram',
    renderLogo: (sizeClass = 'w-11 h-11') => <InstagramLogo className={sizeClass} />,
    channels: [
      {
        title: 'Kings Forex',
        url: 'https://www.instagram.com/kingsforex01?igsi=OG8ydWJ1ZHFsMHk5&utm_source=qr',
        isMain: true,
      },
      {
        title: 'USH FX',
        url: 'https://www.instagram.com/ush.fx?igsi=MTEwZHJrcTljMDMyNw==',
        isMain: false,
      }
    ]
  },
  snapchat: {
    name: 'Snapchat',
    renderLogo: (sizeClass = 'w-11 h-11') => <SnapchatLogo className={sizeClass} />,
    channels: [
      {
        title: 'Kings Trader',
        url: 'https://www.snapchat.com/add/kingstrader?share_id=fmGNTTpNRt2kevVID5coag&locale=en_NG',
        isMain: true,
      },
      {
        title: 'Kings Snapchat 2',
        url: 'https://snapchat.com/t/ZKRE8Ycf',
        isMain: false,
      }
    ]
  },
  telegram: {
    name: 'Telegram',
    renderLogo: (sizeClass = 'w-11 h-11') => <TelegramLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Community of Traders',
        url: 'https://t.me/+wHFuFFkA2i0xZTA8',
        isMain: true,
      }
    ]
  }
};

export const SocialLinksModal: React.FC<SocialLinksModalProps> = ({
  isOpen,
  onClose,
  platform
}) => {
  if (!isOpen || !platform) return null;

  const data = SOCIAL_CHANNELS_DATA[platform];
  if (!data) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-soft-fade"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-sm sm:max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h2 className="font-manrope text-base sm:text-lg font-black text-slate-900">
              {data.name} Accounts
            </h2>
            <p className="font-inter text-[11.5px] sm:text-[12.5px] text-slate-500">
              Tap to open channel or backup handle
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Grid: Mobile stacked list / desktop side-by-side */}
        <div className={`grid gap-2.5 sm:gap-3 ${data.channels.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {data.channels.map((channel, idx) => (
            <a
              key={idx}
              href={channel.url}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border transition-all group cursor-pointer active:scale-98 text-center ${
                channel.isMain 
                  ? 'bg-blue-50/50 border-[#0053CF] shadow-xs hover:bg-blue-50/80 hover:shadow-md ring-1 ring-[#0053CF]/20' 
                  : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* "Main Account" written right on top */}
              <div className="mb-2">
                <span className={`inline-block text-[10px] sm:text-[10.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  channel.isMain 
                    ? 'bg-[#0053CF] text-white shadow-2xs' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {channel.isMain ? 'Main Account' : 'Backup Account'}
                </span>
              </div>

              {/* Logo */}
              <div className="mb-2 transition-transform group-hover:scale-105">
                {data.renderLogo('w-10 h-10 sm:w-11 sm:h-11 drop-shadow-xs')}
              </div>

              {/* Account Title */}
              <span className={`font-manrope text-[13.5px] sm:text-[14px] font-bold leading-tight ${
                channel.isMain ? 'text-[#0053CF]' : 'text-slate-900 group-hover:text-[#0053CF]'
              }`}>
                {channel.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
