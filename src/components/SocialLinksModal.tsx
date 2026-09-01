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
    renderLogo: (sizeClass = 'w-12 h-12') => <YouTubeLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Forex 01',
        url: 'https://youtube.com/@ushforex01?si=W3LngDqtaJiICbqe',
      },
      {
        title: 'USH Forx 2',
        url: 'https://youtube.com/@ushforx?si=yv8yo6oll9BVu41D',
      },
      {
        title: 'Kings Forex',
        url: 'https://youtube.com/@kingsforex01?si=h1Bpgp3kM1XSWuzt',
      }
    ]
  },
  tiktok: {
    name: 'TikTok',
    renderLogo: (sizeClass = 'w-12 h-12') => <TikTokLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Forex',
        url: 'https://www.tiktok.com/@ush.forex?_r=1&_t=ZS-99MCYEw58JZ',
      },
      {
        title: 'USH Forex Official',
        url: 'https://www.tiktok.com/@ushforex?_r=1&_t=ZS-99ME9hRNyDd',
      },
      {
        title: 'Kings Forex',
        url: 'https://www.tiktok.com/@kingsforex01?_r=1&_t=ZS-99Mkdg1J4Oz',
      }
    ]
  },
  instagram: {
    name: 'Instagram',
    renderLogo: (sizeClass = 'w-12 h-12') => <InstagramLogo className={sizeClass} />,
    channels: [
      {
        title: 'Kings Forex',
        url: 'https://www.instagram.com/kingsforex01?igsi=OG8ydWJ1ZHFsMHk5&utm_source=qr',
      },
      {
        title: 'USH FX',
        url: 'https://www.instagram.com/ush.fx?igsi=MTEwZHJrcTljMDMyNw==',
      }
    ]
  },
  snapchat: {
    name: 'Snapchat',
    renderLogo: (sizeClass = 'w-12 h-12') => <SnapchatLogo className={sizeClass} />,
    channels: [
      {
        title: 'Kings Trader',
        url: 'https://www.snapchat.com/add/kingstrader?share_id=fmGNTTpNRt2kevVID5coag&locale=en_NG',
      },
      {
        title: 'Kings Snapchat 2',
        url: 'https://snapchat.com/t/ZKRE8Ycf',
      }
    ]
  },
  telegram: {
    name: 'Telegram',
    renderLogo: (sizeClass = 'w-12 h-12') => <TelegramLogo className={sizeClass} />,
    channels: [
      {
        title: 'USH Forex Community',
        url: 'https://t.me/+wHFuFFkA2i0xZTA8',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-soft-fade"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <h2 className="font-manrope text-base sm:text-lg font-black text-slate-900">
            {data.name}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Grid: Just Logo with Name under it */}
        <div className={`grid gap-3.5 ${data.channels.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {data.channels.map((channel, idx) => (
            <a
              key={idx}
              href={channel.url}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/90 hover:border-slate-400 transition-all group cursor-pointer active:scale-95 text-center shadow-xs hover:shadow-md"
            >
              {/* Main Company Logo */}
              <div className="mb-2.5 transition-transform group-hover:scale-110">
                {data.renderLogo('w-11 h-11 drop-shadow-xs')}
              </div>

              {/* Name of that specific social directly under it */}
              <span className="font-manrope text-[13px] font-bold text-slate-900 group-hover:text-[#0053CF] transition-colors leading-tight">
                {channel.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
