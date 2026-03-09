import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, User, Clock, MapPin, Stethoscope, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { mockClinicOrders, type ClinicOrderStatus } from "./DoctorOrdersPage";

const DoctorClinicOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const original = mockClinicOrders.find((o) => o.id === orderId);
  const [status, setStatus] = useState<ClinicOrderStatus>(original?.status || "pending_acceptance");

  if (!original) return <div className="p-8 text-center text-muted-foreground">Not found</div>;
  const order = { ...original, status };

  const statusMap: Record<ClinicOrderStatus, { label: string; cls: string }> = {
    pending_acceptance: { label: isEn ? "Pending Acceptance" : "待接受", cls: "bg-warning/10 text-warning border-warning/20" },
    pending_treatment: { label: isEn ? "Pending Treatment" : "待治療", cls: "bg-primary/10 text-primary border-primary/20" },
    completed: { label: isEn ? "Completed" : "已完成", cls: "bg-success/10 text-success border-success/20" },
  };
  const st = statusMap[order.status];

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Order Details" : "訂單詳情"}</h1>
          <p className="text-xs text-muted-foreground">{order.orderNo}</p>
        </div>
        <Badge variant="outline" className={st.cls}>{st.label}</Badge>
      </div>

      <div className="space-y-3">
        {/* Patient */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "PATIENT" : "患者"}</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">{order.patient.name}</p>
                <p className="text-xs text-muted-foreground">{order.patient.gender[lang]} · {order.patient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "SERVICE" : "服務"}</p>
            <div className="flex items-center gap-2 mb-2"><Stethoscope className="h-4 w-4 text-primary" /><span className="text-sm font-semibold text-foreground">{order.service[lang]}</span></div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">{isEn ? "Date" : "日期"}</span><p className="font-medium text-foreground">{order.date}</p></div>
              <div><span className="text-muted-foreground">{isEn ? "Time" : "時間"}</span><p className="font-medium text-foreground">{order.time}</p></div>
              <div><span className="text-muted-foreground">{isEn ? "Duration" : "時長"}</span><p className="font-medium text-foreground">{order.duration} {isEn ? "min" : "分鐘"}</p></div>
              <div><span className="text-muted-foreground">{isEn ? "Amount" : "金額"}</span><p className="font-medium text-primary">HK${order.amount.toLocaleString()}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Institution */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "INSTITUTION" : "機構"}</p>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-foreground">{order.institution[lang]}</span></div>
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "NOTES" : "備註"}</p>
              <p className="text-sm text-foreground">{order.notes[lang]}</p>
            </CardContent>
          </Card>
        )}

        {/* Order info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "ORDER INFO" : "訂單資訊"}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">{isEn ? "Order No." : "訂單編號"}</span><p className="font-medium text-foreground">{order.orderNo}</p></div>
              <div><span className="text-muted-foreground">{isEn ? "Created" : "建立時間"}</span><p className="font-medium text-foreground">{order.createdAt.replace("T", " ").slice(0, 16)}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {order.status !== "completed" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
          <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
            {order.status === "pending_acceptance" && (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { setStatus("pending_treatment"); toast({ title: isEn ? "Order accepted" : "已接受訂單" }); }}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Accept Order" : "接受訂單"}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { navigate(-1); toast({ title: isEn ? "Order declined (mock)" : "已拒絕訂單（模擬）" }); }}>
                  {isEn ? "Decline" : "拒絕"}
                </Button>
              </div>
            )}
            {order.status === "pending_treatment" && (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => toast({ title: isEn ? "Treatment started (mock)" : "已開始治療（模擬）" })}>
                  {isEn ? "Mark Treatment Started" : "標記開始治療"}
                </Button>
                <Button className="w-full" onClick={() => { setStatus("completed"); toast({ title: isEn ? "Treatment completed" : "治療已完成" }); }}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Mark Completed" : "標記完成"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorClinicOrderDetailPage;
