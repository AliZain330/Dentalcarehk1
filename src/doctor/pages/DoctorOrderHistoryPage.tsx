import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Search, Stethoscope, Video, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoctorContext } from "@/doctor/context/DoctorContext";
import DoctorPageHeader from "@/doctor/components/DoctorPageHeader";
import DoctorStatusBadge from "@/doctor/components/DoctorStatusBadge";
import DoctorEmptyState from "@/doctor/components/DoctorEmptyState";
import type { DoctorBadgeType } from "@/doctor/components/DoctorStatusBadge";

const clinicBadgeMap: Record<string, { type: DoctorBadgeType; en: string; zh: string }> = {
  pending_acceptance: { type: "pending", en: "Pending", zh: "待接受" },
  pending_treatment: { type: "confirmed", en: "Confirmed", zh: "待治療" },
  completed: { type: "completed", en: "Completed", zh: "已完成" },
};
const consultBadgeMap: Record<string, { type: DoctorBadgeType; en: string; zh: string }> = {
  pending_acceptance: { type: "pending", en: "Pending", zh: "待接受" },
  in_consultation: { type: "active", en: "In Progress", zh: "諮詢中" },
  completed: { type: "completed", en: "Completed", zh: "已完成" },
  rejected: { type: "rejected", en: "Rejected", zh: "已拒絕" },
};

const DoctorOrderHistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";
  const { clinicOrders, consultOrders } = useDoctorContext();

  const [tab, setTab] = useState<"clinic" | "consult">("clinic");
  const [search, setSearch] = useState("");

  const filteredClinic = clinicOrders.filter((o) =>
    o.patient.name.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase())
  );
  const filteredConsult = consultOrders.filter((o) =>
    o.patient.name.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <DoctorPageHeader title={isEn ? "Order History" : "歷史訂單"} />

      <div className="mx-auto max-w-lg p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isEn ? "Search orders..." : "搜索訂單..."} className="pl-9" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "clinic" | "consult")}>
          <TabsList className="w-full">
            <TabsTrigger value="clinic" className="flex-1"><Stethoscope className="mr-1.5 h-3.5 w-3.5" />{isEn ? "In-Clinic" : "到診"}</TabsTrigger>
            <TabsTrigger value="consult" className="flex-1"><Video className="mr-1.5 h-3.5 w-3.5" />{isEn ? "Online" : "線上"}</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "clinic" ? (
          filteredClinic.length === 0 ? (
            <DoctorEmptyState icon={<Stethoscope className="h-6 w-6 text-muted-foreground/40" />} title={isEn ? "No orders found" : "未找到訂單"} />
          ) : (
            <div className="space-y-2">
              {filteredClinic.map((o) => {
                const badge = clinicBadgeMap[o.status];
                return (
                  <Card key={o.id} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/clinic/${o.id}`)}>
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Stethoscope className="h-4 w-4 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{o.patient.name} · {o.service[lang]}</p>
                        <p className="text-xs text-muted-foreground">{o.date} {o.time}</p>
                      </div>
                      <DoctorStatusBadge status={badge.type} label={badge[lang]} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          filteredConsult.length === 0 ? (
            <DoctorEmptyState icon={<Video className="h-6 w-6 text-muted-foreground/40" />} title={isEn ? "No orders found" : "未找到訂單"} />
          ) : (
            <div className="space-y-2">
              {filteredConsult.map((o) => {
                const badge = consultBadgeMap[o.status];
                return (
                  <Card key={o.id} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/consult/${o.id}`)}>
                    <CardContent className="p-3.5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10"><Video className="h-4 w-4 text-info" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{o.patient.name} · {o.consultationType === "video" ? (isEn ? "Video" : "視頻") : (isEn ? "Text" : "圖文")}</p>
                        <p className="text-xs text-muted-foreground">{o.createdAt.slice(0, 10)}</p>
                      </div>
                      <DoctorStatusBadge status={badge.type} label={badge[lang]} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorOrderHistoryPage;
