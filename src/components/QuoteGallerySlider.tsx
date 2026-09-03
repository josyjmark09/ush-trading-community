import React, { useRef, useEffect, useState } from 'react';
import { QuoteGallerySettings, QuoteItem } from '../types';
import { 
  Quote, 
  Sparkles, 
  Download, 
  Share2, 
  Check, 
  Mail,
  Copy
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import ushLogoPng from './ush logo.png';
import logoSvg from './image 1.svg';

interface QuoteGallerySliderProps {
  gallery: QuoteGallerySettings;
  galleryId: string;
}

export const QuoteGallerySlider: React.FC<QuoteGallerySliderProps> = ({ 
  gallery, 
  galleryId 
}) => {
  const { settings } = useSite();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isHoldingRef = useRef(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const quotes = gallery.quotes || [];
  // Duplicate array so it continuously loops with zero seam
  const duplicatedQuotes = [...quotes, ...quotes];

  const effectiveLogo = settings.branding?.logoUrl || ushLogoPng || logoSvg || '/ush-logo.png';
  const brandName = settings.branding?.brandName || 'Community of Traders';
  const targetEmail = settings.social?.supportEmail || 'ushforex@gmail.com';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Silky smooth continuous animation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || quotes.length === 0) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speedPixelsPerSecond = 42; // lively, legible, continuous gliding

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!isHoveredRef.current && !isHoldingRef.current) {
        container.scrollLeft += speedPixelsPerSecond * delta;

        // When we have scrolled past the first set, reset seamlessly
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [quotes.length]);

  // High-Resolution 1080x1080 Canvas Download
  const handleDownloadCard = async (item: QuoteItem, index: number) => {
    const cardId = item.id || `quote-${index}`;
    setDownloadingId(cardId);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        showToast('Unable to generate card image');
        setDownloadingId(null);
        return;
      }

      // 1. Luxury Dark Obsidian / Emerald Slate Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
      bgGrad.addColorStop(0, '#090E17');
      bgGrad.addColorStop(0.45, '#0E1726');
      bgGrad.addColorStop(1, '#080C14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // 2. Soft Ambient Radial Glow
      const glowGrad = ctx.createRadialGradient(540, 480, 60, 540, 480, 520);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      glowGrad.addColorStop(0.5, 'rgba(0, 83, 207, 0.10)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1080, 1080);

      // 3. Double Luxury Border Frame
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 984, 984);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(60, 60, 960, 960);

      // 4. Header: Draw Official Logo in Black & White with "Community of Traders"
      const displayNum = (item.number || (index % quotes.length) + 1).toString().padStart(2, '0');

      // Attempt to load official logo image onto canvas
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = effectiveLogo;
        });

        if (img.complete && img.naturalWidth > 0) {
          ctx.save();
          // Black and white high-contrast filter on canvas
          ctx.filter = 'grayscale(100%) contrast(140%) brightness(110%)';
          const targetH = 60;
          const targetW = (img.naturalWidth / img.naturalHeight) * targetH;
          const drawW = Math.min(targetW, 110);
          ctx.drawImage(img, 80, 100, drawW, targetH);
          ctx.restore();

          // Brand Title written exactly like top left corner
          ctx.textAlign = 'left';
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 32px system-ui, -apple-system, sans-serif';
          ctx.fillText(brandName, 80 + drawW + 18, 136);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '700 14px system-ui, -apple-system, sans-serif';
          ctx.fillText('OFFICIAL TRADER CREED', 80 + drawW + 18, 160);
        } else {
          // Fallback typography
          ctx.textAlign = 'left';
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 32px system-ui, -apple-system, sans-serif';
          ctx.fillText(brandName, 100, 140);
        }
      } catch {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 32px system-ui, -apple-system, sans-serif';
        ctx.fillText(brandName, 100, 140);
      }

      // Top-Right Luxury Number
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '700 28px "Courier New", monospace';
      ctx.fillText(`N° ${displayNum}`, 980, 140);

      // Quotation Mark Vector
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0, 83, 207, 0.65)';
      ctx.font = '900 120px Georgia, serif';
      ctx.fillText('“', 540, 340);

      // Quote Text Body with Text Wrapping
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 40px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';

      const words = item.quote.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = 840;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = 60;
      const startY = 500 - (lines.length * lineHeight) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].trim(), 540, startY + i * lineHeight);
      }

      // Elegant Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(200, 840);
      ctx.lineTo(880, 840);
      ctx.stroke();

      // Footer: Author "USH Community of Traders" & Email
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 30px system-ui, -apple-system, sans-serif';
      ctx.fillText('USH Community of Traders', 540, 890);

      ctx.fillStyle = '#60A5FA';
      ctx.font = '700 20px "Courier New", monospace';
      ctx.fillText(targetEmail, 540, 928);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillText('Official Telegram: t.me/+wHFuFFkA2i0xZTA8', 540, 964);

      // Download file
      const link = document.createElement('a');
      link.download = `USH-Community-of-Traders-Quote-${displayNum}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast(`Downloaded Quote N° ${displayNum}!`);
    } catch (e) {
      console.error('Error generating card image:', e);
      showToast('Error generating image');
    } finally {
      setDownloadingId(null);
    }
  };

  // Web Share or Clipboard Copy
  const handleShareQuote = async (item: QuoteItem) => {
    const displayNum = item.number ? item.number.toString().padStart(2, '0') : 'Wisdom';
    const shareText = `"${item.quote}"\n\n— USH Community of Traders (${targetEmail})\n\nJoin our trading community: https://t.me/+wHFuFFkA2i0xZTA8`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `USH Community of Traders Wisdom N° ${displayNum}`,
          text: shareText,
          url: 'https://t.me/+wHFuFFkA2i0xZTA8',
        });
        showToast('Shared successfully!');
        return;
      } catch {
        // User dismissed or aborted share
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Quote copied to clipboard!');
    } catch {
      showToast('Could not copy to clipboard');
    }
  };

  return (
    <section 
      id={galleryId} 
      className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 scroll-mt-24 select-none relative"
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-[13px] font-bold animate-soft-fade">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Container - Clean & Luxury */}
      <div className="mb-6 sm:mb-8 text-left space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] sm:text-[12px] font-black text-slate-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#0053CF]" />
          <span>{gallery.sectionBadge || 'TRADING WISDOM'}</span>
        </div>

        <h2 className="font-manrope text-[23px] sm:text-[29px] md:text-[34px] font-black text-slate-900 leading-tight tracking-tight">
          {gallery.title}
        </h2>

        <p className="font-inter text-[13px] sm:text-[14.5px] text-slate-600 leading-relaxed">
          {gallery.subtitle}
        </p>
      </div>

      {/* Continuous Silky Slider Viewport */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        onTouchStart={() => { isHoldingRef.current = true; }}
        onTouchEnd={() => { isHoldingRef.current = false; }}
        className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-6 pt-3 px-2 no-scrollbar focus:outline-hidden cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedQuotes.map((item, idx) => {
          const displayNum = item.number 
            ? item.number.toString().padStart(2, '0') 
            : ((idx % quotes.length) + 1).toString().padStart(2, '0');

          return (
            <div
              key={`${item.id || 'quote'}-${idx}`}
              className="group relative shrink-0 w-[300px] sm:w-[350px] md:w-[380px] transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Layered Luxury Accent Shape Behind Card */}
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/85 to-green-500/85 translate-x-1.5 translate-y-1.5 opacity-85 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none"
              />

              {/* Main Luxury White Card with Soft Inner Shader */}
              <div
                className="relative w-full h-full rounded-3xl p-5 sm:p-7 flex flex-col justify-between min-h-[270px] sm:min-h-[290px] bg-white border border-slate-200 shadow-md group-hover:border-slate-300 transition-all duration-300"
                style={{
                  background: 'radial-gradient(circle at 50% 12%, #ffffff 0%, #fcfdfd 60%, #f0f7f3 100%)'
                }}
              >
                {/* Top Row: Official Logo in Black & White on Left, Luxury Number on Right */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  {/* Real Logo in Black & White + Brand matching top-left corner */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={effectiveLogo} 
                      alt="Community of Traders Logo" 
                      className="h-8 sm:h-9 w-auto max-h-9 object-contain shrink-0 grayscale contrast-125 brightness-95" 
                    />
                    <div className="flex flex-col justify-center text-left min-w-0">
                      <span className="font-manrope text-[13px] sm:text-[14px] font-black tracking-tight text-slate-900 leading-tight truncate">
                        {brandName}
                      </span>
                      {settings.branding?.tagline ? (
                        <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                          {settings.branding.tagline}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Luxury Counting Number (No Hash Tags) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-[11px] sm:text-[12px] font-bold text-slate-700 px-2.5 py-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                      {displayNum}
                    </span>
                  </div>
                </div>

                {/* Cyan / Azure Quotation Mark Icon */}
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0053CF] shadow-2xs mb-2">
                  <Quote className="w-3.5 h-3.5 fill-[#0053CF] rotate-180" />
                </div>

                {/* Main Quote Text */}
                <div className="my-auto py-1.5 text-center">
                  <p className="font-manrope text-[14.5px] sm:text-[16.5px] md:text-[17.5px] font-extrabold text-slate-900 leading-[1.65] tracking-tight">
                    “{item.quote}”
                  </p>
                </div>

                {/* Bottom Row: Author USH Community of Traders, Email & Action Icons (Download & Share) */}
                <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-slate-100/90 gap-2">
                  {/* Left: Author & Contact Email */}
                  <div className="text-left min-w-0">
                    <p className="font-manrope text-[12px] sm:text-[13px] font-black text-slate-900 leading-tight truncate">
                      USH Community of Traders
                    </p>
                    <p className="font-mono text-[10.5px] sm:text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                      {targetEmail}
                    </p>
                  </div>

                  {/* Right: Download and Share Action Icons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Download Icon Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCard(item, idx);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
                      title="Download Quote Card as Image"
                      aria-label="Download Quote Card"
                      disabled={downloadingId === (item.id || `quote-${idx}`)}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Share Icon Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareQuote(item);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0053CF] border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
                      title="Share Quote"
                      aria-label="Share Quote"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
