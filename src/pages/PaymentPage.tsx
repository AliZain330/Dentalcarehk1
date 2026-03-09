import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { useOrders } from "@/context/OrdersContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentMethodCard from "@/components/PaymentMethodCard";

const PaymentPage: React.FC = () => {
  const { instId, svcId, docId } = useParams<{ instId: string; svcId: string; docId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, resetBooking } = useBooking();
  const { addOrder } = useOrders();

  const { couponDeduction = 0, finalAmount = 0 } = (location.state as any) || {};
  const [method, setMethod] = useState<string>("credit-card");
  const [processing, setProcessing] = useState(false);

  const institution = mockInstitutions.find((i) => i.id === instId);
  const service = institution?.services.find((s) => s.id === svcId);

  if (!institution || !service) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const methods = [
    { id: "credit-card", name: t.booking.creditCard, icon: "credit-card" as const },
    { id: "alipay", name: t.booking.alipay, icon: "alipay" as const },
    { id: "wechat", name: t.booking.wechatPay, icon: "wechat" as const },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const orderNumber = `ORD${Date.now()}`;
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        institutionId: instId!,
        serviceId: svcId!,
        doctorId: docId!,
        date: booking.date || "",
        time: booking.time || "",
        status: "pending_acceptance" as const,
        price: service.price,
        couponId: booking.couponId,
        couponDeduction,
        finalAmount,
        createdAt: new Date().toISOString(),
      };
      addOrder(newOrder);
      resetBooking();
      navigate("/booking/success", { state: { orderNumber, orderId: newOrder.id }, replace: true });
    }, 1500);
  };

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.booking.payment}</h1>
      </div>

      <div className="space-y-4 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center p-6">
            <p className="text-sm text-muted-foreground">{t.booking.paymentAmount}</p>
            <p className="mt-1 text-3xl font-bold text-foreground">HK${finalAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-base font-semibold text-foreground">{t.booking.selectPaymentMethod}</h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <PaymentMethodCard
                key={m.id}
                id={m.id}
                name={m.name}
                icon={m.icon}
                selected={method === m.id}
                onSelect={() => setMethod(m.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button className="w-full" disabled={processing} onClick={handlePay}>
            {processing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.booking.processing}</>
            ) : (
              <>{t.booking.payNow} · HK${finalAmount.toLocaleString()}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
