import React from 'react';
import { StarIcon } from './Icons';

interface DifficultyStarsProps {
  rating: number;
}

const DifficultyStars: React.FC<DifficultyStarsProps> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // Full star
      stars.push(<StarIcon key={i} className="w-5 h-5 text-amber-400" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      // Half star
      stars.push(
        <div key={i} className="relative">
          <StarIcon className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <StarIcon className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      );
    } else {
      // Empty star
      stars.push(<StarIcon key={i} className="w-5 h-5 text-slate-300 dark:text-slate-600" />);
    }
  }

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {stars.map((star, index) => (
        <div key={index}>{star}</div>
      ))}
    </div>
  );
};

export default DifficultyStars;
