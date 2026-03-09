import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, MessageSquareText, Video, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ConsultationConfirmPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const { consultType, symptoms, medicalHistory, imageCount, price } = (location.state as any) || {};
  const doctor = mockOnlineDoctors.find((d) => d.id === docId);

  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const rows = [
    { label: t.booking.doctor, value: doctor.name[lang] },
    { label: t.consultation.consultationType, value: consultType === "text_image" ? t.consultation.textImage : t.consultation.video },
    { label: t.consultation.symptoms, value: symptoms?.substring(0, 80) + (symptoms?.length > 80 ? "..." : "") },
  ];

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.consultation.confirmConsultation}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Summary */}
        <Card className="border-0 shadow-sm">
          <CardContent className="divide-y divide-border p-0">
            {rows.map((r) => (
              <div key={r.label} className="flex items-start justify-between px-4 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">{r.label}</span>
                <span className="ml-4 text-right text-sm font-medium text-foreground">{r.value}</span>
              </div>
            ))}
            {medicalHistory && (
              <div className="flex items-start justify-between px-4 py-3">
                <span className="shrink-0 text-sm text-muted-foreground">{t.consultation.medicalHistory}</span>
                <span className="ml-4 text-right text-sm font-medium text-foreground">{medicalHistory.substring(0, 60)}</span>
              </div>
            )}
            {imageCount > 0 && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{t.consultation.uploadedImages}</span>
                <span className="flex items-center gap-1 text-sm font-medium text-foreground"><Image className="h-4 w-4" /> {imageCount}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Type badge */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            {consultType === "text_image" ? (
              <MessageSquareText className="h-5 w-5 text-info" />
            ) : (
              <Video className="h-5 w-5 text-success" />
            )}
            <span className="text-sm font-medium text-foreground">
              {consultType === "text_image" ? t.consultation.textImageDesc : t.consultation.videoDesc}
            </span>
          </CardContent>
        </Card>

        {/* Price */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between border-t-0">
              <span className="text-base font-semibold text-foreground">{t.booking.finalAmount}</span>
              <span className="text-xl font-bold text-primary">HK${price}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            onClick={() =>
              navigate(`/consultation/payment/${docId}`, {
                state: { consultType, symptoms, medicalHistory, imageCount, price },
              })
            }
          >
            {t.booking.proceedToPayment} · HK${price}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationConfirmPage;
