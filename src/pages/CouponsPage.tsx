import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Ticket, ArrowLeft, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockCoupons } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const CouponsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const tabs = [t.couponsPage.available, t.couponsPage.used, t.couponsPage.expired];
  const statuses = ["available", "used", "expired"] as const;
  const [activeTab, setActiveTab] = useState(0);

  const filtered = mockCoupons.filter((c) => c.status === statuses[activeTab]);

  const statusColors: Record<string, string> = {
    available: "bg-success/10 text-success",
    used: "bg-muted text-muted-foreground",
    expired: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t.couponsPage.title}</h1>
      </div>

      <div className="mb-6 flex gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {tab}
            {i === 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 text-xs">
                {mockCoupons.filter((c) => c.status === "available").length}
              </span>
            )}
          </button>
        ))}
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
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{coupon.title[lang]}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[coupon.status]}`}>
                        {tabs[statuses.indexOf(coupon.status)]}
                      </span>
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
