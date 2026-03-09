import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import {
  Building2, LayoutDashboard, FileCheck, Globe, LogOut, Info, Stethoscope,
  Users, ClipboardList, BarChart3, Ticket, Wallet, MessageSquare, Tooth,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InstitutionLayout: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { profile } = useInstitution();
  const navigate = useNavigate();
  const location = useLocation();

  const isEn = language === "en";
  const approved = profile.reviewStatus === "approved";

  const managementItems = approved
    ? [
        { icon: LayoutDashboard, label: isEn ? "Dashboard" : "控制台", path: "/institution/dashboard" },
        { icon: Info, label: isEn ? "Institution Info" : "機構資訊", path: "/institution/info" },
        { icon: Stethoscope, label: isEn ? "Services" : "服務管理", path: "/institution/services" },
        { icon: Users, label: isEn ? "Doctors" : "醫生管理", path: "/institution/doctors" },
        { icon: ClipboardList, label: isEn ? "Orders" : "訂單管理", path: "/institution/orders" },
      ]
    : [];

  const analyticsItems = approved
    ? [
        { icon: BarChart3, label: isEn ? "Statistics" : "數據統計", path: "/institution/stats" },
        { icon: Ticket, label: isEn ? "Marketing" : "營銷管理", path: "/institution/marketing" },
        { icon: Wallet, label: isEn ? "Finance" : "財務管理", path: "/institution/finance" },
        { icon: MessageSquare, label: isEn ? "Reviews" : "評價管理", path: "/institution/reviews" },
      ]
    : [];

  const onboardingItems = [
    { icon: Building2, label: isEn ? "Registration" : "機構註冊", path: "/institution/register" },
    { icon: FileCheck, label: isEn ? "Credentials" : "資質審核", path: "/institution/credentials" },
  ];

  const allItems = [...managementItems, ...analyticsItems, ...onboardingItems];

  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ item }: { item: typeof allItems[0] }) => (
    <button
      onClick={() => navigate(item.path)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(item.path)
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Tooth className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{isEn ? "Institution Portal" : "機構後台"}</p>
            <p className="text-[11px] text-muted-foreground">{isEn ? "Management Console" : "管理控制台"}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {managementItems.length > 0 && (
            <>
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {isEn ? "Management" : "管理"}
              </p>
              {managementItems.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </>
          )}

          {analyticsItems.length > 0 && (
            <>
              <Separator className="my-2" />
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {isEn ? "Analytics & Growth" : "分析及增長"}
              </p>
              {analyticsItems.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </>
          )}

          <Separator className="my-2" />
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {isEn ? "Onboarding" : "入駐"}
          </p>
          {onboardingItems.map((item) => (
            <NavButton key={item.path} item={item} />
          ))}
        </nav>

        <div className="px-3 pb-3 space-y-0.5 border-t border-border pt-3">
          <button
            onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === "en" ? "繁體中文" : "English"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {isEn ? "Back to User App" : "返回用戶端"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Tooth className="h-4 w-4 text-primary-foreground" />
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
          {allItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
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

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstitutionLayout;
