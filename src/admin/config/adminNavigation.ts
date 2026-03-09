import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Users,
  ClipboardList,
  AlertTriangle,
  BarChart3,
  Ticket,
  Wallet,
  Settings,
} from "lucide-react";
import type { ElementType } from "react";

export interface AdminNavItem {
  icon: ElementType;
  labelEn: string;
  labelZh: string;
  path: string;
}

export const adminNavGroups: {
  titleEn: string;
  titleZh: string;
  items: AdminNavItem[];
}[] = [
  {
    titleEn: "Management",
    titleZh: "管理",
    items: [
      { icon: LayoutDashboard, labelEn: "Dashboard", labelZh: "儀表板", path: "/admin/dashboard" },
      { icon: Building2, labelEn: "Institutions", labelZh: "機構管理", path: "/admin/institutions" },
      { icon: Stethoscope, labelEn: "Doctors", labelZh: "醫生管理", path: "/admin/doctors" },
      { icon: Users, labelEn: "Users", labelZh: "用戶管理", path: "/admin/users" },
      { icon: ClipboardList, labelEn: "Orders", labelZh: "訂單管理", path: "/admin/orders" },
      { icon: AlertTriangle, labelEn: "Disputes", labelZh: "爭議管理", path: "/admin/disputes" },
    ],
  },
  {
    titleEn: "Analytics & Growth",
    titleZh: "分析及增長",
    items: [
      { icon: BarChart3, labelEn: "Statistics", labelZh: "數據統計", path: "/admin/stats" },
      { icon: Ticket, labelEn: "Marketing", labelZh: "營銷管理", path: "/admin/marketing" },
      { icon: Wallet, labelEn: "Financials", labelZh: "財務管理", path: "/admin/financials" },
    ],
  },
  {
    titleEn: "System",
    titleZh: "系統",
    items: [{ icon: Settings, labelEn: "Settings", labelZh: "系統設定", path: "/admin/settings/basic" }],
  },
];

export const adminFlatNavItems = adminNavGroups.flatMap((group) => group.items);
