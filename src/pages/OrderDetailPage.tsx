import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders } from "@/context/OrdersContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = orders.find((o) => o.id === orderId);
  if (!order) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const inst = mockInstitutions.find((i) => i.id === order.institutionId);
  const svc = inst?.services.find((s) => s.id === order.serviceId);
  const doc = inst?.doctors.find((d) => d.id === order.doctorId);

  const rows = [
    { label: t.orderManagement.orderNo, value: order.orderNumber },
    { label: t.orderManagement.status, value: <StatusBadge status={order.status} /> },
    { label: t.booking.institution, value: inst?.name[lang] || "" },
    { label: t.booking.service, value: svc?.name[lang] || "" },
    { label: t.booking.doctor, value: doc?.name[lang] || "" },
    { label: t.booking.dateTime, value: `${order.date} ${order.time}` },
    { label: t.booking.treatmentDuration, value: svc ? `${svc.duration} ${t.booking.minutes}` : "" },
    { label: t.orderManagement.createdAt, value: new Date(order.createdAt).toLocaleString() },
  ];

  const canCancel = order.status === "pending_acceptance" || order.status === "pending_treatment";
  const canReview = order.status === "completed" && !order.reviewed;

  return (
    <div className="animate-fade-in pb-28">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.orderManagement.orderDetail}</h1>
      </div>

      <div className="space-y-4 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="divide-y divide-border p-0">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm font-medium text-foreground">{r.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price */}
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.booking.originalPrice}</span>
              <span className="text-foreground">HK${order.price.toLocaleString()}</span>
            </div>
            {order.couponDeduction > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.booking.couponDiscount}</span>
                <span className="text-success">-HK${order.couponDeduction.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-base font-semibold text-foreground">{t.booking.finalAmount}</span>
              <span className="text-xl font-bold text-primary">HK${order.finalAmount.toLocaleString()}</span>
            </div>
            {order.status === "cancelled" && order.refundAmount !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.orderManagement.refundAmount}</span>
                <span className="font-semibold text-success">HK${order.refundAmount.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancellation policy */}
        {canCancel && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t.orderManagement.cancellationPolicy}</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>• {t.orderManagement.moreThan24h}: {t.orderManagement.fullRefund}</p>
                <p>• {t.orderManagement.within24h}: {t.orderManagement.partialRefund}</p>
                <p>• {t.orderManagement.treatmentStarted}: {t.orderManagement.noRefund}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {(canCancel || canReview) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
          <div className="mx-auto flex max-w-lg gap-3 px-4 py-3">
            {canCancel && (
              <Button variant="outline" className="flex-1 text-destructive" onClick={() => navigate(`/order/${orderId}/cancel`)}>
                {t.orderManagement.cancelOrder}
              </Button>
            )}
            {canReview && (
              <Button className="flex-1" onClick={() => navigate(`/order/${orderId}/review`)}>
                {t.orderManagement.writeReview}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
