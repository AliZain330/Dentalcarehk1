import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface ApiPlaceholderNoticeProps {
  /** e.g. "Payment", "SMS Verification", "Video Consultation" */
  service: string;
  /** Inline (banner) or block (centered card) */
  variant?: "inline" | "block";
  className?: string;
}

const ApiPlaceholderNotice: React.FC<ApiPlaceholderNoticeProps> = ({
  service,
  variant = "inline",
  className = "",
}) => {
  const { language } = useLanguage();
  const label =
    language === "zh-HK"
      ? `${service} API 金鑰尚未添加`
      : `${service} API key not added yet`;

  const mockLabel =
    language === "zh-HK"
      ? "目前使用模擬數據運行"
      : "Currently running with mock data";

  if (variant === "block") {
    return (
      <div
        className={`mx-auto flex max-w-xs flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-6 py-8 text-center ${className}`}
      >
        <AlertTriangle className="h-8 w-8 text-warning" />
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{mockLabel}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border border-dashed border-warning/50 bg-warning/5 px-3 py-2 ${className}`}
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{mockLabel}</p>
      </div>
    </div>
  );
};

export default ApiPlaceholderNotice;
