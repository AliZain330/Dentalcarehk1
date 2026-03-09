import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

export const useAdminNotify = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return {
    success: (en: string, zh: string) => toast.success(isEn ? en : zh),
    error: (en: string, zh: string) => toast.error(isEn ? en : zh),
    info: (en: string, zh: string) => toast.info(isEn ? en : zh),
    warnApiMissing: () => toast.info(isEn ? "API key not added yet" : "API 金鑰尚未添加"),
  };
};
