import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  title: string;
  subtitle: string;
  color: string;
}

const BannerCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const banners: Banner[] = [
    { title: t.home.bannerPromo1, subtitle: t.home.bannerPromo1Sub, color: "from-primary to-primary/80" },
    { title: t.home.bannerPromo2, subtitle: t.home.bannerPromo2Sub, color: "from-success to-success/80" },
    { title: t.home.bannerPromo3, subtitle: t.home.bannerPromo3Sub, color: "from-info to-info/80" },
  ];

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className={`relative flex min-h-[140px] flex-col justify-center bg-gradient-to-r p-6 ${banners[current].color}`}>
          <h3 className="text-lg font-bold text-primary-foreground">{banners[current].title}</h3>
          <p className="mt-1 text-sm text-primary-foreground/80">{banners[current].subtitle}</p>
        </CardContent>
      </Card>

      {/* Dots */}
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-4 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
