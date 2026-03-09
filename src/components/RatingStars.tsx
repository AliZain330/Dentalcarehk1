import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 14, showValue = true, count }) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="text-warning fill-warning" style={{ width: size, height: size }} />
      {showValue && <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
};

export default RatingStars;
