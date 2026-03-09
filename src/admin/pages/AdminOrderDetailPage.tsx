import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, ClipboardList, User, Building2, Stethoscope, Wallet,
  Calendar, CreditCard, AlertTriangle,
} from "lucide-react";
import { adminOrders, adminDisputes } from "../data/adminOrderData";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const order = adminOrders.find((o) => o.id === id);
  const dispute = order?.disputeId ? adminDisputes.find((d) => d.id === order.disputeId) : undefined;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ClipboardList className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{isEn ? "Order not found" : "找不到訂單"}</p>
        <Button variant="link" onClick={() => navigate("/admin/orders")}>{isEn ? "Back" : "返回"}</Button>
      </div>
    );
  }

  const Row = ({ icon: Icon, label, value, extra }: { icon: React.ElementType; label: string; value: string; extra?: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1"><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium text-foreground">{value}</p></div>
      {extra}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground font-mono">{order.id}</h1>
            <AdminStatusBadge status={order.status} />
            {order.hasDispute && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />{isEn ? "Dispute" : "爭議"}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{order.createdAt}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Order Information" : "訂單信息"}</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border">
            <Row icon={ClipboardList} label={isEn ? "Service" : "服務"} value={order.service} extra={<Badge variant="outline">{order.type === "in_clinic" ? (isEn ? "In-Clinic" : "到店") : (isEn ? "Consultation" : "問診")}</Badge>} />
            {order.appointmentDate && <Row icon={Calendar} label={isEn ? "Appointment" : "預約時間"} value={order.appointmentDate} />}
            <Row icon={Wallet} label={isEn ? "Amount" : "金額"} value={`HK$${order.amount.toLocaleString()}`} extra={<AdminStatusBadge status={order.settlementStatus} />} />
            <Row icon={CreditCard} label={isEn ? "Payment" : "支付方式"} value={order.paymentMethod} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Parties" : "相關方"}</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border">
            <Row
              icon={User}
              label={isEn ? "User" : "用戶"}
              value={`${order.userName} (${order.userPhone})`}
              extra={<Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${order.userId}`)}>{isEn ? "View" : "查看"}</Button>}
            />
            <Row
              icon={Building2}
              label={isEn ? "Institution" : "機構"}
              value={order.institution}
              extra={order.institutionId ? <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/institutions/${order.institutionId}`)}>{isEn ? "View" : "查看"}</Button> : undefined}
            />
            <Row
              icon={Stethoscope}
              label={isEn ? "Doctor" : "醫生"}
              value={order.doctor}
              extra={<Button variant="ghost" size="sm" onClick={() => navigate(`/admin/doctors/${order.doctorId}`)}>{isEn ? "View" : "查看"}</Button>}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dispute section */}
      {dispute && (
        <Card className="border-warning/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />{isEn ? "Dispute Details" : "爭議詳情"}</CardTitle>
              <AdminStatusBadge status={dispute.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">{isEn ? "Source" : "來源"}</p><p className="font-medium">{dispute.sourceName} ({isEn ? dispute.source : { user: "用戶", institution: "機構", doctor: "醫生" }[dispute.source]})</p></div>
              <div><p className="text-xs text-muted-foreground">{isEn ? "Filed" : "提交日期"}</p><p className="font-medium">{dispute.createdAt}</p></div>
            </div>
            <div><p className="text-xs text-muted-foreground mb-1">{isEn ? "Subject" : "主題"}</p><p className="text-sm font-semibold">{dispute.subject}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">{isEn ? "Description" : "描述"}</p><p className="text-sm">{dispute.description}</p></div>
            {dispute.evidence.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isEn ? "Evidence" : "證據"}</p>
                <div className="flex flex-wrap gap-2">
                  {dispute.evidence.map((e, i) => (
                    <div key={i} className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs font-medium">{e}</div>
                  ))}
                </div>
              </div>
            )}
            {dispute.adminNotes && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">{isEn ? "Admin Notes" : "管理員備註"}</p>
                <p className="text-sm">{dispute.adminNotes}</p>
              </div>
            )}
            {dispute.resolution && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                <p className="text-xs font-medium text-primary mb-1">{isEn ? "Resolution" : "處理結果"}</p>
                <p className="text-sm font-medium">{dispute.resolution}</p>
                {dispute.refundAmount && <p className="text-xs text-muted-foreground mt-1">{isEn ? "Refund" : "退款"}: HK${dispute.refundAmount.toLocaleString()}</p>}
                {dispute.couponCompensation && <p className="text-xs text-muted-foreground mt-1">{isEn ? "Compensation" : "補償"}: {dispute.couponCompensation}</p>}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate(`/admin/orders/disputes/${dispute.id}`)}>
              {isEn ? "Manage Dispute" : "處理爭議"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminOrderDetailPage;
