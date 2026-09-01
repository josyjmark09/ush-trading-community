import React, { useState } from 'react';
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
  Clock
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
  title = "Trusted By Serious Traders Worldwide",
  subtitle = "Swipe or use the arrows to see verified reviews from our global trading members."
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
  const [submissionResult, setSubmissionResult] = useState<{ submitted: boolean; requiresApproval: boolean } | null>(null);

  const totalReviews = reviewsList.length;

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

  if (totalReviews === 0) {
    return null;
  }

  const currentItem = reviewsList[currentIndex];
  const prevItem = reviewsList[getIdx(-1)];
  const nextItem = reviewsList[getIdx(1)];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const res = addReview({
      name: name.trim(),
      country: selectedCountry.name,
      countryCode: selectedCountry.code,
      rating,
      content: content.trim(),
    });

    setSubmissionResult({
      submitted: true,
      requiresApproval: res.requiresApproval,
    });

    setName('');
    setContent('');

    setTimeout(() => {
      setSubmissionResult(null);
      setIsFormOpen(false);
    }, 3500);
  };

  return (
    <section 
      id="reviews"
      className="relative w-full max-w-[1200px] mx-auto px-4 mb-10 sm:mb-16 select-none scroll-mt-24"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="text-center mb-5 sm:mb-6 space-y-1">
        <span className="text-[#0053CF] font-inter text-[11px] sm:text-[13px] font-extrabold uppercase tracking-wider block">
          VERIFIED TRADER EXPERIENCES
        </span>
        <h2 className="font-manrope text-[24px] sm:text-[34px] font-black text-slate-900 leading-tight">
          {title}
        </h2>
        <p className="font-inter text-[13px] sm:text-[15px] text-slate-600 max-w-lg mx-auto px-1">
          {subtitle}
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative flex items-center justify-center min-h-[240px] sm:min-h-[340px] overflow-hidden py-1 sm:py-2">
        
        {/* Left Preview Card (desktop/tablet only) */}
        {totalReviews > 1 && (
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
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-manrope font-black text-[11px] shrink-0 border border-slate-300">
                {getInitials(prevItem.name)}
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-manrope text-[12px] sm:text-[13px] font-bold text-slate-900 truncate">
                  {prevItem.name}
                </span>
                <CountryFlag code={prevItem.countryCode} name={prevItem.country} className="w-4 h-2.5 rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Center Main Solid Card */}
        <div className="relative z-20 w-full max-w-[580px] bg-white rounded-xl sm:rounded-2xl border border-slate-300 shadow-xs p-4 sm:p-7 mx-auto">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-1">
              {[...Array(currentItem.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-[#0053CF]">
              <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Main Review Quote */}
          <p className="font-inter text-[13.5px] sm:text-[16px] text-slate-800 leading-relaxed mb-4 sm:mb-5 font-normal">
            "{currentItem.content}"
          </p>

          {/* Author Footer */}
          <div className="pt-2.5 sm:pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 font-manrope font-black text-[12px] sm:text-[14px] shrink-0">
                {getInitials(currentItem.name)}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-manrope text-[13.5px] sm:text-[16px] font-bold text-slate-900">
                  {currentItem.name}
                </span>
                <CountryFlag 
                  code={currentItem.countryCode} 
                  name={currentItem.country} 
                  className="w-4 h-3 sm:w-5 sm:h-3.5 rounded-xs" 
                />
              </div>
            </div>

            {currentItem.country && (
              <span className="text-[11px] sm:text-[12.5px] text-slate-500 font-inter">
                {currentItem.country}
              </span>
            )}
          </div>
        </div>

        {/* Right Preview Card (desktop/tablet only) */}
        {totalReviews > 1 && (
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
              <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-800 font-manrope font-black text-[11px] shrink-0 border border-slate-300">
                {getInitials(nextItem.name)}
              </div>
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

        {/* Carousel indicator dots */}
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

      {/* Write a Review Drawer Trigger */}
      <div className="mt-8 text-center">
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-[13px] font-bold transition-colors border border-slate-300 shadow-2xs cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#0053CF]" />
            <span>Share Your Trading Feedback</span>
          </button>
        ) : (
          <div className="mt-4 max-w-lg mx-auto bg-white rounded-xl border border-slate-300 p-5 sm:p-6 shadow-sm text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-manrope font-black text-[16px] text-slate-900">
                Submit Your Trader Review
              </h3>
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
                    <Clock className="w-10 h-10 text-amber-600 mx-auto" />
                    <h4 className="font-manrope font-bold text-[16px] text-slate-900">
                      Review Submitted for Verification!
                    </h4>
                    <p className="text-[13px] text-slate-600 font-inter max-w-xs mx-auto">
                      Thank you! Your feedback has been received and will appear live once approved by the admin team.
                    </p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
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
                      className="w-full px-3 py-2 text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter"
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
                        className="w-full px-3 py-2 text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter bg-white"
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
                    placeholder="Write your honest trading feedback or experience..."
                    className="w-full px-3 py-2 text-[13.5px] rounded-lg border border-slate-300 focus:border-[#0053CF] outline-hidden font-inter resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0053CF] hover:bg-[#0040A2] text-white py-2.5 px-4 rounded-lg font-inter text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Review</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
