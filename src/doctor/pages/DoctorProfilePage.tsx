import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Settings, User, Shield, Bell, Globe, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const DoctorProfilePage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const menuItems = [
    { icon: Settings, label: isEn ? "Service Settings" : "服務設定", desc: isEn ? "Consultation, pricing, schedule" : "接診、定價、排班", path: "/doctor/service-settings" },
    { icon: User, label: isEn ? "Edit Profile" : "編輯資料", desc: isEn ? "Name, bio, specialties" : "姓名、簡介、專科", path: "/doctor/profile-completion" },
    { icon: Shield, label: isEn ? "Account Security" : "帳戶安全", desc: isEn ? "Password, devices" : "密碼、裝置", action: () => toast({ title: isEn ? "Coming soon" : "即將推出" }) },
    { icon: Bell, label: isEn ? "Notifications" : "通知設定", desc: isEn ? "Manage alerts" : "管理提醒", action: () => toast({ title: isEn ? "Coming soon" : "即將推出" }) },
    { icon: Globe, label: isEn ? "Language" : "語言", desc: isEn ? "English / 繁體中文" : "English / 繁體中文", action: () => setLanguage(isEn ? "zh-HK" : "en") },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      {/* Profile header */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-xl font-bold text-primary-foreground">{isEn ? "CW" : "陳"}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{isEn ? "Dr. Chen Wei" : "陳偉醫生"}</h2>
            <p className="text-sm text-muted-foreground">{isEn ? "General Dentistry • HKU–SZH" : "一般牙科 • 港大深圳醫院"}</p>
            <Badge variant="outline" className="mt-1 bg-success/10 text-success border-success/20">{isEn ? "Verified" : "已認證"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, i) => (
          <Card key={i} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => item.path ? navigate(item.path) : item.action?.()}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><item.icon className="h-4 w-4 text-foreground" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}

        <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => navigate("/doctor/login")}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10"><LogOut className="h-4 w-4 text-destructive" /></div>
            <p className="text-sm font-semibold text-destructive">{isEn ? "Logout" : "登出"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
