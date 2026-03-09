import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, CalendarDays, MessageSquare, Wallet, User } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const DoctorLayout: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const tabs = [
    { path: "/doctor/orders", icon: ClipboardList, label: isEn ? "Orders" : "訂單" },
    { path: "/doctor/schedule", icon: CalendarDays, label: isEn ? "Schedule" : "排班" },
    { path: "/doctor/reviews", icon: MessageSquare, label: isEn ? "Reviews" : "評價" },
    { path: "/doctor/earnings", icon: Wallet, label: isEn ? "Earnings" : "收入" },
    { path: "/doctor/profile", icon: User, label: isEn ? "Profile" : "我的" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background">
      <div className="pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg">
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <tab.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DoctorLayout;
