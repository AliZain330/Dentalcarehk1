import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Stethoscope, Video, Ticket, Gift, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BannerCarousel from "@/components/BannerCarousel";
import SectionHeader from "@/components/SectionHeader";
import InstitutionCard from "@/components/InstitutionCard";
import ServiceCard from "@/components/ServiceCard";
import { mockInstitutions, mockPopularServices, mockCoupons } from "@/data/mockData";

const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const availableCoupons = mockCoupons.filter((c) => c.status === "available").length;

  return (
    <div className="animate-fade-in space-y-6 p-4 pt-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.home.greeting} 👋</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t.home.subtitle}</p>
      </div>

      {/* Banner Carousel */}
      <BannerCarousel />

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
