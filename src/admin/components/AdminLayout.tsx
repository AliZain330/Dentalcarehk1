import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  LayoutDashboard, Building2, Stethoscope, Users, ClipboardList,
  Ticket, Wallet, Settings, Globe, LogOut, BarChart3, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminLayout: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isEn = language === "en";

  const mainItems = [
    { icon: LayoutDashboard, label: isEn ? "Dashboard" : "儀表板", path: "/admin/dashboard" },
    { icon: Building2, label: isEn ? "Institutions" : "機構管理", path: "/admin/institutions" },
    { icon: Stethoscope, label: isEn ? "Doctors" : "醫生管理", path: "/admin/doctors" },
    { icon: Users, label: isEn ? "Users" : "用戶管理", path: "/admin/users" },
    { icon: ClipboardList, label: isEn ? "Orders" : "訂單管理", path: "/admin/orders" },
  ];

  const analyticsItems = [
    { icon: BarChart3, label: isEn ? "Statistics" : "數據統計", path: "/admin/stats" },
    { icon: Ticket, label: isEn ? "Marketing" : "營銷管理", path: "/admin/marketing" },
    { icon: Wallet, label: isEn ? "Financials" : "財務管理", path: "/admin/financials" },
  ];

  const systemItems = [
    { icon: Settings, label: isEn ? "Settings" : "系統設定", path: "/admin/settings" },
  ];

  const allItems = [...mainItems, ...analyticsItems, ...systemItems];
  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ item }: { item: (typeof allItems)[0] }) => (
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
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{isEn ? "Admin Portal" : "管理後台"}</p>
            <p className="text-[11px] text-muted-foreground">{isEn ? "Platform Console" : "平台管理控制台"}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {isEn ? "Management" : "管理"}
          </p>
          {mainItems.map((item) => <NavButton key={item.path} item={item} />)}

          <Separator className="my-2" />
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {isEn ? "Analytics & Growth" : "分析及增長"}
          </p>
          {analyticsItems.map((item) => <NavButton key={item.path} item={item} />)}

          <Separator className="my-2" />
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {isEn ? "System" : "系統"}
          </p>
          {systemItems.map((item) => <NavButton key={item.path} item={item} />)}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">{isEn ? "Admin Portal" : "管理後台"}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}>
            <Globe className="h-4 w-4" />
          </Button>
        </header>

        <div className="lg:hidden flex border-b border-border bg-card overflow-x-auto">
          {allItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive(item.path) ? "border-primary text-primary" : "border-transparent text-muted-foreground"
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

export default AdminLayout;
