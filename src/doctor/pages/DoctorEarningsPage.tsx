import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Stethoscope, Video, ArrowRight, Minus } from "lucide-react";

interface EarningEntry {
  id: string;
  orderNo: string;
  patient: string;
  type: "clinic" | "consult";
  desc: { en: string; zh: string };
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  date: string;
  status: "settled" | "pending";
}

const mockEarnings: EarningEntry[] = [
  { id: "e1", orderNo: "IC20260310001", patient: "Alice L.", type: "clinic", desc: { en: "Dental Check-up", zh: "口腔檢查" }, grossAmount: 200, platformFee: 20, netAmount: 180, date: "2026-03-09", status: "settled" },
  { id: "e2", orderNo: "OC20260309001", patient: "Jenny W.", type: "consult", desc: { en: "Text Consultation", zh: "圖文諮詢" }, grossAmount: 200, platformFee: 30, netAmount: 170, date: "2026-03-09", status: "pending" },
  { id: "e3", orderNo: "IC20260310002", patient: "Tom K.", type: "clinic", desc: { en: "Scaling & Polishing", zh: "潔牙及拋光" }, grossAmount: 500, platformFee: 50, netAmount: 450, date: "2026-03-08", status: "settled" },
  { id: "e4", orderNo: "OC20260309002", patient: "David C.", type: "consult", desc: { en: "Video Consultation", zh: "視頻諮詢" }, grossAmount: 380, platformFee: 57, netAmount: 323, date: "2026-03-08", status: "settled" },
  { id: "e5", orderNo: "IC20260310003", patient: "Mary H.", type: "clinic", desc: { en: "Teeth Whitening", zh: "牙齒美白" }, grossAmount: 2800, platformFee: 280, netAmount: 2520, date: "2026-03-07", status: "settled" },
  { id: "e6", orderNo: "OC20260309003", patient: "Susan L.", type: "consult", desc: { en: "Text Consultation", zh: "圖文諮詢" }, grossAmount: 200, platformFee: 30, netAmount: 170, date: "2026-03-06", status: "pending" },
];

const DoctorEarningsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";
  const [period, setPeriod] = useState("month");

  const weekEntries = mockEarnings.slice(0, 4);
  const monthEntries = mockEarnings;
  const entries = period === "week" ? weekEntries : monthEntries;

  const totalGross = entries.reduce((a, e) => a + e.grossAmount, 0);
  const totalFee = entries.reduce((a, e) => a + e.platformFee, 0);
  const totalNet = entries.reduce((a, e) => a + e.netAmount, 0);
  const clinicNet = entries.filter((e) => e.type === "clinic").reduce((a, e) => a + e.netAmount, 0);
  const consultNet = entries.filter((e) => e.type === "consult").reduce((a, e) => a + e.netAmount, 0);

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "Earnings Details" : "收入明細"}</h1>

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="week" className="flex-1">{isEn ? "This Week" : "本週"}</TabsTrigger>
          <TabsTrigger value="month" className="flex-1">{isEn ? "This Month" : "本月"}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Total earnings card */}
      <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-primary to-primary/80">
        <CardContent className="p-5">
          <p className="text-sm text-primary-foreground/80">{isEn ? "Net Earnings" : "淨收入"}</p>
          <p className="text-3xl font-bold text-primary-foreground mt-1">HK${totalNet.toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-4 text-xs text-primary-foreground/60">
            <span>{isEn ? "Gross" : "總額"}: HK${totalGross.toLocaleString()}</span>
            <span>{isEn ? "Fees" : "平台費"}: -HK${totalFee.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Split cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Stethoscope className="h-4 w-4 text-primary" /></div>
            <div><p className="text-sm font-bold text-foreground">HK${clinicNet.toLocaleString()}</p><p className="text-xs text-muted-foreground">{isEn ? "In-Clinic" : "到診"}</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10"><Video className="h-4 w-4 text-info" /></div>
            <div><p className="text-sm font-bold text-foreground">HK${consultNet.toLocaleString()}</p><p className="text-xs text-muted-foreground">{isEn ? "Online" : "線上"}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Entries */}
      <h3 className="mb-2 text-sm font-semibold text-foreground">{isEn ? "Transactions" : "交易紀錄"}</h3>
      <div className="space-y-2">
        {entries.map((e) => (
          <Card key={e.id} className="border-0 shadow-sm">
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {e.type === "clinic" ? <Stethoscope className="h-4 w-4 text-primary" /> : <Video className="h-4 w-4 text-info" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{e.patient} · {e.desc[lang]}</p>
                    <p className="text-[10px] text-muted-foreground">{e.orderNo} · {e.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${e.status === "settled" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                  {e.status === "settled" ? (isEn ? "Settled" : "已結算") : (isEn ? "Pending" : "待結算")}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
                <span>{isEn ? "Gross" : "總額"}: HK${e.grossAmount}</span>
                <span className="flex items-center gap-0.5"><Minus className="h-3 w-3" />{isEn ? "Fee" : "費用"}: HK${e.platformFee}</span>
                <span className="font-semibold text-success">{isEn ? "Net" : "淨額"}: HK${e.netAmount}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorEarningsPage;
