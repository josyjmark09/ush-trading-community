import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReviewItem } from '../types';
import { useSite } from '../context/SiteContext';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Send, 
  MessageSquarePlus, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Camera,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  Move,
  Users,
  Search,
  Trash2,
  Check,
  Sliders
} from 'lucide-react';

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
}

const COUNTRIES = [
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United States', code: 'us' },
  { name: 'Nigeria', code: 'ng' },
  { name: 'South Africa', code: 'za' },
  { name: 'Kenya', code: 'ke' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'Switzerland', code: 'ch' },
  { name: 'Spain', code: 'es' },
  { name: 'Singapore', code: 'sg' },
  { name: 'Germany', code: 'de' },
  { name: 'Canada', code: 'ca' },
  { name: 'Australia', code: 'au' },
  { name: 'France', code: 'fr' },
  { name: 'Italy', code: 'it' },
  { name: 'India', code: 'in' },
  { name: 'Ghana', code: 'gh' },
  { name: 'Brazil', code: 'br' },
];

const getInitials = (name: string): string => {
  if (!name) return 'TR';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const firstInitial = parts[0][0] || '';
    const lastInitial = parts[parts.length - 1][0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const CountryFlag: React.FC<{ code?: string; name?: string; className?: string }> = ({ 
  code = 'gb', 
  name = 'Country Flag', 
  className = "w-5 h-3.5 object-cover rounded-xs inline-block" 
}) => {
  const cleanCode = (code || 'gb').toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${cleanCode}.png`}
      srcSet={`https://flagcdn.com/w80/${cleanCode}.png 2x`}
      alt={`${name} flag`}
      className={`shrink-0 border border-slate-300 ${className}`}
      loading="lazy"
    />
  );
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  title = "Community Reviews & Feedback",
  subtitle = "Real reviews submitted by verified community traders. Reviews appear here once approved by our moderation desk."
}) => {
  const { approvedReviews, addReview } = useSite();
  const reviewsList = approvedReviews.length > 0 ? approvedReviews : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // New review form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [submissionResult, setSubmissionResult] = useState<{ submitted: boolean; requiresApproval: boolean } | null>(null);

  // Profile photo interactive framing state
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isFramingOpen, setIsFramingOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0); // -50 to 50
  const [panY, setPanY] = useState(0); // -50 to 50
  const fileInputRef = useRef<HTMLInputElement>(null);

  // All Reviews modal state
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const totalReviews = reviewsList.length;

  const averageRating = totalReviews > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : null;

  // Prevent background page scrolling when either modal is open
  useEffect(() => {
    if (isFramingOpen || isAllReviewsOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isFramingOpen, isAllReviewsOpen]);

  const compressInitialAvatar = (imageSrc: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 140;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 140, 140);
      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedDataUrl);
      } catch (err) {
        console.error('Failed to compress avatar:', err);
      }
    };
    img.src = imageSrc;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (e.g. JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setRawImage(dataUrl);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      // Pre-set compressed avatar immediately
      compressInitialAvatar(dataUrl);
      // Open the interactive framing modal centered in viewport
      setIsFramingOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyFraming = () => {
    if (!rawImage) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 140;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const minDim = Math.min(img.width, img.height);
      const scaledDim = minDim / zoom;

      const maxOffsetX = (img.width - scaledDim) / 2;
      const maxOffsetY = (img.height - scaledDim) / 2;

      const sx = Math.max(0, Math.min(img.width - scaledDim, (img.width - scaledDim) / 2 + (panX / 100) * maxOffsetX));
      const sy = Math.max(0, Math.min(img.height - scaledDim, (img.height - scaledDim) / 2 + (panY / 100) * maxOffsetY));

      ctx.drawImage(img, sx, sy, scaledDim, scaledDim, 0, 0, 140, 140);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setAvatar(compressedDataUrl);
      setIsFramingOpen(false);
    };
    img.src = rawImage;
  };

  const nextReview = () => {
    if (totalReviews <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevReview = () => {
    if (totalReviews <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const getIdx = (offset: number) => {
    if (totalReviews === 0) return 0;
    return (currentIndex + offset + totalReviews) % totalReviews;
  };

  // Swipe support for touch screens
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextReview();
    } else if (isRightSwipe) {
      prevReview();
    }
  };

  const currentItem = totalReviews > 0 ? reviewsList[currentIndex] : null;
  const prevItem = totalReviews > 1 ? reviewsList[getIdx(-1)] : null;
  const nextItem = totalReviews > 1 ? reviewsList[getIdx(1)] : null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const res = addReview({
      name: name.trim(),
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      rating,
      content: content.trim(),
      avatar: avatar || undefined,
    });

    setSubmissionResult({
      submitted: true,
      requiresApproval: res.requiresApproval,
    });

    setName('');
    setContent('');
    setAvatar(undefined);

    setTimeout(() => {
      setSubmissionResult(null);
      setIsFormOpen(false);
    }, 4000);
  };

  return (
    <section 
      id="reviews"
      className="relative w-full max-w-[1200px] mx-auto px-3 sm:px-4 mb-8 sm:mb-12 select-none scroll-mt-24 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="text-center flex flex-col items-center justify-center mb-5 sm:mb-6 space-y-1 max-w-2xl mx-auto">
        <span className="text-[#0053CF] font-inter text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-wider block">
          VERIFIED TRADER EXPERIENCES
        </span>
        <h2 className="font-manrope text-[24px] sm:text-[32px] md:text-[36px] font-black text-slate-900 leading-tight text-center">
          {title}
        </h2>
        <p className="font-inter text-[13px] sm:text-[15px] text-slate-600 max-w-lg mx-auto px-1 text-center">
          {subtitle}
        </p>

        {/* Real Rating Badge (Only shown when real reviews exist!) */}
        {totalReviews > 0 && averageRating && (
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(averageRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-manrope text-[13px] sm:text-[14px] font-black text-slate-900">
              {averageRating} / 5.0
            </span>
            <span className="text-slate-400 text-[12px] font-inter">•</span>
            <span className="text-slate-600 text-[12px] sm:text-[13px] font-inter font-bold">
              {totalReviews} {totalReviews === 1 ? 'Verified Review' : 'Verified Reviews'}
            </span>
          </div>
        )}
      </div>

      {/* Case 1: EMPTY STATE - No approved reviews yet */}
      {totalReviews === 0 && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-[#0053CF] flex items-center justify-center mx-auto shadow-2xs">
            <MessageSquarePlus className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-manrope text-[20px] sm:text-[22px] font-black text-slate-900">
              No Reviews Published Yet
            </h3>
            <p className="font-inter text-[13.5px] sm:text-[14.5px] text-slate-600 leading-relaxed max-w-md mx-auto">
              Every review on USH Community of Traders is submitted by a genuine community member and verified before appearing live. We do not use simulated reviews or fake testimonials.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-[12px] text-slate-600 font-inter">
            <ShieldCheck className="w-4 h-4 text-[#0053CF]" />
            <span>Strict moderation enabled: your feedback will appear once verified</span>
          </div>

          <div className="pt-2">
            {!isFormOpen && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white px-6 py-2.5 rounded-xl font-manrope text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Write the First Review</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Case 2: ACTIVE CAROUSEL - When approved reviews exist */}
      {totalReviews > 0 && currentItem && (
        <>
          <div className="relative flex items-center justify-center min-h-[240px] sm:min-h-[340px] overflow-hidden py-1 sm:py-2">
            
            {/* Left Preview Card */}
            {totalReviews > 1 && prevItem && (
              <div 
                onClick={prevReview}
                className="hidden sm:flex flex-col justify-between absolute sm:left-2 md:left-6 lg:left-12 sm:w-[260px] md:w-[320px] sm:h-[260px] md:h-[280px] bg-white p-4 sm:p-6 rounded-xl border border-slate-300 shadow-2xs opacity-35 scale-90 -translate-x-2 sm:-translate-x-4 transition-all duration-200 cursor-pointer pointer-events-auto hover:opacity-60 z-10"
              >
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(prevItem.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="font-inter text-[12px] sm:text-[13px] text-slate-600 line-clamp-4 leading-relaxed">
                    "{prevItem.content}"
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200">
                  {prevItem.avatar ? (
                    <img 
                      src={prevItem.avatar} 
                      alt={prevItem.name} 
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-manrope font-black text-[11px] shrink-0 border border-slate-300">
                      {getInitials(prevItem.name)}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-manrope text-[12px] sm:text-[13px] font-bold text-slate-900 truncate">
                      {prevItem.name}
                    </span>
                    <CountryFlag code={prevItem.countryCode} name={prevItem.country} className="w-4 h-2.5 rounded-xs" />
                  </div>
                </div>
              </div>
            )}

            {/* Active Center Card */}
            <div className="relative z-20 w-full max-w-[540px] min-h-[220px] sm:min-h-[280px] bg-white rounded-xl sm:rounded-2xl border-2 border-slate-300 shadow-sm p-4 sm:p-8 flex flex-col justify-between transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < currentItem.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300 rotate-180" />
                </div>

                <p className="font-inter text-[13px] sm:text-[15px] text-slate-700 leading-relaxed mb-4">
                  "{currentItem.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {currentItem.avatar ? (
                    <img 
                      src={currentItem.avatar} 
                      alt={currentItem.name} 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#0053CF]/30 shadow-2xs shrink-0" 
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-manrope font-black text-[12px] sm:text-[14px] border border-slate-300 shrink-0">
                      {getInitials(currentItem.name)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-manrope text-[14px] sm:text-[16px] font-bold text-slate-900">
                        {currentItem.name}
                      </span>
                      <CountryFlag 
                        code={currentItem.countryCode} 
                        name={currentItem.country} 
                        className="w-5 h-3 sm:w-5 sm:h-3.5 rounded-xs" 
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-inter">
                      Verified Community Member
                    </span>
                  </div>
                </div>

                {currentItem.country && (
                  <span className="text-[11px] sm:text-[12.5px] text-slate-500 font-inter">
                    {currentItem.country}
                  </span>
                )}
              </div>
            </div>

            {/* Right Preview Card */}
            {totalReviews > 1 && nextItem && (
              <div 
                onClick={nextReview}
                className="hidden sm:flex flex-col justify-between absolute sm:right-2 md:right-6 lg:right-12 sm:w-[260px] md:w-[320px] sm:h-[260px] md:h-[280px] bg-white p-4 sm:p-6 rounded-xl border border-slate-300 shadow-2xs opacity-35 scale-90 translate-x-2 sm:translate-x-4 transition-all duration-200 cursor-pointer pointer-events-auto hover:opacity-60 z-10"
              >
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(nextItem.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="font-inter text-[12px] sm:text-[13px] text-slate-600 line-clamp-4 leading-relaxed">
                    "{nextItem.content}"
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200">
                  {nextItem.avatar ? (
                    <img 
                      src={nextItem.avatar} 
                      alt={nextItem.name} 
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0" 
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-manrope font-black text-[11px] shrink-0 border border-slate-300">
                      {getInitials(nextItem.name)}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-manrope text-[12px] sm:text-[13px] font-bold text-slate-900 truncate">
                      {nextItem.name}
                    </span>
                    <CountryFlag code={nextItem.countryCode} name={nextItem.country} className="w-4 h-2.5 rounded-xs" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Controls: Prev, Next & Dots */}
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              {reviewsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#0053CF]'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Review Actions: View All & Submit Buttons */}
      <div className="mt-8 text-center">
        {!isFormOpen ? (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {totalReviews > 0 && (
              <button
                onClick={() => setIsAllReviewsOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[13px] font-bold transition-all border border-slate-300 shadow-2xs cursor-pointer active:scale-98"
              >
                <Users className="w-4 h-4 text-[#0053CF]" />
                <span>View All ({totalReviews}) Reviews</span>
              </button>
            )}

            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0053CF] hover:bg-[#0040A2] text-white text-[13px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{totalReviews === 0 ? "Write the First Review" : "Leave a Review"}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 max-w-lg mx-auto bg-white rounded-2xl border border-slate-300 p-5 sm:p-7 shadow-sm text-left animate-soft-fade">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-manrope font-black text-[17px] text-slate-900">
                  Submit Your Trader Review
                </h3>
                <p className="text-[12px] text-slate-500 font-inter">
                  Your feedback helps maintain community standards and transparency.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-[13px] font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            {submissionResult?.submitted ? (
              <div className="py-6 text-center space-y-2">
                {submissionResult.requiresApproval ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h4 className="font-manrope font-bold text-[16px] text-slate-900">
                      Review Submitted for Verification!
                    </h4>
                    <p className="text-[13px] text-slate-600 font-inter max-w-xs mx-auto">
                      Thank you! Your feedback has been received and will appear live once approved by the admin team.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-manrope font-bold text-slate-900 text-[16px]">
                      Review Published Live!
                    </h4>
                    <p className="text-[13px] text-slate-600 font-inter max-w-xs mx-auto">
                      Thank you for sharing your experience with the USH trading community.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-900 mb-1 font-inter">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-3 py-2 text-[16px] sm:text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter min-h-[42px] sm:min-h-0"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-900 mb-1 font-inter">
                      Country
                    </label>
                    <div className="flex items-center gap-2">
                      <CountryFlag code={selectedCountry.code} name={selectedCountry.name} className="w-6 h-4 rounded-xs" />
                      <select
                        value={selectedCountry.name}
                        onChange={(e) => {
                          const found = COUNTRIES.find((c) => c.name === e.target.value);
                          if (found) setSelectedCountry(found);
                        }}
                        className="w-full px-3 py-2 text-[16px] sm:text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter bg-white min-h-[42px] sm:min-h-0"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-900 mb-1 font-inter">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer p-0.5 focus:outline-hidden"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-[12px] font-bold text-slate-900 font-inter">
                      {rating}.0 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-900 mb-1 font-inter">
                    Review Content
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your honest trading feedback or experience with our signals/education..."
                    className="w-full px-3 py-2 text-[16px] sm:text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter resize-none"
                  />
                </div>

                {/* Profile Photo Uploader & Interactive Framing Preview */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-900 mb-1.5 font-inter">
                    Profile Photo <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>

                  {avatar ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <img
                        src={avatar}
                        alt="Your profile avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#0053CF] shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[12px] font-bold text-slate-800 block">Photo ready</span>
                        <span className="text-[11px] text-emerald-600 font-semibold block">Compressed to &lt;15KB • Fast loading</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsFramingOpen(true)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Adjust Framing"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#0053CF]" />
                          <span>Adjust</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAvatar(undefined)}
                          className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-300 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-dashed border-slate-300 hover:border-[#0053CF] rounded-xl text-[12.5px] font-bold font-inter transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4 text-[#0053CF]" />
                        <span>Upload & Frame Profile Photo</span>
                      </button>
                      <p className="text-[11px] text-slate-500 mt-1 font-inter">
                        Upload your photo, position your face clearly in the circular frame, and it will be micro-compressed for instant loading.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 px-4 rounded-xl font-inter text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review For Verification</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Interactive Face Framing Modal (Portaled to document.body so it is always 100% centered in viewport) */}
      {isFramingOpen && rawImage && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-soft-fade"
          onClick={() => setIsFramingOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-300 relative flex flex-col space-y-4 my-auto max-h-[94vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="font-manrope text-[16px] sm:text-[17px] font-black text-slate-900">
                  Position & Frame Your Face
                </h3>
                <p className="text-[11.5px] text-slate-500 font-inter">
                  Adjust zoom & position so your face fits nicely in the circular avatar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFramingOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Live Framing Mask Window */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#0053CF] shadow-md bg-slate-900 flex items-center justify-center select-none">
                <img
                  src={rawImage}
                  alt="Framing preview"
                  className="max-w-none transition-transform duration-75 select-none pointer-events-none"
                  style={{
                    width: `${100 * zoom}%`,
                    height: `${100 * zoom}%`,
                    objectFit: 'cover',
                    transform: `translate(${panX}%, ${panY}%)`,
                  }}
                />
                {/* Crosshair guide */}
                <div className="absolute inset-0 rounded-full pointer-events-none border border-white/20"></div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-2">
                Live circular avatar preview
              </span>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {/* Zoom Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11.5px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Zoom Level:</span>
                  </span>
                  <span>{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#0053CF]"
                />
              </div>

              {/* Vertical Position Slider (Face Up / Down) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11.5px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Move className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Position Face (Up / Down):</span>
                  </span>
                  <span>{panY > 0 ? `+${panY}%` : `${panY}%`}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="1"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#0053CF]"
                />
              </div>

              {/* Horizontal Position Slider (Left / Right) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11.5px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Move className="w-3.5 h-3.5 text-[#0053CF]" />
                    <span>Position Face (Left / Right):</span>
                  </span>
                  <span>{panX > 0 ? `+${panX}%` : `${panX}%`}</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="1"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-[#0053CF]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => { setZoom(1.3); setPanX(0); setPanY(-15); }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Face Focus
                </button>
                <button
                  type="button"
                  onClick={() => { setZoom(1.6); setPanX(0); setPanY(-20); }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-bold text-slate-700 cursor-pointer"
                >
                  Close Up
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFramingOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[12.5px] font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyFraming}
                className="px-5 py-2 bg-[#0053CF] hover:bg-[#0040A2] text-white rounded-xl text-[12.5px] font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Apply</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* All Reviews Modal (Portaled to document.body) */}
      {isAllReviewsOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-soft-fade"
          onClick={() => setIsAllReviewsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-300 relative flex flex-col max-h-[90vh] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0053CF] flex items-center justify-center font-black text-[13px]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-manrope text-[17px] sm:text-[20px] font-black text-slate-900 leading-tight">
                    All Verified Reviews ({totalReviews})
                  </h3>
                  <p className="font-inter text-[12px] text-slate-500">
                    Real feedback from our global trading collective
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAllReviewsOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="py-3 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-inter focus:outline-none focus:bg-white focus:border-[#0053CF]"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterRating(null)}
                  className={`px-2.5 py-1 rounded-md text-[11.5px] font-bold transition-colors cursor-pointer shrink-0 ${
                    filterRating === null ? 'bg-[#0053CF] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({totalReviews})
                </button>
                {[5, 4, 3].map((r) => {
                  const count = reviewsList.filter(item => item.rating === r).length;
                  return (
                    <button
                      key={r}
                      onClick={() => setFilterRating(filterRating === r ? null : r)}
                      className={`px-2 py-1 rounded-md text-[11.5px] font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                        filterRating === r ? 'bg-[#0053CF] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{r}★</span>
                      <span className="opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3.5 pr-1">
              {reviewsList
                .filter((r) => {
                  const matchesSearch = !searchTerm.trim() || 
                    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (r.country && r.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    r.content.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesRating = filterRating === null || r.rating === filterRating;
                  return matchesSearch && matchesRating;
                })
                .map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        {review.submittedAt && (
                          <span className="text-[10.5px] text-slate-400 font-inter">
                            {review.submittedAt}
                          </span>
                        )}
                      </div>

                      <p className="font-inter text-[12.5px] text-slate-700 leading-relaxed">
                        "{review.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-200/80">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-white text-slate-800 font-manrope font-black text-[11px] flex items-center justify-center border border-slate-200 shrink-0">
                          {getInitials(review.name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-manrope text-[12.5px] font-bold text-slate-900 truncate">
                            {review.name}
                          </span>
                          <CountryFlag code={review.countryCode} name={review.country} className="w-4 h-2.5 rounded-xs" />
                        </div>
                        <span className="text-[10.5px] text-slate-500 font-inter truncate block">
                          {review.country || 'Verified Trader'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer inside modal */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[12px] text-slate-500 font-inter">
                Showing {reviewsList.length} verified reviews
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAllReviewsOpen(false);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0053CF] hover:bg-[#0040A2] text-white text-[12px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
