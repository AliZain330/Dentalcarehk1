import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  User, Building2, Ticket, Gift, ChevronRight,
  ClipboardList, FileText, Heart, MessageSquare, Shield, Headphones, Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFavorites } from "@/context/FavoritesContext";
import { useCoupons } from "@/context/CouponContext";
import { useReferral } from "@/context/ReferralContext";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  right?: string;
  action: () => void;
}

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { coupons } = useCoupons();
  const { coinsBalance } = useReferral();
  const availableCoupons = coupons.filter((c) => c.status === "available").length;

  const orderItems: MenuItem[] = [
    { icon: ClipboardList, label: t.profile.inClinicOrders, action: () => navigate("/orders") },
    { icon: ClipboardList, label: t.profile.consultationOrders, action: () => navigate("/orders") },
  ];

  const featureItems: MenuItem[] = [
    { icon: Heart, label: t.profile.myFavorites, right: `${favorites.size}`, action: () => navigate("/my-favorites") },
    { icon: Ticket, label: t.profile.coupons, right: `${availableCoupons}`, action: () => navigate("/coupons") },
    { icon: Gift, label: t.profile.referralRewards, right: `${coinsBalance} coins`, action: () => navigate("/referral") },
    { icon: FileText, label: t.profile.diagnosisReports, action: () => navigate("/reports") },
    { icon: MessageSquare, label: t.profile.myReviews, action: () => navigate("/my-reviews") },
  ];

  const supportItems: MenuItem[] = [
    { icon: Headphones, label: t.profile.customerService, action: () => navigate("/customer-service") },
    { icon: Settings, label: t.profile.settings, action: () => navigate("/settings") },
  ];

  const renderMenuGroup = (items: MenuItem[]) => (
    <Card className="mb-3 border-0 shadow-sm">
      <CardContent className="divide-y divide-border p-0">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted"
          >
            <item.icon className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
            {item.right && <span className="text-xs text-muted-foreground">{item.right}</span>}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in p-4 pt-6 pb-28">
      <h1 className="mb-5 text-xl font-bold text-foreground">{t.profile.title}</h1>

      {/* Avatar card */}
      <Card className="mb-5 border-0 shadow-sm" onClick={() => navigate("/personal-info")}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-foreground">User</p>
            <p className="text-sm text-muted-foreground">user@example.com</p>
            <p className="text-xs text-muted-foreground">+852 9123 4567</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="mb-3 border-0 shadow-sm">
        <CardContent className="p-0">
          <button onClick={() => navigate("/account-security")} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium text-foreground">{t.profile.accountSecurity}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {renderMenuGroup(orderItems)}
      {renderMenuGroup(featureItems)}
      {renderMenuGroup(supportItems)}
    </div>
  );
};

export default ProfilePage;
