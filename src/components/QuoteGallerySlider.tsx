import React, { useRef, useEffect, useState } from 'react';
import { QuoteGallerySettings, QuoteItem } from '../types';
import { 
  Quote, 
  Sparkles, 
  Download, 
  Share2, 
  Check, 
  Loader2
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
  const [sharingId, setSharingId] = useState<string | null>(null);

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
    const speedPixelsPerSecond = 42; // lively, continuous gliding

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

  // Helper function to draw rounded rectangle on Canvas
  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Generate High-Resolution 1080x1080 Quote Card Canvas
  // Redesigned to 1:1 match the luxury card on the website with deep sapphire studio atmosphere
  const generateCardCanvas = async (item: QuoteItem, index: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // 1. Luxury Royal Sapphire Studio Atmosphere
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGrad.addColorStop(0, '#040B18');
    bgGrad.addColorStop(0.3, '#081D3E');
    bgGrad.addColorStop(0.65, '#002B66');
    bgGrad.addColorStop(1, '#030812');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Soft Ambient Radial Glow
    const glowGrad = ctx.createRadialGradient(540, 520, 60, 540, 520, 560);
    glowGrad.addColorStop(0, 'rgba(0, 83, 207, 0.35)');
    glowGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.16)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 3. Luxury Outer Studio Border Trims
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 1008, 1008);

    ctx.strokeStyle = 'rgba(0, 83, 207, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, 988, 988);

    // Header Tagline in Studio Frame
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('USH COMMUNITY OF TRADERS  •  OFFICIAL TRADER CREED', 540, 82);

    // 4. Dimensions of the Centered Luxury Card
    const cardW = 900;
    const cardH = 800;
    const cardX = 90;
    const cardY = 125;
    const cornerR = 36;

    // Layer A: Signature Emerald Offset Accent Layer (1:1 with website)
    const offX = 14;
    const offY = 14;
    const greenGrad = ctx.createLinearGradient(
      cardX + offX, 
      cardY + offY, 
      cardX + offX + cardW, 
      cardY + offY + cardH
    );
    greenGrad.addColorStop(0, '#059669');
    greenGrad.addColorStop(1, '#10B981');
    ctx.fillStyle = greenGrad;
    ctx.globalAlpha = 0.88;
    drawRoundRect(ctx, cardX + offX, cardY + offY, cardW, cardH, cornerR);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Layer B: Main Luxury White Card with Soft Radial Shader
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 16;
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, cornerR);
    const cardGrad = ctx.createRadialGradient(
      cardX + cardW / 2, 
      cardY + 80, 
      40, 
      cardX + cardW / 2, 
      cardY + cardH / 2, 
      cardW * 0.7
    );
    cardGrad.addColorStop(0, '#FFFFFF');
    cardGrad.addColorStop(0.6, '#FCFDFD');
    cardGrad.addColorStop(1, '#F0F7F3');
    ctx.fillStyle = cardGrad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(226, 232, 240, 0.95)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 5. Card Header: B&W Official Logo + Community of Traders + Card Number
    const displayNum = (item.number || (index % quotes.length) + 1).toString().padStart(2, '0');
    const headerY = cardY + 48;
    let loadedImg: HTMLImageElement | null = null;

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = effectiveLogo;
      });

      if (img.complete && img.naturalWidth > 0) {
        loadedImg = img;
        ctx.save();
        ctx.filter = 'grayscale(100%) contrast(140%) brightness(95%)';
        const targetH = 58;
        const targetW = (img.naturalWidth / img.naturalHeight) * targetH;
        const drawW = Math.min(targetW, 110);
        ctx.drawImage(img, cardX + 50, headerY, drawW, targetH);
        ctx.restore();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 28px system-ui, -apple-system, sans-serif';
        ctx.fillText(brandName, cardX + 50 + drawW + 18, headerY + 34);

        ctx.fillStyle = '#64748B';
        ctx.font = '700 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('OFFICIAL TRADER CREED', cardX + 50 + drawW + 18, headerY + 54);
      } else {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 28px system-ui, -apple-system, sans-serif';
        ctx.fillText(brandName, cardX + 50, headerY + 36);
      }
    } catch {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.fillText(brandName, cardX + 50, headerY + 36);
    }

    // Top-Right Luxury Editorial Number (Playfair Display)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '400 38px "Playfair Display", Georgia, serif';
    ctx.fillText(displayNum, cardX + cardW - 50, headerY + 44);

    // 6. Azure Quotation Mark Icon Container (1:1 with site)
    const quoteIconX = cardX + 50;
    const quoteIconY = headerY + 84;
    drawRoundRect(ctx, quoteIconX, quoteIconY, 46, 46, 12);
    ctx.fillStyle = '#EFF6FF';
    ctx.fill();
    ctx.strokeStyle = '#DBEAFE';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0053CF';
    ctx.font = '900 36px Georgia, serif';
    ctx.fillText('“', quoteIconX + 23, quoteIconY + 35);

    // 6.5. Watermark of USH Logo in the middle behind text (Clean B&W with reduced opacity)
    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.08; // Clean subtle watermark opacity
      ctx.filter = 'grayscale(100%) contrast(125%) brightness(95%)'; // Clean black & white
      const watermarkH = 270;
      const watermarkW = (loadedImg.naturalWidth / loadedImg.naturalHeight) * watermarkH;
      const wmX = cardX + (cardW - watermarkW) / 2;
      const wmY = cardY + 440 - watermarkH / 2;
      ctx.drawImage(loadedImg, wmX, wmY, watermarkW, watermarkH);
      ctx.restore();
    }

    // 7. Main Quote Text (Centered & Balanced)
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 38px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';

    const words = item.quote.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxTextW = 780;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextW && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 58;
    const quoteCenterY = cardY + 440;
    const startY = quoteCenterY - ((lines.length - 1) * lineHeight) / 2;
    for (let i = 0; i < lines.length; i++) {
      const isFirst = i === 0;
      const isLast = i === lines.length - 1;
      let textToRender = lines[i].trim();
      if (isFirst && !textToRender.startsWith('“') && !textToRender.startsWith('"')) {
        textToRender = '“' + textToRender;
      }
      if (isLast && !textToRender.endsWith('”') && !textToRender.endsWith('"')) {
        textToRender = textToRender + '”';
      }
      ctx.fillText(textToRender, cardX + cardW / 2, startY + i * lineHeight);
    }

    // 8. Elegant Divider Line
    const divY = cardY + cardH - 126;
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cardX + 50, divY);
    ctx.lineTo(cardX + cardW - 50, divY);
    ctx.stroke();

    // 9. Footer: Author "USH Community of Traders" & Verified Channel
    const footerY = divY + 44;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 23px system-ui, -apple-system, sans-serif';
    ctx.fillText('USH Community of Traders', cardX + 50, footerY);

    ctx.fillStyle = '#0053CF';
    ctx.font = '700 15px "Courier New", monospace';
    ctx.fillText(targetEmail, cardX + 50, footerY + 24);

    // Right Footer Pill: Telegram Verified Channel
    const tgPillW = 270;
    const tgPillH = 38;
    const tgPillX = cardX + cardW - 50 - tgPillW;
    const tgPillY = footerY - 16;
    drawRoundRect(ctx, tgPillX, tgPillY, tgPillW, tgPillH, 19);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#0053CF';
    ctx.font = '700 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('Official Telegram Community', tgPillX + tgPillW / 2, tgPillY + 24);

    return { canvas, displayNum };
  };

  // High-Resolution 1080x1080 Canvas Download
  const handleDownloadCard = async (item: QuoteItem, index: number) => {
    const cardId = item.id || `quote-${index}`;
    setDownloadingId(cardId);

    try {
      const generated = await generateCardCanvas(item, index);
      if (!generated) {
        showToast('Unable to generate card image');
        return;
      }

      const { canvas, displayNum } = generated;

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

  // Web Share or Clipboard Copy (Shares the actual card image)
  const handleShareQuote = async (item: QuoteItem, index: number) => {
    const cardId = item.id || `quote-${index}`;
    setSharingId(cardId);

    try {
      const generated = await generateCardCanvas(item, index);
      if (!generated) {
        showToast('Unable to prepare quote card');
        return;
      }

      const { canvas, displayNum } = generated;

      // Convert canvas to image Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) {
        showToast('Could not generate image file');
        return;
      }

      const fileName = `USH-Community-Quote-${displayNum}.png`;
      const imageFile = new File([blob], fileName, { type: 'image/png' });
      const captionText = `"${item.quote}"\n\n— USH Community of Traders\nJoin our community: https://t.me/+wHFuFFkA2i0xZTA8`;

      // 1. First priority: Web Share API with Image File (Android / iOS WhatsApp, Telegram, etc.)
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            files: [imageFile],
            title: `USH Community Wisdom N° ${displayNum}`,
            text: captionText,
          });
          showToast('Card shared successfully!');
          return;
        } catch (shareErr: unknown) {
          // If the user cancelled the share menu (AbortError), don't show error
          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
            return;
          }
          console.warn('Share with file aborted or not handled, falling back to clipboard', shareErr);
        }
      }

      // 2. Second priority: Copy actual image to Clipboard (Desktop Chrome, Edge, Safari)
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        try {
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([clipboardItem]);
          showToast('Quote image copied! Paste into WhatsApp or Telegram.');
          return;
        } catch (clipErr) {
          console.warn('Clipboard image write failed:', clipErr);
        }
      }

      // 3. Third priority: Text Web Share fallback if browser only shares text
      if (navigator.share) {
        try {
          await navigator.share({
            title: `USH Community Wisdom N° ${displayNum}`,
            text: captionText,
            url: 'https://t.me/+wHFuFFkA2i0xZTA8',
          });
          showToast('Shared text successfully!');
          return;
        } catch (textShareErr: unknown) {
          if (textShareErr instanceof Error && textShareErr.name === 'AbortError') {
            return;
          }
        }
      }

      // 4. Fourth priority: Copy text to clipboard (NEVER trigger download on share!)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(captionText);
          showToast('Quote text copied to clipboard! Paste into your chat.');
          return;
        } catch {
          // ignore
        }
      }

      showToast('Sharing not supported on this browser');
    } catch (e) {
      console.error('Error sharing quote image:', e);
      showToast('Could not share quote image');
    } finally {
      setSharingId(null);
    }
  };

  return (
    <section 
      id={galleryId} 
      className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 scroll-mt-24 select-none relative overflow-hidden"
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto sm:mx-0 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center justify-center sm:justify-start gap-2 text-[13px] font-bold animate-soft-fade">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Container - Clean & Luxury */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col items-center sm:items-start space-y-2 max-w-3xl mx-auto sm:mx-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] sm:text-[12px] font-black text-slate-900 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#0053CF]" />
          <span>{gallery.sectionBadge || 'TRADING WISDOM'}</span>
        </div>

        <h2 className="font-manrope text-[23px] sm:text-[29px] md:text-[34px] font-black text-slate-900 leading-tight tracking-tight text-center sm:text-left">
          {gallery.title}
        </h2>

        <p className="font-inter text-[13px] sm:text-[14.5px] text-slate-600 leading-relaxed text-center sm:text-left">
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
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-6 pt-3 px-2 no-scrollbar focus:outline-hidden cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedQuotes.map((item, idx) => {
          const displayNum = item.number 
            ? item.number.toString().padStart(2, '0') 
            : ((idx % quotes.length) + 1).toString().padStart(2, '0');

          return (
            <div
              key={`${item.id || 'quote'}-${idx}`}
              className="group relative shrink-0 w-[85vw] max-w-[340px] sm:w-[350px] md:w-[380px] transition-all duration-300 hover:scale-[1.02] select-none"
            >
              {/* Layered Luxury Accent Shape Behind Card */}
              <div 
                className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-600/85 to-green-500/85 translate-x-1.5 translate-y-1.5 opacity-85 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none"
              />

              {/* Main Luxury White Card with Soft Inner Shader */}
              <div
                className="relative w-full h-full rounded-3xl p-4 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] bg-white border border-slate-200 shadow-md group-hover:border-slate-300 transition-all duration-300 overflow-hidden"
                style={{
                  background: 'radial-gradient(circle at 50% 12%, #ffffff 0%, #fcfdfd 60%, #f0f7f3 100%)'
                }}
              >
                {/* Subtle B&W USH Logo Watermark in center behind text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                  <img 
                    src={effectiveLogo} 
                    alt="" 
                    aria-hidden="true" 
                    className="w-36 sm:w-44 h-auto max-h-36 sm:max-h-44 object-contain opacity-[0.065] grayscale contrast-125 brightness-95" 
                  />
                </div>

                {/* Top Row: Official Logo in Black & White on Left, Luxury Number on Right */}
                <div className="relative z-1 flex items-center justify-between gap-2.5 mb-3">
                  {/* Real Logo in Black & White + Brand matching top-left corner */}
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <img 
                      src={effectiveLogo} 
                      alt="Community of Traders Logo" 
                      className="h-7.5 sm:h-9 w-auto max-h-9 object-contain shrink-0 grayscale contrast-125 brightness-95" 
                    />
                    <div className="flex flex-col justify-center text-left min-w-0">
                      <span className="font-manrope text-[12.5px] sm:text-[14px] font-black tracking-tight text-slate-900 leading-tight truncate">
                        {brandName}
                      </span>
                      {settings.branding?.tagline ? (
                        <span className="text-[8px] sm:text-[8.5px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
                          {settings.branding.tagline}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Luxury Editorial Number */}
                  <div className="flex items-center shrink-0">
                    <span className="font-luxury text-[22px] sm:text-[28px] font-normal text-slate-300 group-hover:text-[#0053CF]/70 transition-colors select-none tracking-tight">
                      {displayNum}
                    </span>
                  </div>
                </div>

                {/* Cyan / Azure Quotation Mark Icon */}
                <div className="relative z-1 w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0053CF] shadow-2xs mb-2">
                  <Quote className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#0053CF] rotate-180" />
                </div>

                {/* Main Quote Text */}
                <div className="relative z-1 my-auto py-1 text-center">
                  <p className="font-manrope text-[14px] sm:text-[16.5px] md:text-[17.5px] font-extrabold text-slate-900 leading-[1.55] sm:leading-[1.65] tracking-tight">
                    “{item.quote}”
                  </p>
                </div>

                {/* Bottom Row: Author USH Community of Traders, Email & Action Icons (Download & Share) */}
                <div className="relative z-1 flex items-center justify-between pt-3 mt-2 border-t border-slate-100/90 gap-2">
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
                    {/* Download Icon Button - ONLY downloads */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCard(item, idx);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs disabled:opacity-60 active:scale-95"
                      title="Download Quote Card as Image"
                      aria-label="Download Quote Card"
                      disabled={downloadingId === (item.id || `quote-${idx}`) || sharingId === (item.id || `quote-${idx}`)}
                    >
                      {downloadingId === (item.id || `quote-${idx}`) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Share Icon Button - ONLY shares, never downloads */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareQuote(item, idx);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0053CF] border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs disabled:opacity-60 active:scale-95"
                      title="Share Quote Card Image"
                      aria-label="Share Quote Card Image"
                      disabled={downloadingId === (item.id || `quote-${idx}`) || sharingId === (item.id || `quote-${idx}`)}
                    >
                      {sharingId === (item.id || `quote-${idx}`) ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0053CF]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
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
