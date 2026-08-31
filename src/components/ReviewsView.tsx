import React from 'react';
import { ReviewsSection } from './ReviewsSection';

interface ReviewsViewProps {
  onOpenTelegram: () => void;
  onOpenBroker: () => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = () => {
  return (
    <div className="w-full flex flex-col gap-6 sm:gap-10 pt-2 pb-16 overflow-hidden">
      <ReviewsSection 
        title="Community Reviews & Feedback"
        subtitle="Explore verified trader testimonials from across the globe or share your own experience."
      />
    </div>
  );
};
