import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/i18n/LanguageContext";

interface SettingsStatusBadgeProps {
  status: "enabled" | "disabled" | "updated" | "success" | "failed";
}

const SettingsStatusBadge: React.FC<SettingsStatusBadgeProps> = ({ status }) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const map = {
    enabled: {
      variant: "default" as const,
      en: "Enabled",
      zh: "已啟用",
    },
    disabled: {
      variant: "outline" as const,
      en: "Disabled",
      zh: "已停用",
    },
    updated: {
      variant: "secondary" as const,
      en: "Updated",
      zh: "已更新",
    },
    success: {
      variant: "default" as const,
      en: "Success",
      zh: "成功",
    },
    failed: {
      variant: "destructive" as const,
      en: "Failed",
      zh: "失敗",
    },
  };

  const cfg = map[status];
  return <Badge variant={cfg.variant}>{isEn ? cfg.en : cfg.zh}</Badge>;
};

export default SettingsStatusBadge;
