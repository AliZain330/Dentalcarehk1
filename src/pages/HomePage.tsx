import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Calendar, MessageSquare, MapPin, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  const quickActions = [
    { icon: Calendar, label: t.home.bookAppointment, color: "bg-primary" },
    { icon: MessageSquare, label: t.home.onlineConsult, color: "bg-info" },
    { icon: MapPin, label: t.home.findClinic, color: "bg-success" },
    { icon: FolderOpen, label: t.home.myRecords, color: "bg-warning" },
  ];

  return (
    <div className="animate-fade-in space-y-6 p-4 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t.home.greeting} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">{t.home.subtitle}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Card
            key={action.label}
            className="cursor-pointer border-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-col items-center gap-3 p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
              >
                <action.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-center text-sm font-medium text-foreground">
                {action.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t.home.upcoming}
        </h2>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Calendar className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              {t.home.noUpcoming}
            </p>
            <Button variant="link" className="mt-1 text-primary">
              {t.home.bookNow}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Featured Clinics */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {t.home.featured}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="min-w-[200px] shrink-0 border-0 shadow-sm"
            >
              <CardContent className="p-4">
                <div className="mb-3 h-24 rounded-lg bg-muted" />
                <p className="text-sm font-medium text-foreground">
                  {i === 1 ? "SmileCare Central" : i === 2 ? "DentalPlus TST" : "BrightDent MK"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {i === 1 ? "Central, HK" : i === 2 ? "Tsim Sha Tsui" : "Mong Kok"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
