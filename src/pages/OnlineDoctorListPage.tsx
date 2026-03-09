import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, Search, Star, MessageSquareText, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const OnlineDoctorListPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "text_image" | "video">("all");
  const [specFilter, setSpecFilter] = useState("all");

  const specialties = useMemo(() => {
    const s = new Set(mockOnlineDoctors.map((d) => d.specialty[lang]));
    return ["all", ...Array.from(s)];
  }, [lang]);

  const filtered = useMemo(() => {
    return mockOnlineDoctors.filter((d) => {
      if (search && !d.name[lang].toLowerCase().includes(search.toLowerCase()) && !d.specialty[lang].toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && !d.availableTypes.includes(typeFilter)) return false;
      if (specFilter !== "all" && d.specialty[lang] !== specFilter) return false;
      return true;
    });
  }, [search, typeFilter, specFilter, lang]);

  return (
    <div className="animate-fade-in pb-24">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.consultation.doctorList}</h1>
      </div>

      <div className="space-y-3 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t.consultation.searchDoctors} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Type filter */}
        <div className="flex gap-2">
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

        {/* Specialty filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setSpecFilter(s)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${specFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {s === "all" ? t.orderManagement.all : s}
            </button>
          ))}
        </div>

        {/* Doctor cards */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <Card key={doc.id} className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md" onClick={() => navigate(`/consultation/doctor/${doc.id}`)}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">{doc.name[lang].charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">{doc.name[lang]}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          <span className="text-xs font-semibold text-foreground">{doc.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{doc.title[lang]} · {doc.specialty[lang]}</p>
                      <p className="text-xs text-muted-foreground">{doc.consultations.toLocaleString()} {t.booking.consultations}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {doc.availableTypes.includes("text_image") && (
                          <span className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-xs text-info">
                            <MessageSquareText className="h-3 w-3" /> HK${doc.textImagePrice}
                          </span>
                        )}
                        {doc.availableTypes.includes("video") && (
                          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                            <Video className="h-3 w-3" /> HK${doc.videoPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">{t.institutions.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineDoctorListPage;
