import React from "react";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {actionLabel && onAction && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-sm font-medium text-primary">
          {actionLabel}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
