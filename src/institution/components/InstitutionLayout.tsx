import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import { Building2, LayoutDashboard, FileCheck, Globe, LogOut, Info, Stethoscope, Users, ClipboardList, BarChart3, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstitutionLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { profile, isRegistered } = useInstitution();
  const navigate = useNavigate();
  const location = useLocation();

  const isEn = language === "en";
  const approved = profile.reviewStatus === "approved";

  const sidebarItems = [
    ...(approved
      ? [
          { icon: LayoutDashboard, label: isEn ? "Dashboard" : "控制台", path: "/institution/dashboard" },
          { icon: Info, label: isEn ? "Institution Info" : "機構資訊", path: "/institution/info" },
          { icon: Stethoscope, label: isEn ? "Services" : "服務管理", path: "/institution/services" },
          { icon: Users, label: isEn ? "Doctors" : "醫生管理", path: "/institution/doctors" },
          { icon: ClipboardList, label: isEn ? "Orders" : "訂單管理", path: "/institution/orders" },
          { icon: BarChart3, label: isEn ? "Statistics" : "數據統計", path: "/institution/stats" },
        ]
      : []),
    { icon: Building2, label: isEn ? "Registration" : "機構註冊", path: "/institution/register" },
    { icon: FileCheck, label: isEn ? "Credentials" : "資質審核", path: "/institution/credentials" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{isEn ? "Institution Portal" : "機構後台"}</p>
            <p className="text-xs text-muted-foreground">{isEn ? "Management Console" : "管理控制台"}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-border pt-4">
          <button
            onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "繁體中文" : "English"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {isEn ? "Back to User App" : "返回用戶端"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">{isEn ? "Institution Portal" : "機構後台"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}>
              <Globe className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden flex border-b border-border bg-card overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive(item.path)
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstitutionLayout;
