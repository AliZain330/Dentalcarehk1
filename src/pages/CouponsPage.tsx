import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockCoupons } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CouponsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const tabs = [t.couponsPage.available, t.couponsPage.used, t.couponsPage.expired];
  const statuses = ["available", "used", "expired"] as const;
  const [activeTab, setActiveTab] = useState(0);

  const filtered = mockCoupons.filter((c) => c.status === statuses[activeTab]);

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
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((coupon) => (
            <Card key={coupon.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <Ticket className="h-6 w-6 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{coupon.title[lang]}</h3>
                  <p className="text-lg font-bold text-primary">{coupon.discount} {t.couponsPage.off}</p>
                  <p className="text-xs text-muted-foreground">{t.couponsPage.validUntil} {coupon.validUntil}</p>
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
