import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { User, Clock, MapPin, Stethoscope, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useDoctorContext } from "@/doctor/context/DoctorContext";
import DoctorPageHeader from "@/doctor/components/DoctorPageHeader";
import DoctorActionBar from "@/doctor/components/DoctorActionBar";
import DoctorStatusBadge from "@/doctor/components/DoctorStatusBadge";
import type { ClinicOrderStatus } from "./DoctorOrdersPage";

const statusBadgeMap: Record<ClinicOrderStatus, { type: "pending" | "confirmed" | "completed"; en: string; zh: string }> = {
  pending_acceptance: { type: "pending", en: "Pending Acceptance", zh: "待接受" },
  pending_treatment: { type: "confirmed", en: "Pending Treatment", zh: "待治療" },
  completed: { type: "completed", en: "Completed", zh: "已完成" },
};

const DoctorClinicOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";
  const { clinicOrders, updateClinicOrderStatus } = useDoctorContext();

  const order = clinicOrders.find((o) => o.id === orderId);
  if (!order) return <div className="p-8 text-center text-muted-foreground">{isEn ? "Order not found" : "未找到訂單"}</div>;

  const badge = statusBadgeMap[order.status];

  return (
    <div className="animate-fade-in pb-28">
      <DoctorPageHeader
        title={isEn ? "Order Details" : "訂單詳情"}
        subtitle={order.orderNo}
        badge={{ label: badge[lang], className: `bg-${badge.type === "pending" ? "warning" : badge.type === "confirmed" ? "primary" : "success"}/10 text-${badge.type === "pending" ? "warning" : badge.type === "confirmed" ? "primary" : "success"} border-${badge.type === "pending" ? "warning" : badge.type === "confirmed" ? "primary" : "success"}/20` }}
      />

      <div className="mx-auto max-w-lg space-y-3 p-4">
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
        <DoctorActionBar>
          {order.status === "pending_acceptance" && (
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => { updateClinicOrderStatus(order.id, "pending_treatment"); toast({ title: isEn ? "Order accepted" : "已接受訂單" }); }}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Accept Order" : "接受訂單"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { navigate(-1); toast({ title: isEn ? "Order declined" : "已拒絕訂單" }); }}>
                {isEn ? "Decline" : "拒絕"}
              </Button>
            </div>
          )}
          {order.status === "pending_treatment" && (
            <Button className="w-full" onClick={() => { updateClinicOrderStatus(order.id, "completed"); toast({ title: isEn ? "Treatment completed" : "治療已完成" }); }}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Mark Completed" : "標記完成"}
            </Button>
          )}
        </DoctorActionBar>
      )}
    </div>
  );
};

export default DoctorClinicOrderDetailPage;
