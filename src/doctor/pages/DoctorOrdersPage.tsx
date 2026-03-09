import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Video, Stethoscope, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DoctorOrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";

  const mockOrders = [
    { id: "o1", type: "in_clinic" as const, patient: "Alice L.", service: isEn ? "Dental Check-up" : "口腔檢查", date: "2026-03-10", time: "09:30", status: "pending" as const, amount: 200 },
    { id: "o2", type: "in_clinic" as const, patient: "Tom K.", service: isEn ? "Scaling & Polishing" : "潔牙及拋光", date: "2026-03-10", time: "10:30", status: "confirmed" as const, amount: 500 },
    { id: "o3", type: "consultation" as const, patient: "Jenny W.", service: isEn ? "Text Consultation" : "圖文諮詢", date: "2026-03-09", time: "14:00", status: "in_progress" as const, amount: 200 },
    { id: "o4", type: "consultation" as const, patient: "David C.", service: isEn ? "Video Consultation" : "視頻諮詢", date: "2026-03-08", time: "15:30", status: "completed" as const, amount: 380 },
    { id: "o5", type: "in_clinic" as const, patient: "Mary H.", service: isEn ? "Teeth Whitening" : "牙齒美白", date: "2026-03-07", time: "11:00", status: "completed" as const, amount: 2800 },
  ];

  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? mockOrders : tab === "in_clinic" ? mockOrders.filter((o) => o.type === "in_clinic") : mockOrders.filter((o) => o.type === "consultation");

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: isEn ? "Pending" : "待確認", cls: "bg-warning/10 text-warning border-warning/20" },
      confirmed: { label: isEn ? "Confirmed" : "已確認", cls: "bg-primary/10 text-primary border-primary/20" },
      in_progress: { label: isEn ? "In Progress" : "進行中", cls: "bg-info/10 text-info border-info/20" },
      completed: { label: isEn ? "Completed" : "已完成", cls: "bg-success/10 text-success border-success/20" },
    };
    const s = map[status] || map.pending;
    return <Badge variant="outline" className={s.cls}>{s.label}</Badge>;
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "My Orders" : "我的訂單"}</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="flex-1">{isEn ? "All" : "全部"}</TabsTrigger>
          <TabsTrigger value="in_clinic" className="flex-1">{isEn ? "In-Clinic" : "到診"}</TabsTrigger>
          <TabsTrigger value="consultation" className="flex-1">{isEn ? "Online" : "線上"}</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center"><ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/40" /><p className="mt-3 text-sm text-muted-foreground">{isEn ? "No orders" : "暫無訂單"}</p></div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => (
                <Card key={order.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {order.type === "in_clinic" ? <Stethoscope className="h-4 w-4 text-primary" /> : <Video className="h-4 w-4 text-info" />}
                        <span className="text-sm font-semibold text-foreground">{order.service}</span>
                      </div>
                      {statusBadge(order.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{isEn ? "Patient" : "患者"}: {order.patient}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{order.date} {order.time}</span>
                      <span className="font-semibold text-foreground">HK${order.amount}</span>
                    </div>
                    {order.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={() => toast({ title: isEn ? "Order accepted (mock)" : "已接受訂單（模擬）" })}>{isEn ? "Accept" : "接受"}</Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: isEn ? "Order declined (mock)" : "已拒絕訂單（模擬）" })}>{isEn ? "Decline" : "拒絕"}</Button>
                      </div>
                    )}
                    {order.status === "in_progress" && (
                      <Button size="sm" className="mt-3" onClick={() => toast({ title: isEn ? "Enter consultation (mock)" : "進入諮詢（模擬）" })}>{isEn ? "Enter Consultation" : "進入諮詢"}</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorOrdersPage;
