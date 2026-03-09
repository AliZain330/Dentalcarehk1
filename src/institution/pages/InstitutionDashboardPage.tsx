import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import { Card, CardContent } from "@/components/ui/card";
import ReviewStatusBadge from "../components/ReviewStatusBadge";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import {
  CalendarDays, Users, Star, TrendingUp,
  Info, Stethoscope, ChevronRight, ClipboardList, BarChart3, Ticket, Wallet, MessageSquare,
} from "lucide-react";

const InstitutionDashboardPage: React.FC = () => {
  const { language } = useLanguage();
  const { profile } = useInstitution();
  const navigate = useNavigate();
  const isEn = language === "en";

  useEffect(() => {
    if (profile.reviewStatus !== "approved") {
      navigate("/institution/credentials");
    }
  }, [profile.reviewStatus, navigate]);

  if (profile.reviewStatus !== "approved") {
    return null;
  }

  const institutionName = profile.name || (isEn ? "Bright Dental Clinic" : "明亮牙科診所");

  const stats = [
    { icon: CalendarDays, label: isEn ? "Today's Appointments" : "今日預約", value: "12", color: "text-primary" },
    { icon: Users, label: isEn ? "Total Patients" : "總患者數", value: "1,284", color: "text-primary" },
    { icon: Star, label: isEn ? "Average Rating" : "平均評分", value: "4.8", color: "text-warning" },
    { icon: TrendingUp, label: isEn ? "Monthly Revenue" : "月收入", value: "HK$128,400", color: "text-primary" },
  ];

  const modules = [
    { icon: Info, label: isEn ? "Institution Info" : "機構資訊", desc: isEn ? "Edit profile, photos, address" : "編輯資料、照片、地址", path: "/institution/info" },
    { icon: Stethoscope, label: isEn ? "Service Management" : "服務管理", desc: isEn ? "Add, edit, list/unlist services" : "新增、編輯、上架/下架服務", path: "/institution/services" },
    { icon: Users, label: isEn ? "Doctor Management" : "醫生管理", desc: isEn ? "Manage doctors and permissions" : "管理醫生及權限", path: "/institution/doctors" },
    { icon: ClipboardList, label: isEn ? "Order Management" : "訂單管理", desc: isEn ? "In-clinic & consultation orders" : "到診及諮詢訂單", path: "/institution/orders" },
    { icon: BarChart3, label: isEn ? "Data Statistics" : "數據統計", desc: isEn ? "Revenue, orders & performance" : "營業額、訂單及績效", path: "/institution/stats" },
    { icon: Ticket, label: isEn ? "Marketing" : "營銷管理", desc: isEn ? "Coupons & campaigns" : "優惠券及活動", path: "/institution/marketing" },
    { icon: Wallet, label: isEn ? "Finance" : "財務管理", desc: isEn ? "Settlements & withdrawals" : "結算及提現管理", path: "/institution/finance" },
    { icon: MessageSquare, label: isEn ? "Reviews" : "評價管理", desc: isEn ? "View & reply to reviews" : "查看並回覆評價", path: "/institution/reviews" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEn ? `Welcome, ${institutionName}` : `歡迎，${institutionName}`}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{isEn ? "Institution Management Dashboard" : "機構管理控制台"}</p>
        </div>
        <ReviewStatusBadge status="approved" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ApiPlaceholderNotice service={isEn ? "Dashboard Analytics" : "控制台分析"} variant="inline" />

      {/* Modules */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">{isEn ? "Management Modules" : "管理模組"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m, i) => (
            <Card
              key={i}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20"
              onClick={() => navigate(m.path)}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <m.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboardPage;
