import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Stethoscope, Video, Ticket, Gift, ChevronRight, Megaphone, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BannerCarousel from "@/components/BannerCarousel";
import SectionHeader from "@/components/SectionHeader";
import InstitutionCard from "@/components/InstitutionCard";
import ServiceCard from "@/components/ServiceCard";
import { mockInstitutions, mockPopularServices, mockCampaignCoupons } from "@/data/mockData";
import { useCoupons } from "@/context/CouponContext";
import { toast } from "@/hooks/use-toast";

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const { coupons, claimCoupon, isClaimed } = useCoupons();
  const availableCoupons = coupons.filter((c) => c.status === "available").length;

  // Show first campaign coupon that hasn't been claimed
  const campaignCoupon = mockCampaignCoupons.find((c) => c.source === "campaign" && !isClaimed(c.id));

  const handleClaimCampaign = () => {
    if (!campaignCoupon) return;
    const success = claimCoupon({
      id: campaignCoupon.id,
      title: campaignCoupon.title,
      discount: campaignCoupon.discount,
      discountAmount: campaignCoupon.discountAmount,
      validUntil: campaignCoupon.validUntil,
      status: "available",
      minSpend: campaignCoupon.minSpend,
      conditions: campaignCoupon.conditions,
      applicableTo: campaignCoupon.applicableTo,
    });
    if (success) {
      toast({ title: lang === "zh" ? "優惠券已領取！" : "Coupon claimed!" });
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-4 pt-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.home.greeting} 👋</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.home.subtitle}</p>
      </div>

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Campaign coupon claim banner */}
      {campaignCoupon && (
        <Card className="border-0 bg-gradient-to-r from-warning/10 to-warning/5 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <Megaphone className="h-8 w-8 shrink-0 text-warning" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{campaignCoupon.title[lang]}</p>
              <p className="text-xs text-muted-foreground">{campaignCoupon.conditions[lang]}</p>
            </div>
            <Button size="sm" onClick={handleClaimCampaign}>
              {lang === "zh" ? "領取" : "Claim"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Entry Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate("/institutions")}>
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Stethoscope className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-center text-sm font-semibold text-foreground">{t.home.inClinic}</span>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate("/consultation/doctors")}>
          <CardContent className="flex flex-col items-center gap-3 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-info">
              <Video className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-center text-sm font-semibold text-foreground">{t.home.onlineConsult}</span>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Institutions */}
      <div>
        <SectionHeader title={t.home.recommended} actionLabel={t.home.viewAll} onAction={() => navigate("/institutions")} />
        <div className="mt-3 space-y-3">
          {mockInstitutions.slice(0, 3).map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div>
        <SectionHeader title={t.home.popularServices} />
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {mockPopularServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>

      {/* Coupon Entry */}
      <Card className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate("/coupons")}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning">
            <Ticket className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{t.home.coupons}</h3>
            <p className="text-xs text-muted-foreground">{availableCoupons} {t.home.couponsAvailable}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Referral Rewards Entry */}
      <Card className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate("/referral")}>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success">
            <Gift className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{t.home.referral}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{t.home.referralDesc}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
