import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServiceListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";
  const institution = mockInstitutions.find((i) => i.id === id);

  if (!institution) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div>
          <h1 className="text-lg font-bold text-foreground">{t.booking.selectService}</h1>
          <p className="text-xs text-muted-foreground">{institution.name[lang]}</p>
        </div>
      </div>
      <div className="space-y-3">
        {institution.services.map((svc) => (
          <Card
            key={svc.id}
            className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => {
              setBooking({ institutionId: id, serviceId: svc.id });
              navigate(`/booking/service-detail/${id}/${svc.id}`);
            }}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{svc.name[lang]}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{svc.description[lang]}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">HK${svc.price.toLocaleString()}</span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{svc.duration} {t.booking.minutes}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceListPage;
