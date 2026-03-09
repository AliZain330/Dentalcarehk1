import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Bell, Shield, FileText } from "lucide-react";

const AdminSettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isEn = language === "en";

  const SettingsRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Platform configuration" : "平台設定"}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "General" : "一般設定"}</CardTitle></CardHeader>
        <CardContent className="space-y-0 divide-y divide-border">
          <SettingsRow icon={Globe} label={isEn ? "Language" : "語言"}>
            <button
              onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}
              className="text-sm font-medium text-primary"
            >
              {language === "en" ? "繁體中文" : "English"}
            </button>
          </SettingsRow>
          <SettingsRow icon={Bell} label={isEn ? "Email Notifications" : "電郵通知"}>
            <Switch defaultChecked />
          </SettingsRow>
          <SettingsRow icon={Bell} label={isEn ? "SMS Alerts" : "短信提醒"}>
            <Switch />
          </SettingsRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Security" : "安全設定"}</CardTitle></CardHeader>
        <CardContent className="space-y-0 divide-y divide-border">
          <SettingsRow icon={Shield} label={isEn ? "Two-Factor Auth" : "雙重認證"}>
            <Switch />
          </SettingsRow>
          <SettingsRow icon={Shield} label={isEn ? "IP Whitelist" : "IP 白名單"}>
            <span className="text-xs text-muted-foreground">{isEn ? "Not configured" : "未設定"}</span>
          </SettingsRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Legal" : "法律文件"}</CardTitle></CardHeader>
        <CardContent className="space-y-0 divide-y divide-border">
          <SettingsRow icon={FileText} label={isEn ? "Privacy Policy" : "隱私政策"}>
            <span className="text-xs text-muted-foreground">{isEn ? "View" : "查看"} →</span>
          </SettingsRow>
          <SettingsRow icon={FileText} label={isEn ? "Terms of Service" : "服務條款"}>
            <span className="text-xs text-muted-foreground">{isEn ? "View" : "查看"} →</span>
          </SettingsRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;
