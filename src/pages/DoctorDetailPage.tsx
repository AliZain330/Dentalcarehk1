import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useBooking } from "@/context/BookingContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingStars";

const credentialsByLang: Record<string, string[]> = {
  en: ["BDS (HKU)", "MDS (Orthodontics)", "FHKAM (Dental Surgery)"],
  zh: ["牙科學士 (香港大學)", "牙科碩士 (矯齒科)", "香港牙科醫學院院士"],
};

const DoctorDetailPage: React.FC = () => {
  const { instId, svcId, docId } = useParams<{ instId: string; svcId: string; docId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const lang = language === "zh-HK" ? "zh" : "en";
  const institution = mockInstitutions.find((i) => i.id === instId);
  const doctor = institution?.doctors.find((d) => d.id === docId);
  const service = institution?.services.find((s) => s.id === svcId);

  if (!institution || !doctor || !service) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const doctorServices = institution.services.filter((s) => doctor.serviceIds.includes(s.id));
  const reviews = institution.reviews.slice(0, 2);
  const credentials = credentialsByLang[lang] || credentialsByLang.en;

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.booking.doctorDetails}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Profile */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-4 p-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <span className="text-2xl font-bold text-primary">{doctor.name[lang].split(" ").pop()?.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{doctor.name[lang]}</h2>
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{doctor.specialty[lang]}</p>
              <div className="mt-2 flex items-center gap-3">
                <RatingStars rating={doctor.rating} />
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />{doctor.consultations.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{doctor.yearsExp} {t.institutionDetail.yearsExp}</p>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.booking.bio}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{doctor.bio[lang]}</p>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.booking.credentials}</h3>
            <div className="space-y-1.5">
              {credentials.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3 w-3 text-primary" />
                  {c}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.booking.availableServices}</h3>
            <div className="space-y-2">
              {doctorServices.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-foreground">{s.name[lang]}</span>
                  <span className="text-sm font-semibold text-primary">HK${s.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews preview */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-base font-semibold text-foreground">{t.institutionDetail.reviews}</h3>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="mb-2 rounded-lg bg-muted/50 p-3 last:mb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{r.userName}</span>
                    <RatingStars rating={r.rating} size={12} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.comment[lang]}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">{t.consultation.noReviews}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            onClick={() => {
              setBooking({ institutionId: instId, serviceId: svcId, doctorId: docId });
              navigate(`/booking/time/${instId}/${svcId}/${docId}`);
            }}
          >
            {t.booking.continueBooking}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
