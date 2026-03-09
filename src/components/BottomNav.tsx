import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ClipboardList, FileText, User } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const items = [
    { to: "/", icon: Home, label: t.nav.home },
    { to: "/orders", icon: ClipboardList, label: t.nav.orders },
    { to: "/reports", icon: FileText, label: t.nav.reports },
    { to: "/profile", icon: User, label: t.nav.profile },
  ];

  // Only show bottom nav on main tab pages and secondary pages that aren't full-screen flows
  const showNavPaths = ["/", "/orders", "/reports", "/profile", "/institutions", "/coupons", "/referral", "/referral/records", "/saved-institutions"];
  const isShowNav = showNavPaths.includes(location.pathname);
  if (!isShowNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
      <div className="mx-auto flex h-[var(--bottom-nav-height)] max-w-lg items-center justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors ${
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
