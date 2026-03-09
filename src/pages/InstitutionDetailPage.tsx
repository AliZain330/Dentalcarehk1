import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { mockInstitutions } from "@/data/mockData";
import {
  ArrowLeft, Heart, MapPin, Phone, Clock, Bus, ChevronRight, Star,
  Navigation, Calendar, Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingStars";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const InstitutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lang = language === "zh-HK" ? "zh" : "en";

  const institution = mockInstitutions.find((i) => i.id === id);
  if (!institution) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Institution not found</p>
      </div>
    );
  }

  const saved = isFavorite(institution.id);
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
  const dayLabels: Record<string, string> = {
    mon: t.institutionDetail.mon, tue: t.institutionDetail.tue,
    wed: t.institutionDetail.wed, thu: t.institutionDetail.thu,
    fri: t.institutionDetail.fri, sat: t.institutionDetail.sat,
    sun: t.institutionDetail.sun,
  };

  return (
    <div className="animate-fade-in pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <button onClick={() => toggleFavorite(institution.id)} className="rounded-full p-1 hover:bg-muted">
          <Heart className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>

      <div className="space-y-5 px-4">
        {/* Header */}
        <div className="flex gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${institution.logoColor}`}>
            <span className="text-xl font-bold text-primary-foreground">{institution.logoInitials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">{institution.name[lang]}</h1>
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <RatingStars rating={institution.rating} count={institution.reviewCount} />
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              institution.isOpen ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}>
              {institution.isOpen ? t.home.open : t.home.closed}
            </span>
          </div>
        </div>

        {/* About */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h2 className="mb-2 text-base font-semibold text-foreground">{t.institutionDetail.about}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{institution.description[lang]}</p>
          </CardContent>
        </Card>

        {/* Photos placeholder */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h2 className="mb-3 text-base font-semibold text-foreground">{t.institutionDetail.photos}</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: Math.min(institution.photoCount, 4) }).map((_, i) => (
                <div key={i} className="h-20 w-28 shrink-0 rounded-lg bg-muted" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Location */}
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-foreground">{institution.address[lang]}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-foreground">{institution.phone}</p>
            </div>
            <div className="flex items-start gap-3">
              <Bus className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{institution.transport[lang]}</p>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
              <Clock className="h-4 w-4" />
              {t.institutionDetail.hours}
            </h2>
            <div className="space-y-1.5">
              {institution.hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{dayLabels[h.day] || h.day}</span>
                  <span className={`font-medium ${h.time === "Closed" ? "text-destructive" : "text-foreground"}`}>{h.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctors */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t.institutionDetail.doctors}</h2>
              <button className="flex items-center gap-0.5 text-xs font-medium text-primary">
                {t.institutionDetail.viewAllDoctors} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {institution.doctors.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-semibold text-primary">
                      {doc.name[lang].split(" ").pop()?.charAt(0) || "D"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{doc.name[lang]}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty[lang]} · {doc.yearsExp} {t.institutionDetail.yearsExp}</p>
                  </div>
                  <RatingStars rating={doc.rating} size={12} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t.institutionDetail.services}</h2>
              <button onClick={() => navigate(`/booking/services/${institution.id}`)} className="flex items-center gap-0.5 text-xs font-medium text-primary">
                {t.institutionDetail.viewAllServices} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              {institution.services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{svc.name[lang]}</p>
                    <p className="text-xs text-muted-foreground">{svc.description[lang]}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">HK${svc.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{t.institutionDetail.reviews}</h2>
              <button className="flex items-center gap-0.5 text-xs font-medium text-primary">
                {t.institutionDetail.viewAllReviews} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {institution.reviews.map((rev) => (
                <div key={rev.id} className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{rev.userName}</span>
                    <span className="text-xs text-muted-foreground">{rev.date}</span>
                  </div>
                  <RatingStars rating={rev.rating} size={12} />
                  <p className="mt-1.5 text-sm text-muted-foreground">{rev.comment[lang]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button
            variant="outline"
            className="flex items-center gap-1.5"
            onClick={() => toggleFavorite(institution.id)}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
            {saved ? t.institutionDetail.saved : t.institutionDetail.saveToFavorites}
          </Button>
          <Button variant="outline" className="flex items-center gap-1.5">
            <Navigation className="h-4 w-4" />
            {t.institutionDetail.getDirections}
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/booking/services/${institution.id}`)}>
            <Calendar className="mr-1.5 h-4 w-4" />
            {t.institutionDetail.bookNow}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailPage;
