import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { Settings, User, Shield, Wallet, ClipboardList, MessageSquare, HelpCircle, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoctorContext } from "@/doctor/context/DoctorContext";
import DoctorSettingsItem from "@/doctor/components/DoctorSettingsItem";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const DoctorProfilePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const { profile, clinicOrders, consultOrders } = useDoctorContext();
  const [showUploadNotice, setShowUploadNotice] = useState(false);

  const totalOrders = clinicOrders.length + consultOrders.length;
  const totalEarnings = [...clinicOrders, ...consultOrders].reduce((a, o) => a + o.amount, 0);

  const sections = [
    {
      title: isEn ? "ACCOUNT" : "帳戶",
      items: [
        { icon: User, label: isEn ? "Personal Information" : "個人資訊", desc: isEn ? "Profile, specialties, avatar" : "資料、專科、頭像", path: "/doctor/personal-info" },
        { icon: Shield, label: isEn ? "Account Security" : "帳戶安全", desc: isEn ? "Password, login devices" : "密碼、登入裝置", path: "/doctor/account-security" },
      ],
    },
    {
      title: isEn ? "PRACTICE" : "執業",
      items: [
        { icon: Settings, label: isEn ? "Service Settings" : "服務設定", desc: isEn ? "Consultation, pricing, schedule" : "接診、定價、排班", path: "/doctor/service-settings" },
        { icon: ClipboardList, label: isEn ? "Order History" : "歷史訂單", desc: isEn ? "All past orders" : "所有過往訂單", path: "/doctor/order-history" },
        { icon: MessageSquare, label: isEn ? "Review Management" : "評價管理", desc: isEn ? "View and reply to reviews" : "查看和回覆評價", path: "/doctor/reviews" },
        { icon: Wallet, label: isEn ? "Earnings Details" : "收入明細", desc: isEn ? "Fees, commissions, payouts" : "費用、佣金、結算", path: "/doctor/earnings" },
      ],
    },
    {
      title: isEn ? "SUPPORT" : "支援",
      items: [
        { icon: HelpCircle, label: isEn ? "Customer Service" : "客服中心", desc: isEn ? "FAQ, feedback, appeal" : "常見問題、反饋、申訴", path: "/doctor/support" },
        { icon: Cog, label: isEn ? "Settings" : "設定", desc: isEn ? "Language, notifications, about" : "語言、通知、關於", path: "/doctor/settings" },
      ],
    },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      {/* Profile header */}
      <Card className="mb-5 border-0 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <span className="text-xl font-bold text-primary-foreground">{isEn ? profile.nameEn.split(" ").map(n => n[0]).join("") : profile.nameZh[0]}</span>
              </div>
              <button
                className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-border shadow-sm"
                onClick={() => setShowUploadNotice(true)}
              >
                <Camera className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground">{isEn ? `Dr. ${profile.nameEn}` : `${profile.nameZh}醫生`}</h2>
              <p className="text-sm text-muted-foreground">{isEn ? "General Dentistry" : "一般牙科"}</p>
              <div className="mt-1 flex items-center gap-2">
                {profile.verified && <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-[10px]">{isEn ? "Verified" : "已認證"}</Badge>}
                <Badge variant="outline" className="text-[10px]">HKU–SZH</Badge>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">{totalOrders}</p>
              <p className="text-[10px] text-muted-foreground">{isEn ? "Orders" : "訂單"}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">4.8</p>
              <p className="text-[10px] text-muted-foreground">{isEn ? "Rating" : "評分"}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-2.5 text-center">
              <p className="text-lg font-bold text-foreground">${(totalEarnings / 1000).toFixed(1)}K</p>
              <p className="text-[10px] text-muted-foreground">{isEn ? "Earned" : "收入"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu sections */}
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground px-1">{section.title}</p>
          <div className="space-y-1.5">
            {section.items.map((item) => (
              <DoctorSettingsItem key={item.label} icon={item.icon} label={item.label} desc={item.desc} onClick={() => navigate(item.path)} />
            ))}
          </div>
        </div>
      ))}

      {/* Upload notice */}
      {showUploadNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUploadNotice(false)}>
          <Card className="max-w-sm" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <ApiPlaceholderNotice service={isEn ? "Avatar Upload" : "頭像上傳"} />
              <Button className="mt-4 w-full" variant="outline" onClick={() => setShowUploadNotice(false)}>{isEn ? "Close" : "關閉"}</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorProfilePage;
