import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Ticket, ArrowLeft, Info, Tag, Gift, Building2, Megaphone, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCoupons } from "@/context/CouponContext";
import { mockCampaignCoupons, type CampaignCoupon } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CouponsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const { coupons, claimCoupon, isClaimed } = useCoupons();

  const tabs = [t.couponsPage.available, t.couponsPage.used, t.couponsPage.expired];
  const statuses = ["available", "used", "expired"] as const;
  const [activeTab, setActiveTab] = useState(0);
  const [showClaimable, setShowClaimable] = useState(false);

  const filtered = coupons.filter((c) => c.status === statuses[activeTab]);

  const statusColors: Record<string, string> = {
    available: "bg-success/10 text-success",
    used: "bg-muted text-muted-foreground",
    expired: "bg-destructive/10 text-destructive",
  };

  const scopeLabel = (scope: string) => {
    if (scope === "in_clinic") return lang === "zh" ? "到診治療" : "In-Clinic";
    if (scope === "consultation") return lang === "zh" ? "線上諮詢" : "Online Consultation";
    return lang === "zh" ? "全平台" : "Platform-wide";
  };

  const scopeColor = (scope: string) => {
    if (scope === "in_clinic") return "bg-primary/10 text-primary";
    if (scope === "consultation") return "bg-info/10 text-info";
    return "bg-success/10 text-success";
  };

  const sourceIcon = (source: CampaignCoupon["source"]) => {
    if (source === "campaign") return Megaphone;
    if (source === "referral") return Gift;
    return Building2;
  };

  const handleClaim = (campaign: CampaignCoupon) => {
    const success = claimCoupon({
      id: campaign.id,
      title: campaign.title,
      discount: campaign.discount,
      discountAmount: campaign.discountAmount,
      validUntil: campaign.validUntil,
      status: "available",
      minSpend: campaign.minSpend,
      conditions: campaign.conditions,
      applicableTo: campaign.applicableTo,
    });
    if (success) {
      toast({ title: lang === "zh" ? "優惠券已領取！" : "Coupon claimed!" });
    }
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-xl font-bold text-foreground">{t.couponsPage.title}</h1>
        <Button size="sm" variant="outline" onClick={() => setShowClaimable(!showClaimable)}>
          <Gift className="mr-1 h-3.5 w-3.5" />
          {lang === "zh" ? "領取優惠券" : "Claim Coupons"}
        </Button>
      </div>

      {/* Claimable Campaign Coupons */}
      {showClaimable && (
        <Card className="mb-5 border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {lang === "zh" ? "可領取的優惠券" : "Available to Claim"}
            </h3>
            <div className="space-y-3">
              {mockCampaignCoupons.map((camp) => {
                const claimed = isClaimed(camp.id);
                const Icon = sourceIcon(camp.source);
                return (
                  <div key={camp.id} className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${claimed ? "border-border bg-muted/50 opacity-60" : "border-primary/20 bg-primary/5"}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{camp.title[lang]}</p>
                      <p className="text-[11px] text-muted-foreground">{camp.sourceLabel[lang]}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {claimed ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {lang === "zh" ? "已領取" : "Claimed"}
                        </span>
                      ) : (
                        <Button size="sm" onClick={() => handleClaim(camp)}>
                          {lang === "zh" ? "領取" : "Claim"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab filters */}
      <div className="mb-5 flex gap-2">
        {tabs.map((tab, i) => {
          const count = coupons.filter((c) => c.status === statuses[i]).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {tab}
              {count > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-foreground/20 px-1 text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((coupon) => (
            <Card key={coupon.id} className={`border-0 shadow-sm ${coupon.status !== "available" ? "opacity-60" : ""}`}>
              <CardContent className="p-0">
                <div className="flex">
                  {/* Left discount badge */}
                  <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-l-lg bg-primary/5 p-3">
                    <Ticket className="mb-1 h-5 w-5 text-primary" />
                    <span className="text-lg font-bold text-primary">{coupon.discount}</span>
                    <span className="text-[10px] text-primary/70">{t.couponsPage.off}</span>
                  </div>
                  {/* Right details */}
                  <div className="flex-1 p-3">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{coupon.title[lang]}</h3>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[coupon.status]}`}>
                        {tabs[statuses.indexOf(coupon.status)]}
                      </span>
                    </div>
                    {/* Scope tag */}
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${scopeColor(coupon.applicableTo)}`}>
                        <Tag className="h-2.5 w-2.5" />
                        {scopeLabel(coupon.applicableTo)}
                      </span>
                      {coupon.minSpend > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {lang === "zh" ? `滿HK$${coupon.minSpend}` : `Min. HK$${coupon.minSpend}`}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.couponsPage.validUntil} {coupon.validUntil}</p>
                    <div className="mt-1.5 flex items-start gap-1">
                      <Info className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                      <p className="text-[11px] leading-tight text-muted-foreground">{coupon.conditions[lang]}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <Ticket className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.couponsPage.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.couponsPage.emptyDesc}</p>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
