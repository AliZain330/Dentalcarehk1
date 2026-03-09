import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Globe,
  Building2,
  Ticket,
  Gift,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: t.profile.personalInfo, action: () => {} },
    {
      icon: Globe,
      label: t.profile.languageSettings,
      right: language === "en" ? t.profile.english : t.profile.chinese,
      action: () => setLanguage(language === "en" ? "zh-HK" : "en"),
    },
    { icon: Building2, label: t.profile.savedInstitutions, action: () => {} },
    { icon: Ticket, label: t.profile.coupons, action: () => {} },
    { icon: Gift, label: t.profile.referralRewards, action: () => {} },
  ];

  return (
    <div className="animate-fade-in p-4 pt-6">
      <h1 className="mb-6 text-xl font-bold text-foreground">{t.profile.title}</h1>

      {/* Avatar Section */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">User</p>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </CardContent>
      </Card>

      {/* Menu */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">
                {item.label}
              </span>
              {item.right && (
                <span className="text-xs text-muted-foreground">{item.right}</span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-destructive transition-colors hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">{t.profile.logout}</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
