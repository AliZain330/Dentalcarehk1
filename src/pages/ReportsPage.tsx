import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ReportsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in p-4 pt-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">{t.reports.title}</h1>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center py-16 text-center">
          <FileText className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-base font-medium text-foreground">{t.reports.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.reports.emptyDesc}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
