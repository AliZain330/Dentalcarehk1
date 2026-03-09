import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFavorites } from "@/context/FavoritesContext";
import { mockInstitutions, mockOnlineDoctors } from "@/data/mockData";
import RatingStars from "@/components/RatingStars";

const MyFavoritesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const f = t.myFavorites;
  const { favorites, toggleFavorite, doctorFavorites, toggleDoctorFavorite } = useFavorites();

  const savedInstitutions = mockInstitutions.filter((i) => favorites.has(i.id));
  const savedDoctors = mockOnlineDoctors.filter((d) => doctorFavorites.has(d.id));

  const lang = language === "zh-HK" ? "zh" : "en";

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{f.title}</h1>
      </div>

      <Tabs defaultValue="institutions">
        <TabsList className="w-full">
          <TabsTrigger value="institutions" className="flex-1">{f.institutions} ({savedInstitutions.length})</TabsTrigger>
          <TabsTrigger value="doctors" className="flex-1">{f.doctors} ({savedDoctors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="institutions">
          {savedInstitutions.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Heart className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{f.emptyInstitutions}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.emptyInstitutionsDesc}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {savedInstitutions.map((inst) => (
                <Card key={inst.id} className="cursor-pointer border-0 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-3" onClick={() => navigate(`/institution/${inst.id}`)}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${inst.logoColor} text-primary-foreground font-bold text-sm`}>{inst.logoInitials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{inst.name[lang]}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RatingStars rating={inst.rating} size={12} />
                        <span className="text-xs text-muted-foreground">{inst.distance} km</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(inst.id); }} className="p-1.5 hover:bg-muted rounded-full">
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="doctors">
          {savedDoctors.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Heart className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{f.emptyDoctors}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.emptyDoctorsDesc}</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {savedDoctors.map((doc) => (
                <Card key={doc.id} className="cursor-pointer border-0 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-3" onClick={() => navigate(`/consultation/doctor/${doc.id}`)}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">{doc.name.en.charAt(4)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{doc.name[lang]}</p>
                      <p className="text-xs text-muted-foreground">{doc.specialty[lang]}</p>
                      <RatingStars rating={doc.rating} size={12} />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleDoctorFavorite(doc.id); }} className="p-1.5 hover:bg-muted rounded-full">
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyFavoritesPage;
