import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";

const DoctorListPage: React.FC = () => {
  const { instId, svcId } = useParams<{ instId: string; svcId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";
  const institution = mockInstitutions.find((i) => i.id === instId);
  const service = institution?.services.find((s) => s.id === svcId);
  const doctors = institution?.doctors.filter((d) => d.serviceIds.includes(svcId!)) || [];

  if (!institution || !service) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div>
          <h1 className="text-lg font-bold text-foreground">{t.booking.selectDoctor}</h1>
          <p className="text-xs text-muted-foreground">{service.name[lang]}</p>
        </div>
      </div>

      <div className="space-y-3">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => {
              setBooking({ doctorId: doc.id });
              navigate(`/booking/doctor-detail/${instId}/${svcId}/${doc.id}`);
            }}
          >
            <CardContent className="flex gap-3 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg font-bold text-primary">{doc.name[lang].split(" ").pop()?.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{doc.name[lang]}</h3>
                <p className="text-xs text-muted-foreground">{doc.specialty[lang]} · {doc.yearsExp} {t.institutionDetail.yearsExp}</p>
                <div className="mt-1.5 flex items-center gap-3">
                  <RatingStars rating={doc.rating} size={12} />
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />{doc.consultations.toLocaleString()} {t.booking.consultations}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorListPage;
