import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockOnlineDoctors, type ConsultationType } from "@/data/mockData";
import { ArrowLeft, Camera, MessageSquareText, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ConsultationRequestPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";

  const initialType = (searchParams.get("type") as ConsultationType) || "text_image";
  const [consultType, setConsultType] = useState<ConsultationType>(initialType);
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const doctor = mockOnlineDoctors.find((d) => d.id === docId);
  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const price = consultType === "text_image" ? doctor.textImagePrice : doctor.videoPrice;
  const canProceed = symptoms.trim().length > 0;

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.consultation.requestConsultation}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Doctor summary */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="text-lg font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{doctor.name[lang]}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialty[lang]}</p>
            </div>
          </CardContent>
        </Card>

        {/* Consultation type selector */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t.consultation.selectType}</h3>
            <div className="flex gap-3">
              {doctor.availableTypes.includes("text_image") && (
                <button
                  onClick={() => setConsultType("text_image")}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${consultType === "text_image" ? "border-primary bg-secondary" : "border-border"}`}
                >
                  <MessageSquareText className={`h-6 w-6 ${consultType === "text_image" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium text-foreground">{t.consultation.textImage}</span>
                  <span className="text-xs font-bold text-primary">HK${doctor.textImagePrice}</span>
                </button>
              )}
              {doctor.availableTypes.includes("video") && (
                <button
                  onClick={() => setConsultType("video")}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${consultType === "video" ? "border-primary bg-secondary" : "border-border"}`}
                >
                  <Video className={`h-6 w-6 ${consultType === "video" ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium text-foreground">{t.consultation.video}</span>
                  <span className="text-xs font-bold text-primary">HK${doctor.videoPrice}</span>
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">{t.consultation.symptoms} *</label>
            <Textarea
              placeholder={t.consultation.symptomsPlaceholder}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Medical history */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">{t.consultation.medicalHistory}</label>
            <Textarea
              placeholder={t.consultation.medicalHistoryPlaceholder}
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Image upload placeholder */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">{t.consultation.uploadImages}</label>
            <button
              onClick={() => setImageCount((c) => Math.min(c + 1, 5))}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground hover:border-primary"
            >
              <Camera className="h-5 w-5" />
              {t.consultation.tapToUpload} ({imageCount}/5)
            </button>
          </CardContent>
        </Card>

        {/* Fee summary */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t.consultation.consultationFee}</span>
              <span className="text-xl font-bold text-primary">HK${price}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Button
            className="w-full"
            disabled={!canProceed}
            onClick={() =>
              navigate(`/consultation/confirm/${docId}`, {
                state: { consultType, symptoms, medicalHistory, imageCount, price },
              })
            }
          >
            {t.consultation.proceedToConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRequestPage;
