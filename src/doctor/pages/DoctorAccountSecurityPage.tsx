import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Lock, Smartphone, Key } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DoctorAccountSecurityPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const items = [
    { icon: Key, label: isEn ? "Change Password" : "修改密碼", desc: isEn ? "Update your login password" : "更新登入密碼" },
    { icon: Smartphone, label: isEn ? "Login Devices" : "登入裝置", desc: isEn ? "Manage active sessions" : "管理活躍設備" },
    { icon: Lock, label: isEn ? "Two-Factor Auth" : "雙重驗證", desc: isEn ? "Enhanced account protection" : "增強帳戶保護" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Account Security" : "帳戶安全"}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-lg space-y-2 p-4">
        {items.map((item) => (
          <Card key={item.label} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => toast({ title: isEn ? "Coming soon" : "即將推出" })}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><item.icon className="h-4 w-4 text-foreground" /></div>
              <div className="flex-1"><p className="text-sm font-semibold text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorAccountSecurityPage;
