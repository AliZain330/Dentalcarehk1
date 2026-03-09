import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders } from "@/context/OrdersContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const PENALTY_RATE = 0.3;

const CancelOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders, cancelOrder } = useOrders();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = orders.find((o) => o.id === orderId);

  const { refundAmount, refundType } = useMemo(() => {
    if (!order) return { refundAmount: 0, refundType: "none" as const };
    const appointmentDate = new Date(`${order.date}T${order.time}:00`);
    const now = new Date();
    const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntil <= 0) {
      return { refundAmount: 0, refundType: "none" as const };
    } else if (hoursUntil <= 24) {
      const penalty = Math.round(order.finalAmount * PENALTY_RATE);
      return { refundAmount: order.finalAmount - penalty, refundType: "partial" as const };
    } else {
      return { refundAmount: order.finalAmount, refundType: "full" as const };
    }
  }, [order]);

  if (!order) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const inst = mockInstitutions.find((i) => i.id === order.institutionId);
  const svc = inst?.services.find((s) => s.id === order.serviceId);

  const handleCancel = () => {
    cancelOrder(order.id, refundAmount);
    toast({ title: t.orderManagement.cancelSuccess });
    navigate(`/order/${orderId}`, { replace: true });
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.orderManagement.cancelConfirm}</h1>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <AlertTriangle className="mb-3 h-10 w-10 text-warning" />
          <h2 className="text-base font-semibold text-foreground">{t.orderManagement.cancelWarning}</h2>
        </CardContent>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">{t.booking.service}</span>
            <span className="text-foreground">{svc?.name[lang]}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">{t.booking.dateTime}</span>
            <span className="text-foreground">{order.date} {order.time}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-muted-foreground">{t.booking.finalAmount}</span>
            <span className="text-foreground">HK${order.finalAmount.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">{t.orderManagement.cancellationPolicy}</h3>
          <div className="space-y-2 text-xs">
            <p className={refundType === "full" ? "font-medium text-success" : "text-muted-foreground"}>
              ✓ {t.orderManagement.moreThan24h}: {t.orderManagement.fullRefund}
            </p>
            <p className={refundType === "partial" ? "font-medium text-warning" : "text-muted-foreground"}>
              ⚠ {t.orderManagement.within24h}: {t.orderManagement.partialRefund}
            </p>
            <p className={refundType === "none" ? "font-medium text-destructive" : "text-muted-foreground"}>
              ✕ {t.orderManagement.treatmentStarted}: {t.orderManagement.noRefund}
            </p>
          </div>
          <div className="mt-4 rounded-lg bg-muted p-3 text-center">
            <p className="text-sm text-muted-foreground">{t.orderManagement.refundAmount}</p>
            <p className="text-2xl font-bold text-foreground">HK${refundAmount.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>{t.common.back}</Button>
        <Button variant="destructive" className="flex-1" onClick={handleCancel}>{t.orderManagement.confirmCancel}</Button>
      </div>
    </div>
  );
};

export default CancelOrderPage;
