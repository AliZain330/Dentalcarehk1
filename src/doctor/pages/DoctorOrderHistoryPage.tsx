import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Search, Stethoscope, Video, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClinicOrders, mockConsultOrders } from "./DoctorOrdersPage";

const DoctorOrderHistoryPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const [tab, setTab] = useState<"clinic" | "consult">("clinic");
  const [search, setSearch] = useState("");

  const filteredClinic = mockClinicOrders.filter((o) =>
    o.patient.name.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase())
  );
  const filteredConsult = mockConsultOrders.filter((o) =>
    o.patient.name.toLowerCase().includes(search.toLowerCase()) || o.orderNo.toLowerCase().includes(search.toLowerCase())
  );

  const clinicStatusCls: Record<string, string> = {
    pending_acceptance: "bg-warning/10 text-warning border-warning/20",
    pending_treatment: "bg-info/10 text-info border-info/20",
    completed: "bg-success/10 text-success border-success/20",
  };
  const consultStatusCls: Record<string, string> = {
    pending_acceptance: "bg-warning/10 text-warning border-warning/20",
    in_consultation: "bg-info/10 text-info border-info/20",
    completed: "bg-success/10 text-success border-success/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <div className="animate-fade-in">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Order History" : "歷史訂單"}</h1>
        </div>
      </div>

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
            <p className="py-12 text-center text-sm text-muted-foreground">{isEn ? "No orders found" : "未找到訂單"}</p>
          ) : (
            <div className="space-y-2">
              {filteredClinic.map((o) => (
                <Card key={o.id} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/clinic/${o.id}`)}>
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Stethoscope className="h-4 w-4 text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{o.patient.name} · {o.service[lang]}</p>
                      <p className="text-xs text-muted-foreground">{o.date} {o.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${clinicStatusCls[o.status] || ""}`}>{o.status.replace(/_/g, " ")}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          filteredConsult.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">{isEn ? "No orders found" : "未找到訂單"}</p>
          ) : (
            <div className="space-y-2">
              {filteredConsult.map((o) => (
                <Card key={o.id} className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={() => navigate(`/doctor/orders/consult/${o.id}`)}>
                  <CardContent className="p-3.5 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/10"><Video className="h-4 w-4 text-info" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{o.patient.name} · {o.consultationType === "video" ? (isEn ? "Video" : "視頻") : (isEn ? "Text" : "圖文")}</p>
                      <p className="text-xs text-muted-foreground">{o.createdAt.slice(0, 10)}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${consultStatusCls[o.status] || ""}`}>{o.status.replace(/_/g, " ")}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DoctorOrderHistoryPage;
