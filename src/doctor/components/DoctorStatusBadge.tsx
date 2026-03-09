import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

export type DoctorBadgeType =
  | "pending" | "confirmed" | "active" | "completed" | "rejected"
  | "draft" | "approved" | "settled" | "expired" | "cancelled";

const DoctorStatusBadge: React.FC<{ status: DoctorBadgeType; label?: string }> = ({ status, label }) => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";

  const config: Record<DoctorBadgeType, { label: string; cls: string }> = {
    pending: { label: isEn ? "Pending" : "待處理", cls: "bg-warning/10 text-warning border-warning/20" },
    confirmed: { label: isEn ? "Confirmed" : "已確認", cls: "bg-primary/10 text-primary border-primary/20" },
    active: { label: isEn ? "Active" : "進行中", cls: "bg-info/10 text-info border-info/20" },
    completed: { label: isEn ? "Completed" : "已完成", cls: "bg-success/10 text-success border-success/20" },
    rejected: { label: isEn ? "Rejected" : "已拒絕", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    draft: { label: isEn ? "Draft" : "草稿", cls: "bg-muted text-muted-foreground border-border" },
    approved: { label: isEn ? "Approved" : "已批准", cls: "bg-success/10 text-success border-success/20" },
    settled: { label: isEn ? "Settled" : "已結算", cls: "bg-success/10 text-success border-success/20" },
    expired: { label: isEn ? "Expired" : "已過期", cls: "bg-muted text-muted-foreground border-border" },
    cancelled: { label: isEn ? "Cancelled" : "已取消", cls: "bg-muted text-muted-foreground border-border" },
  };

  const c = config[status];
  return <Badge variant="outline" className={`text-[10px] ${c.cls}`}>{label || c.label}</Badge>;
};

export default DoctorStatusBadge;
