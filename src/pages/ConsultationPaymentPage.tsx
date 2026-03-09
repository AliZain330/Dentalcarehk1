import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { useConsultation } from "@/context/ConsultationContext";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentMethodCard from "@/components/PaymentMethodCard";

const ConsultationPaymentPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { addConsultation } = useConsultation();

  const { consultType, symptoms, medicalHistory, imageCount, price } = (location.state as any) || {};
  const [method, setMethod] = useState("credit-card");
  const [processing, setProcessing] = useState(false);

  const doctor = mockOnlineDoctors.find((d) => d.id === docId);
  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const methods = [
    { id: "credit-card", name: t.booking.creditCard, icon: "credit-card" as const },
    { id: "alipay", name: t.booking.alipay, icon: "alipay" as const },
    { id: "wechat", name: t.booking.wechatPay, icon: "wechat" as const },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const orderNumber = `CON${Date.now()}`;
      const newOrder = {
        id: `con-${Date.now()}`,
        orderNumber,
        doctorId: docId!,
        consultationType: consultType,
        symptoms,
        medicalHistory: medicalHistory || "",
        imageCount: imageCount || 0,
        price,
        finalAmount: price,
        paymentMethod: method,
        status: "pending_acceptance" as const,
        createdAt: new Date().toISOString(),
      };
      addConsultation(newOrder);
      navigate("/consultation/success", { state: { orderNumber, orderId: newOrder.id }, replace: true });
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
            <p className="mt-1 text-3xl font-bold text-foreground">HK${price}</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-base font-semibold text-foreground">{t.booking.selectPaymentMethod}</h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <PaymentMethodCard key={m.id} id={m.id} name={m.name} icon={m.icon} selected={method === m.id} onSelect={() => setMethod(m.id)} />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button className="w-full" disabled={processing} onClick={handlePay}>
            {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.booking.processing}</> : <>{t.booking.payNow} · HK${price}</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPaymentPage;
