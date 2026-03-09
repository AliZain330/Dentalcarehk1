import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Globe, Bell, FileText, Shield, LogOut, ChevronRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DoctorSettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [notifications, setNotifications] = useState({ orders: true, reviews: true, system: false });
  const [showLogout, setShowLogout] = useState(false);
  const [showPolicy, setShowPolicy] = useState<"privacy" | "agreement" | null>(null);

  return (
    <div className="animate-fade-in">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Settings" : "設定"}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-lg p-4 space-y-4">
        {/* Language */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground px-1">{isEn ? "LANGUAGE" : "語言"}</p>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              {[{ code: "en", label: "English" }, { code: "zh-HK", label: "繁體中文" }].map((lang) => (
                <button key={lang.code} className="flex w-full items-center gap-3 px-4 py-3.5" onClick={() => setLanguage(lang.code as "en" | "zh-HK")}>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-left text-sm font-medium text-foreground">{lang.label}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground px-1">{isEn ? "NOTIFICATIONS" : "通知"}</p>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              {[
                { key: "orders" as const, label: isEn ? "Order Notifications" : "訂單通知", desc: isEn ? "New orders and status updates" : "新訂單和狀態更新" },
                { key: "reviews" as const, label: isEn ? "Review Notifications" : "評價通知", desc: isEn ? "New patient reviews" : "新患者評價" },
                { key: "system" as const, label: isEn ? "System Notifications" : "系統通知", desc: isEn ? "Platform announcements" : "平台公告" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium text-foreground">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                  </div>
                  <Switch checked={notifications[item.key]} onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground px-1">{isEn ? "ABOUT" : "關於"}</p>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              <button className="flex w-full items-center gap-3 px-4 py-3.5" onClick={() => setShowPolicy("privacy")}>
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left text-sm font-medium text-foreground">{isEn ? "Privacy Policy" : "隱私政策"}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3.5" onClick={() => setShowPolicy("agreement")}>
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-left text-sm font-medium text-foreground">{isEn ? "User Agreement" : "用戶協議"}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => setShowLogout(true)}>
          <CardContent className="p-4 flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4 text-destructive" />
            <span className="text-sm font-semibold text-destructive">{isEn ? "Logout" : "登出"}</span>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground pt-2">{isEn ? "Dentist App v1.0.0" : "醫生應用 v1.0.0"}</p>
      </div>

      {/* Logout confirm */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{isEn ? "Confirm Logout" : "確認登出"}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">{isEn ? "Are you sure you want to log out of the Dentist App?" : "確定要登出醫生應用嗎？"}</p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogout(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button variant="destructive" className="flex-1" onClick={() => { setShowLogout(false); navigate("/doctor/login"); toast({ title: isEn ? "Logged out" : "已登出" }); }}>{isEn ? "Logout" : "登出"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Policy dialog */}
      <Dialog open={!!showPolicy} onOpenChange={(open) => !open && setShowPolicy(null)}>
        <DialogContent className="max-w-sm max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showPolicy === "privacy" ? (isEn ? "Privacy Policy" : "隱私政策") : (isEn ? "User Agreement" : "用戶協議")}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{isEn ? "This is a placeholder for the full policy document." : "這是完整政策文件的佔位符。"}</p>
            <p>{isEn ? "The actual content will be provided when the platform launches." : "實際內容將在平台啟動時提供。"}</p>
            <p className="text-xs italic">{isEn ? "Last updated: March 2026" : "最後更新：2026年3月"}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSettingsPage;
