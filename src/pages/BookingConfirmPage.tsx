import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions } from "@/data/mockData";
import { useCoupons } from "@/context/CouponContext";
import { ArrowLeft, Ticket, ChevronRight, Info, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BookingConfirmPage: React.FC = () => {
  const { instId, svcId, docId } = useParams<{ instId: string; svcId: string; docId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";

  const institution = mockInstitutions.find((i) => i.id === instId);
  const service = institution?.services.find((s) => s.id === svcId);
  const doctor = institution?.doctors.find((d) => d.id === docId);

  const [selectedCouponId, setSelectedCouponId] = useState<string | undefined>(booking.couponId);
  const [showCoupons, setShowCoupons] = useState(false);

  if (!institution || !service || !doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const applicableCoupons = getApplicableCoupons(service.price, "in_clinic");
  const selectedCoupon = applicableCoupons.find((c) => c.id === selectedCouponId);

  const couponDeduction = selectedCoupon ? calculateCouponDeduction(selectedCoupon, service.price) : 0;
  const finalAmount = Math.max(0, service.price - couponDeduction);

  const rows = [
    { label: t.booking.institution, value: institution.name[lang] },
    { label: t.booking.service, value: service.name[lang] },
    { label: t.booking.doctor, value: doctor.name[lang] },
    { label: t.booking.dateTime, value: `${booking.date} ${booking.time}` },
    { label: t.booking.treatmentDuration, value: `${service.duration} ${t.booking.minutes}` },
  ];

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.booking.confirmBooking}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Summary */}
        <Card className="border-0 shadow-sm">
          <CardContent className="divide-y divide-border p-0">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm font-medium text-foreground">{r.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Coupon */}
        <Card className="cursor-pointer border-0 shadow-sm" onClick={() => setShowCoupons(!showCoupons)}>
          <CardContent className="flex items-center gap-3 p-4">
            <Ticket className="h-5 w-5 text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{t.booking.applyCoupon}</p>
              {selectedCoupon ? (
                <p className="text-xs text-primary">{selectedCoupon.title[lang]} ({selectedCoupon.discount})</p>
              ) : (
                <p className="text-xs text-muted-foreground">{applicableCoupons.length} {t.couponsPage.available.toLowerCase()}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        {showCoupons && (
          <Card className="border-0 shadow-sm">
            <CardContent className="space-y-2 p-3">
              <button
                onClick={() => { setSelectedCouponId(undefined); setShowCoupons(false); }}
                className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${!selectedCouponId ? "border-primary bg-secondary" : "border-border"}`}
              >
                {t.booking.noCoupon}
              </button>
              {applicableCoupons.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCouponId(c.id); setShowCoupons(false); }}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${selectedCouponId === c.id ? "border-primary bg-secondary" : "border-border"}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{c.title[lang]}</p>
                    <span className="text-sm font-bold text-primary">{c.discount}</span>
                  </div>
                  <div className="mt-1 flex items-start gap-1">
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground">{c.conditions[lang]}</p>
                  </div>
                </button>
              ))}
              {applicableCoupons.length === 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{t.couponsPage.noCouponsApplicable}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Price breakdown */}
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.booking.originalPrice}</span>
              <span className="text-foreground">HK${service.price.toLocaleString()}</span>
            </div>
            {couponDeduction > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.booking.couponDiscount}</span>
                <span className="text-success">-HK${couponDeduction.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-foreground">{t.booking.finalAmount}</span>
                <span className="text-xl font-bold text-primary">HK${finalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            onClick={() => {
              setBooking({ couponId: selectedCouponId });
              navigate(`/booking/payment/${instId}/${svcId}/${docId}`, {
                state: { couponDeduction, finalAmount },
              });
            }}
          >
            {t.booking.proceedToPayment} · HK${finalAmount.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage;
