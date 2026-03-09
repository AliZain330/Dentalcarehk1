import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Globe, Bell, Shield, FileText, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const s = t.settingsPage;
  const [notifs, setNotifs] = useState(true);

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.title}</h1>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          {/* Language */}
          <button
            onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted"
          >
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{s.language}</span>
            <span className="text-xs text-muted-foreground">{language === "en" ? "English" : "繁體中文"}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          {/* Notifications */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{s.notifications}</p>
              <p className="text-xs text-muted-foreground">{s.notificationsDesc}</p>
            </div>
            <Switch checked={notifs} onCheckedChange={setNotifs} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          <button onClick={() => navigate("/settings/privacy-policy")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{s.privacyPolicy}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          <button onClick={() => navigate("/settings/user-agreement")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{s.userAgreement}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <button onClick={() => navigate("/login")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive hover:bg-muted">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">{s.logout}</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
