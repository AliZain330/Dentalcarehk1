import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DoctorPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: { label: string; className: string };
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const DoctorPageHeader: React.FC<DoctorPageHeaderProps> = ({ title, subtitle, badge, onBack, rightContent }) => {
  const navigate = useNavigate();
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <button onClick={onBack || (() => navigate(-1))} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {badge && <Badge variant="outline" className={badge.className}>{badge.label}</Badge>}
        {rightContent}
      </div>
    </div>
  );
};

export default DoctorPageHeader;
