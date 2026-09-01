import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Official Telegram Logo SVG
export const TelegramLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="12" fill="#24A1DE" />
    <path 
      d="M5.4 11.9c3.9-1.7 6.5-2.8 7.8-3.4 3.7-1.5 4.5-1.8 5-1.8.1 0 .4 0 .5.1.2.1.2.3.2.4 0 .2 0 .4-.1.7l-2.4 11.3c-.2.8-.6 1-1.3.6l-3.6-2.7-1.7 1.7c-.2.2-.4.3-.7.3l.3-3.7 6.7-6.1c.3-.3-.1-.4-.4-.2L7.5 13.5l-3.6-1.1c-.8-.2-.8-.8.2-1.2l1.3.7z" 
      fill="#ffffff" 
    />
  </svg>
);

// Official Instagram Logo SVG
export const InstagramLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
    <path 
      d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.2c-1.8 0-3.2-1.4-3.2-3.2S10.2 8.8 12 8.8s3.2 1.4 3.2 3.2-1.4 3.2-3.2 3.2zm6-8.4c0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2 1.2.5 1.2 1.2z" 
      fill="#ffffff" 
    />
    <path 
      d="M17.5 4H6.5C5.1 4 4 5.1 4 6.5v11C4 18.9 5.1 20 6.5 20h11c1.4 0 2.5-1.1 2.5-2.5v-11C20 5.1 18.9 4 17.5 4zm1 13.5c0 .6-.4 1-1 1H6.5c-.6 0-1-.4-1-1v-11c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v11z" 
      fill="#ffffff" 
    />
  </svg>
);

// Official YouTube Logo SVG
export const YouTubeLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    aria-hidden="true"
  >
    <path 
      d="M23.5 6.2c-.3-1.1-1.1-1.9-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6c-1 .2-1.8 1-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1.1 1.1 1.9 2.1 2.1 1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6c1-.2 1.8-1 2.1-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z" 
      fill="#FF0000" 
    />
    <polygon points="9.5,15.6 15.8,12 9.5,8.4" fill="#ffffff" />
  </svg>
);

// Official TikTok Logo SVG
export const TikTokLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    aria-hidden="true"
  >
    <rect width="24" height="24" rx="5" fill="#000000" />
    <path 
      d="M16.6 8.2c-.9-.6-1.5-1.5-1.6-2.5h-2.4v10.6c0 1.5-1.2 2.7-2.7 2.7S7.2 17.8 7.2 16.3s1.2-2.7 2.7-2.7c.3 0 .6.1.9.2V11c-.3 0-.6-.1-.9-.1-2.9 0-5.2 2.3-5.2 5.2s2.3 5.2 5.2 5.2 5.2-2.3 5.2-5.2V9.8c1.1.8 2.5 1.2 3.9 1.2V8.6c-.9 0-1.7-.1-2.4-.4z" 
      fill="#25F4EE" 
    />
    <path 
      d="M17.4 8.7c-.9-.6-1.5-1.5-1.6-2.5h-1.6v10.6c0 1.5-1.2 2.7-2.7 2.7-1.1 0-2.1-.7-2.5-1.7.3.1.7.1 1 .1 1.5 0 2.7-1.2 2.7-2.7V3.8h2.4c.1 1.2.7 2.3 1.7 2.9l.6 2z" 
      fill="#FE2C55" 
    />
    <path 
      d="M16.9 8.4c-.9-.6-1.5-1.5-1.6-2.5h-2.1v10.6c0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7c.3 0 .6.1.9.2V11.4c-.3 0-.6-.1-.9-.1-2.9 0-5.2 2.3-5.2 5.2s2.3 5.2 5.2 5.2 5.2-2.3 5.2-5.2V9.8c1.1.8 2.5 1.2 3.9 1.2V8.6c-.9 0-1.8-.1-2.4-.4z" 
      fill="#ffffff" 
    />
  </svg>
);

// Official Snapchat Logo SVG (Exact Official Vector from Snapchat Brand Guidelines)
export const SnapchatLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={className} 
    fill="none"
    aria-hidden="true"
  >
    <rect width="24" height="24" rx="5.5" fill="#FFFC00" />
    <g transform="translate(1.8, 1.8) scale(0.85)">
      <path 
        d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" 
        fill="#ffffff" 
        stroke="#000000" 
        strokeWidth="1.2" 
        strokeLinejoin="round" 
        strokeLinecap="round" 
      />
    </g>
  </svg>
);

