import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, Download, Share2, MessageSquareText, Video, Calendar, Stethoscope, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const ReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const report = consultations.find((c) => c.id === reportId);
  if (!report || !report.diagnosisNotes) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const doctor = mockOnlineDoctors.find((d) => d.id === report.doctorId);

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.reports.reportDetail}</h1>
      </div>

      <div className="space-y-4 px-4">
        {/* Header */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{doctor?.name[lang]}</p>
                <p className="text-xs text-muted-foreground">{doctor?.specialty[lang]}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-xs text-info">
                {report.consultationType === "text_image" ? <MessageSquareText className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                {report.consultationType === "text_image" ? t.consultation.textImage : t.consultation.video}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t.consultation.diagnosisNotes}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{report.diagnosisNotes[lang]}</p>
          </CardContent>
        </Card>

        {/* Medication */}
        {report.medicationAdvice && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Pill className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-semibold text-foreground">{t.consultation.medicationAdvice}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{report.medicationAdvice[lang]}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg gap-3 px-4 py-3">
          {/* TODO: Replace with real file download/share services */}
          <Button variant="outline" className="flex-1" onClick={() => toast({ title: language === "zh-HK" ? "檔案下載 API 金鑰尚未添加" : "File Download API key not added yet" })}>
            <Download className="mr-1 h-4 w-4" /> {t.reports.save}
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => toast({ title: language === "zh-HK" ? "分享 API 金鑰尚未添加" : "Share API key not added yet" })}>
            <Share2 className="mr-1 h-4 w-4" /> {t.reports.share}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;
