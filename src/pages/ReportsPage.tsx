import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { FileText, Search, MessageSquareText, Video, Calendar, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ReportsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "text_image" | "video">("all");

  const reports = useMemo(() => {
    return consultations
      .filter((c) => c.status === "completed" && c.diagnosisNotes)
      .filter((c) => {
        if (typeFilter !== "all" && c.consultationType !== typeFilter) return false;
        if (!search) return true;
        const doc = mockOnlineDoctors.find((d) => d.id === c.doctorId);
        return doc?.name[lang].toLowerCase().includes(search.toLowerCase()) || c.orderNumber.toLowerCase().includes(search.toLowerCase());
      });
  }, [consultations, search, typeFilter, lang]);

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{t.reports.title}</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t.reports.searchReports} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "text_image", "video"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {type === "text_image" && <MessageSquareText className="h-3 w-3" />}
            {type === "video" && <Video className="h-3 w-3" />}
            {type === "all" ? t.orderManagement.all : type === "text_image" ? t.consultation.textImage : t.consultation.video}
          </button>
        ))}
      </div>

      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => {
            const doc = mockOnlineDoctors.find((d) => d.id === report.doctorId);
            return (
              <Card
                key={report.id}
                className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => navigate(`/report/${report.id}`)}
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-xs text-info">
                      {report.consultationType === "text_image" ? <MessageSquareText className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                      {report.consultationType === "text_image" ? t.consultation.textImage : t.consultation.video}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{doc?.name[lang]}</p>
                      <p className="text-xs text-muted-foreground">{doc?.specialty[lang]}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{report.diagnosisNotes?.[lang]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <FileText className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-base font-medium text-foreground">{t.reports.empty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.reports.emptyDesc}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
