import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  User, Globe, Building2, Ticket, Gift, LogOut, ChevronRight,
  ClipboardList, FileText, Phone, Mail, Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFavorites } from "@/context/FavoritesContext";
import { mockCoupons } from "@/data/mockData";

const ProfilePage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const availableCoupons = mockCoupons.filter((c) => c.status === "available").length;

  const accountItems = [
    { icon: User, label: t.profile.personalInfo, action: () => {} },
    { icon: Phone, label: t.profile.phone, right: "+852 9123 4567", action: () => {} },
    { icon: Mail, label: t.profile.email, right: "user@example.com", action: () => {} },
  ];

  const featureItems = [
    { icon: ClipboardList, label: t.profile.orderHistory, action: () => navigate("/orders") },
    { icon: FileText, label: t.profile.diagnosisReports, action: () => navigate("/reports") },
    { icon: Building2, label: t.profile.savedInstitutions, right: `${favorites.size}`, action: () => navigate("/saved-institutions") },
    { icon: Ticket, label: t.profile.coupons, right: `${availableCoupons}`, action: () => navigate("/coupons") },
    { icon: Gift, label: t.profile.referralRewards, right: "250 coins", action: () => navigate("/referral") },
  ];

  const settingsItems = [
    {
      icon: Globe,
      label: t.profile.languageSettings,
      right: language === "en" ? t.profile.english : t.profile.chinese,
      action: () => setLanguage(language === "en" ? "zh-HK" : "en"),
    },
  ];

  const renderMenuGroup = (items: typeof accountItems) => (
    <Card className="mb-4 border-0 shadow-sm">
      <CardContent className="divide-y divide-border p-0">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted"
          >
            <item.icon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
            {"right" in item && item.right && <span className="text-xs text-muted-foreground">{item.right}</span>}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in p-4 pt-6">
      <h1 className="mb-6 text-xl font-bold text-foreground">{t.profile.title}</h1>

      {/* Avatar card */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground">User</p>
            <p className="text-sm text-muted-foreground">user@example.com</p>
            <p className="text-xs text-muted-foreground">+852 9123 4567</p>
          </div>
          <Settings className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Account */}
      {renderMenuGroup(accountItems)}

      {/* Features */}
      {renderMenuGroup(featureItems)}

      {/* Settings */}
      {renderMenuGroup(settingsItems)}

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
