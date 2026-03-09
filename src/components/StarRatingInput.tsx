import React from "react";
import { Star } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (val: number) => void;
  label: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ value, onChange, label }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)}>
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= value ? "fill-warning text-warning" : "text-border"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRatingInput;
