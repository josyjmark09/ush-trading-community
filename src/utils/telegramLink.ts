import type React from 'react';

/**
 * Robust Telegram Link Handler for iOS, Android, and Desktop
 * 
 * Fixes the notorious iOS Safari "Blank Black Page" bug:
 * On iOS, opening Telegram universal links or deep links via `target="_blank"`
 * causes Safari to spawn a new empty tab that stays black in Dark Mode.
 * Navigating via `_self` (or window.location.href) allows iOS to natively
 * intercept the Universal Link and prompt "Open in 'Telegram'?" seamlessly
 * without creating an orphaned blank black tab.
 */

export const DEFAULT_TELEGRAM_URL = 'https://t.me/+wHFuFFkA2i0xZTA8';

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent || '') || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return isIOSDevice() || /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
}

/**
 * Safely opens a Telegram channel or invite link across all devices.
 * Eliminates the iOS Safari "black blank tab" bug and ensures instant native
 * app handoff on iOS, iPadOS, Android, and Desktop.
 */
export function openTelegram(
  url: string = DEFAULT_TELEGRAM_URL,
  e?: React.MouseEvent
): void {
  if (e) {
    e.preventDefault();
  }

  const cleanUrl = url?.trim() || DEFAULT_TELEGRAM_URL;

  // On Mobile & iOS devices:
  // Using direct navigation (_self) allows iOS Safari and Android Chrome to natively 
  // trigger the "Open in Telegram" OS modal without creating an orphaned blank black tab.
  if (isIOSDevice() || isMobileDevice()) {
    try {
      // If inside an iframe (e.g. preview, embedded in-app browser), break out to top window
      if (window.top && window.top !== window.self) {
        window.top.location.href = cleanUrl;
        return;
      }
    } catch {
      // Cross-origin iframe fallback
    }

    window.location.href = cleanUrl;
  } else {
    // Desktop: standard safe new tab opening with fallback
    const win = window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      window.location.href = cleanUrl;
    }
  }
}
