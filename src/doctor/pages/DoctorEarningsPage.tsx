import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Wallet, Stethoscope, Video } from "lucide-react";

const DoctorEarningsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";
  const [period, setPeriod] = useState("month");

  const stats = {
    week: { total: 4800, inClinic: 3500, online: 1300, orders: 8 },
    month: { total: 28600, inClinic: 21200, online: 7400, orders: 42 },
  };

  const s = period === "week" ? stats.week : stats.month;

  const transactions = [
    { id: "e1", desc: isEn ? "Check-up — Alice L." : "檢查 — Alice L.", amount: 200, type: "in_clinic", date: "2026-03-09" },
    { id: "e2", desc: isEn ? "Text Consultation — Jenny W." : "圖文諮詢 — Jenny W.", amount: 200, type: "online", date: "2026-03-09" },
    { id: "e3", desc: isEn ? "Scaling — Tom K." : "潔牙 — Tom K.", amount: 500, type: "in_clinic", date: "2026-03-08" },
    { id: "e4", desc: isEn ? "Video Consultation — David C." : "視頻諮詢 — David C.", amount: 380, type: "online", date: "2026-03-08" },
    { id: "e5", desc: isEn ? "Whitening — Mary H." : "美白 — Mary H.", amount: 2800, type: "in_clinic", date: "2026-03-07" },
  ];

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "Earnings" : "收入"}</h1>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="week" className="flex-1">{isEn ? "This Week" : "本週"}</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">{isEn ? "This Month" : "本月"}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Summary */}
      <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-primary to-primary/80">
        <CardContent className="p-5">
          <p className="text-sm text-primary-foreground/80">{isEn ? "Total Earnings" : "總收入"}</p>
          <p className="text-3xl font-bold text-primary-foreground mt-1">HK${s.total.toLocaleString()}</p>
          <p className="text-xs text-primary-foreground/60 mt-1">{s.orders} {isEn ? "orders" : "個訂單"}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Stethoscope className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-sm font-bold text-foreground">HK${s.inClinic.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{isEn ? "In-Clinic" : "到診"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10"><Video className="h-4 w-4 text-info" /></div>
            <div>
              <p className="text-sm font-bold text-foreground">HK${s.online.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{isEn ? "Online" : "線上"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="mb-2 text-sm font-semibold text-foreground">{isEn ? "Recent Transactions" : "近期交易"}</h3>
      <div className="space-y-2">
        {transactions.map((t) => (
          <Card key={t.id} className="border-0 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {t.type === "in_clinic" ? <Stethoscope className="h-4 w-4 text-primary" /> : <Video className="h-4 w-4 text-info" />}
                <div>
                  <p className="text-sm text-foreground">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-success">+HK${t.amount}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorEarningsPage;
