import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Clock, MapPin, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RatingStars from "@/components/RatingStars";
import { useFavorites } from "@/context/FavoritesContext";
import type { Institution } from "@/data/mockData";

interface InstitutionCardProps {
  institution: Institution;
  compact?: boolean;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, compact = false }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const lang = language === "zh-HK" ? "zh" : "en";
  const saved = isFavorite(institution.id);

  return (
    <Card
      className={`cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md ${compact ? "min-w-[220px] shrink-0" : ""}`}
      onClick={() => navigate(`/institution/${institution.id}`)}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex gap-3">
          {/* Logo */}
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${institution.logoColor}`}>
            <span className="text-sm font-bold text-primary-foreground">{institution.logoInitials}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <h3 className="truncate text-sm font-semibold text-foreground">{institution.name[lang]}</h3>
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(institution.id); }}
                className="shrink-0 p-0.5"
              >
                <Heart className={`h-4 w-4 ${saved ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
              </button>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <RatingStars rating={institution.rating} size={12} count={institution.reviewCount} />
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {institution.distance} {t.home.km}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                <span className={institution.isOpen ? "text-success" : "text-destructive"}>
                  {institution.isOpen ? t.home.open : t.home.closed}
                </span>
              </span>
            </div>

            {!compact && (
              <div className="mt-2 flex flex-wrap gap-1">
                {institution.popularServices.map((s, i) => (
                  <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {s[lang]}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstitutionCard;
