import React from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/settings/basic", label: "Basic Settings", labelZh: "基本設定" },
  { to: "/admin/settings/language", label: "Language Settings", labelZh: "語言設定" },
  { to: "/admin/settings/permissions", label: "Permission Management", labelZh: "權限管理" },
  { to: "/admin/settings/admin-accounts", label: "Admin Accounts", labelZh: "管理員帳號" },
  { to: "/admin/settings/logs", label: "Log Management", labelZh: "日誌管理" },
];

const SystemSettingsNav: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            {isEn ? item.label : item.labelZh}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SystemSettingsNav;
