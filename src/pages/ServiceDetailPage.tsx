import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, { en: string; zh: string }> = {
  general: { en: "General Dentistry", zh: "一般牙科" },
  cosmetic: { en: "Cosmetic Dentistry", zh: "美容牙科" },
  orthodontics: { en: "Orthodontics", zh: "矯齒科" },
  implants: { en: "Implantology", zh: "植牙科" },
  pediatric: { en: "Pediatric Dentistry", zh: "兒童牙科" },
};

const ServiceDetailPage: React.FC = () => {
  const { instId, svcId } = useParams<{ instId: string; svcId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";
  const institution = mockInstitutions.find((i) => i.id === instId);
  const service = institution?.services.find((s) => s.id === svcId);

  if (!institution || !service) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const availableDoctors = institution.doctors.filter((d) => d.serviceIds.includes(svcId!));
  const catLabel = categoryLabels[service.category]?.[lang] || service.category;

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.booking.serviceDetails}</h1>
      </div>

      <div className="space-y-4 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-xl font-bold text-foreground">{service.name[lang]}</h2>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-2xl font-bold text-primary">HK${service.price.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-4 w-4" />{service.duration} {t.booking.minutes}</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{catLabel}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.institutionDetail.about}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{service.fullDescription[lang]}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.booking.selectDoctor} ({availableDoctors.length})</h3>
            <div className="space-y-2">
              {availableDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-xs font-semibold text-primary">{doc.name[lang].charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{doc.name[lang]}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            onClick={() => {
              setBooking({ institutionId: instId, serviceId: svcId });
              navigate(`/booking/doctors/${instId}/${svcId}`);
            }}
          >
            {t.booking.selectDoctor}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
