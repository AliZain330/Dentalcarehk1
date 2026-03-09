import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, Star, MessageSquareText, Video, Award, Users, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingStars";

const OnlineDoctorDetailPage: React.FC = () => {
  const { docId } = useParams<{ docId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const { isDoctorFavorite, toggleDoctorFavorite } = useFavorites();

  const doctor = mockOnlineDoctors.find((d) => d.id === docId);
  if (!doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const saved = isDoctorFavorite(doctor.id);

  return (
    <div className="animate-fade-in pb-28">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">{t.consultation.doctorDetail}</h1>
        </div>
        <button onClick={() => toggleDoctorFavorite(doctor.id)} className="rounded-full p-1 hover:bg-muted">
          <Heart className={`h-5 w-5 ${saved ? "fill-destructive text-destructive" : "text-foreground"}`} />
        </button>
      </div>

      <div className="space-y-4 px-4">
        {/* Profile */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex gap-4 p-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{doctor.name[lang]}</h2>
              <p className="text-sm text-muted-foreground">{doctor.title[lang]}</p>
              <p className="text-xs text-muted-foreground">{doctor.specialty[lang]}</p>
              <div className="mt-2 flex items-center gap-3">
                <RatingStars rating={doctor.rating} count={doctor.consultations} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold text-foreground">{doctor.consultations.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{t.booking.consultations}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <Award className="h-5 w-5 text-warning" />
              <div>
                <p className="text-lg font-bold text-foreground">{doctor.rating}</p>
                <p className="text-xs text-muted-foreground">{t.home.rating}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">{t.booking.bio}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{doctor.bio[lang]}</p>
          </CardContent>
        </Card>

        {/* Credentials placeholder */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">{t.booking.credentials}</h3>
            <p className="text-xs text-muted-foreground">{t.consultation.credentialsPlaceholder}</p>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-3 p-4">
            <h3 className="text-sm font-semibold text-foreground">{t.consultation.consultationFees}</h3>
            {doctor.availableTypes.includes("text_image") && (
              <div className="flex items-center justify-between rounded-lg bg-info/5 p-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-info" />
                  <span className="text-sm text-foreground">{t.consultation.textImage}</span>
                </div>
                <span className="text-sm font-bold text-foreground">HK${doctor.textImagePrice}</span>
              </div>
            )}
            {doctor.availableTypes.includes("video") && (
              <div className="flex items-center justify-between rounded-lg bg-success/5 p-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-success" />
                  <span className="text-sm text-foreground">{t.consultation.video}</span>
                </div>
                <span className="text-sm font-bold text-foreground">HK${doctor.videoPrice}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">{t.institutionDetail.reviews}</h3>
            {doctor.reviews.length > 0 ? (
              <div className="space-y-3">
                {doctor.reviews.map((r) => (
                  <div key={r.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{r.userName}</span>
                      <RatingStars rating={r.rating} size={12} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.comment[lang]}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{t.consultation.noReviews}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg gap-3 px-4 py-3">
          <Button variant="outline" onClick={() => toggleDoctorFavorite(doctor.id)} className="shrink-0">
            <Heart className={`mr-1 h-4 w-4 ${saved ? "fill-destructive text-destructive" : ""}`} />
            {saved ? (language === "zh-HK" ? "已收藏" : "Saved") : (language === "zh-HK" ? "收藏" : "Save")}
          </Button>
          {doctor.availableTypes.includes("text_image") && (
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/consultation/request/${docId}?type=text_image`)}>
              <MessageSquareText className="mr-1 h-4 w-4" /> {t.consultation.textImage}
            </Button>
          )}
          {doctor.availableTypes.includes("video") && (
            <Button className="flex-1" onClick={() => navigate(`/consultation/request/${docId}?type=video`)}>
              <Video className="mr-1 h-4 w-4" /> {t.consultation.video}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineDoctorDetailPage;
