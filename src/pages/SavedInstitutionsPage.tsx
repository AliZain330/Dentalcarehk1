import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Heart } from "lucide-react";
import InstitutionCard from "@/components/InstitutionCard";

const SavedInstitutionsPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const savedList = mockInstitutions.filter((i) => favorites.has(i.id));

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t.savedInstitutions.title}</h1>
      </div>

      {savedList.length > 0 ? (
        <div className="space-y-3">
          {savedList.map((inst) => (
            <InstitutionCard key={inst.id} institution={inst} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <Heart className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.savedInstitutions.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.savedInstitutions.emptyDesc}</p>
        </div>
      )}
    </div>
  );
};

export default SavedInstitutionsPage;
