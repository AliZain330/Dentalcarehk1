import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";
import type { ReviewStatus } from "../context/InstitutionContext";

interface Props {
  status: ReviewStatus;
  className?: string;
}

const ReviewStatusBadge: React.FC<Props> = ({ status, className }) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const config: Record<ReviewStatus, { label: string; classes: string }> = {
    draft: { label: isEn ? "Draft" : "草稿", classes: "bg-muted text-muted-foreground border-border" },
    pending: { label: isEn ? "Pending Review" : "待審核", classes: "bg-warning/10 text-warning border-warning/30" },
    approved: { label: isEn ? "Approved" : "已通過", classes: "bg-success/10 text-success border-success/30" },
    rejected: { label: isEn ? "Rejected" : "已駁回", classes: "bg-destructive/10 text-destructive border-destructive/30" },
  };

  const c = config[status];

  return (
    <Badge variant="outline" className={`${c.classes} ${className || ""}`}>
      {c.label}
    </Badge>
  );
};

export default ReviewStatusBadge;
