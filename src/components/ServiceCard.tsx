import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { mockInstitutions } from "@/data/mockData";
import type { PopularService } from "@/data/mockData";

interface ServiceCardProps {
  service: PopularService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "zh-HK" ? "zh" : "en";
  const recInstitution = mockInstitutions.find((i) => i.id === service.institutionIds[0]);

  return (
    <Card
      className="min-w-[160px] shrink-0 cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
      onClick={() => recInstitution && navigate(`/institution/${recInstitution.id}`)}
    >
      <CardContent className="p-4">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <span className="text-lg">🦷</span>
        </div>
        <h4 className="text-sm font-semibold text-foreground">{service.name[lang]}</h4>
        <p className="mt-1 text-xs text-primary font-medium">
          {t.home.fromPrice} HK${service.price.toLocaleString()}
        </p>
        {recInstitution && (
          <p className="mt-1.5 truncate text-xs text-muted-foreground">
            {t.home.recommendedAt} {recInstitution.name[lang]}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
