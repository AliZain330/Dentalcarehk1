import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { AppointmentOrder } from "@/data/mockData";

const statusMap: Record<AppointmentOrder["status"], { en: string; zh: string; color: string }> = {
  pending_acceptance: { en: "Pending", zh: "待確認", color: "bg-warning/10 text-warning" },
  pending_treatment: { en: "Confirmed", zh: "待治療", color: "bg-info/10 text-info" },
  completed: { en: "Completed", zh: "已完成", color: "bg-success/10 text-success" },
  cancelled: { en: "Cancelled", zh: "已取消", color: "bg-destructive/10 text-destructive" },
};

const StatusBadge: React.FC<{ status: AppointmentOrder["status"] }> = ({ status }) => {
  const { language } = useLanguage();
  const s = statusMap[status];
  const lang = language === "zh-HK" ? "zh" : "en";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>
      {s[lang]}
    </span>
  );
};

export default StatusBadge;
