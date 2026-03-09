import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentSuccessPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, orderId } = (location.state as any) || {};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t.booking.paymentSuccess}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.booking.paymentSuccessDesc}</p>
          {orderNumber && (
            <p className="mt-3 rounded-lg bg-muted px-4 py-2 text-xs text-muted-foreground">
              {t.booking.orderNumber}: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
            </p>
          )}
          <div className="mt-6 flex w-full flex-col gap-2">
            <Button onClick={() => navigate(`/order/${orderId}`)} className="w-full">{t.booking.viewOrder}</Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">{t.booking.backToHome}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
