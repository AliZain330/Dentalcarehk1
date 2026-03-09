import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const STATUS_LABELS: Record<string, { en: string; zh: string; variant: BadgeVariant }> = {
  active: { en: "Active", zh: "啟用", variant: "default" },
  approved: { en: "Approved", zh: "已批准", variant: "default" },
  enabled: { en: "Enabled", zh: "已啟用", variant: "default" },
  success: { en: "Success", zh: "成功", variant: "default" },
  completed: { en: "Completed", zh: "已完成", variant: "default" },
  settled: { en: "Settled", zh: "已結算", variant: "default" },
  resolved: { en: "Resolved", zh: "已解決", variant: "default" },
  compensated: { en: "Compensated", zh: "已補償", variant: "default" },

  confirmed: { en: "Confirmed", zh: "已確認", variant: "secondary" },
  pending: { en: "Pending", zh: "待處理", variant: "outline" },
  in_progress: { en: "In Progress", zh: "進行中", variant: "secondary" },
  paused: { en: "Paused", zh: "已暫停", variant: "outline" },
  scheduled: { en: "Scheduled", zh: "排期中", variant: "outline" },
  under_review: { en: "Under Review", zh: "審核中", variant: "secondary" },
  draft: { en: "Draft", zh: "草稿", variant: "outline" },
  open: { en: "Open", zh: "待處理", variant: "secondary" },
  unsettled: { en: "Unsettled", zh: "未結算", variant: "secondary" },
  payment_arranged: { en: "Payment Arranged", zh: "付款安排中", variant: "secondary" },
  expired: { en: "Expired", zh: "已過期", variant: "secondary" },
  closed: { en: "Closed", zh: "已關閉", variant: "outline" },

  disabled: { en: "Disabled", zh: "已停用", variant: "outline" },
  rejected: { en: "Rejected", zh: "已拒絕", variant: "destructive" },
  refunded: { en: "Refunded", zh: "已退款", variant: "destructive" },
  failed: { en: "Failed", zh: "失敗", variant: "destructive" },
  disputed: { en: "Disputed", zh: "爭議中", variant: "destructive" },
  cancelled: { en: "Cancelled", zh: "已取消", variant: "destructive" },
};

interface AdminStatusBadgeProps {
  status: string;
  fallbackEn?: string;
  fallbackZh?: string;
}

const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, fallbackEn, fallbackZh }) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const cfg = STATUS_LABELS[status];
  if (!cfg) {
    return <Badge variant="outline">{isEn ? (fallbackEn || status) : (fallbackZh || status)}</Badge>;
  }
  return <Badge variant={cfg.variant}>{isEn ? cfg.en : cfg.zh}</Badge>;
};

export default AdminStatusBadge;
