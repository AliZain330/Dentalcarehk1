import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  title: string;
  subtitle: string;
  color: string;
  image: string;
}

const BannerCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const banners: Banner[] = [
    { title: t.home.bannerPromo1, subtitle: t.home.bannerPromo1Sub, color: "from-primary to-primary/80", image: "/banners/whitening.jpg" },
    { title: t.home.bannerPromo2, subtitle: t.home.bannerPromo2Sub, color: "from-success to-success/80", image: "/banners/checkup.webp" },
    { title: t.home.bannerPromo3, subtitle: t.home.bannerPromo3Sub, color: "from-info to-info/80", image: "/banners/consultation.jpg" },
  ];

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className={`relative flex min-h-[140px] flex-col justify-end overflow-hidden bg-gradient-to-r p-6 ${banners[current].color}`}>
          <img
            src={banners[current].image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <h3 className="relative text-lg font-bold text-white">{banners[current].title}</h3>
          <p className="relative mt-1 text-sm text-white/85">{banners[current].subtitle}</p>
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
