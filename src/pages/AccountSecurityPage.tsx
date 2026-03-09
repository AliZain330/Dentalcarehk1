import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Smartphone, Mail, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AccountSecurityPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const s = t.accountSecurity;

  const items = [
    { icon: Lock, label: s.changePassword, path: "/account/change-password" },
    { icon: Smartphone, label: s.changeMobile, path: "/account/change-mobile" },
    { icon: Mail, label: s.changeEmail, path: "/account/change-email" },
    { icon: Monitor, label: s.loginDevices, path: "/account/devices" },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.title}</h1>
      </div>
      <Card className="border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          {items.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecurityPage;
