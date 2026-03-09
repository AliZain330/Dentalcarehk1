import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

const DoctorReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";

  const reviews = [
    { id: "r1", patient: "Alice L.", rating: 5, date: "2026-03-05", comment: isEn ? "Very professional and gentle. Explained everything clearly!" : "非常專業和溫柔，解釋得很清楚！" },
    { id: "r2", patient: "Tom K.", rating: 4, date: "2026-03-02", comment: isEn ? "Good service, reasonable wait time." : "服務好，等候時間合理。" },
    { id: "r3", patient: "Jenny W.", rating: 5, date: "2026-02-28", comment: isEn ? "Best online consultation experience!" : "最好的線上諮詢體驗！" },
    { id: "r4", patient: "David C.", rating: 4, date: "2026-02-20", comment: isEn ? "Helpful advice, will consult again." : "建議很有幫助，會再次諮詢。" },
  ];

  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "Patient Reviews" : "患者評價"}</h1>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{avg}</p>
            <div className="flex gap-0.5 mt-1">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(Number(avg)) ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
            <p className="text-xs text-muted-foreground mt-1">{reviews.length} {isEn ? "reviews" : "條評價"}</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = (count / reviews.length) * 100;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-muted-foreground">{star}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-warning" style={{ width: `${pct}%` }} /></div>
                  <span className="w-6 text-xs text-muted-foreground text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-foreground">{r.patient}</span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
              <p className="text-sm text-foreground">{r.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DoctorReviewsPage;
