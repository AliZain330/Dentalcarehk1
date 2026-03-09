import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, MessageSquare, Reply, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  patient: string;
  rating: number;
  date: string;
  comment: { en: string; zh: string };
  type: "clinic" | "consult";
  reply?: { en: string; zh: string };
}

const mockReviews: Review[] = [
  { id: "r1", patient: "Alice L.", rating: 5, date: "2026-03-05", comment: { en: "Very professional and gentle. Explained everything clearly!", zh: "非常專業和溫柔，解釋得很清楚！" }, type: "clinic" },
  { id: "r2", patient: "Tom K.", rating: 4, date: "2026-03-02", comment: { en: "Good service, reasonable wait time.", zh: "服務好，等候時間合理。" }, type: "clinic", reply: { en: "Thank you Tom! We always aim to keep wait times short.", zh: "謝謝Tom！我們一直致力縮短等候時間。" } },
  { id: "r3", patient: "Jenny W.", rating: 5, date: "2026-02-28", comment: { en: "Best online consultation experience!", zh: "最好的線上諮詢體驗！" }, type: "consult" },
  { id: "r4", patient: "David C.", rating: 4, date: "2026-02-20", comment: { en: "Helpful advice, will consult again.", zh: "建議很有幫助，會再次諮詢。" }, type: "consult" },
  { id: "r5", patient: "Mary H.", rating: 3, date: "2026-02-15", comment: { en: "Treatment was fine but had to wait 20 minutes.", zh: "治療還可以但要等20分鐘。" }, type: "clinic" },
];

const DoctorReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [replyTarget, setReplyTarget] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [detailReview, setDetailReview] = useState<Review | null>(null);

  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);

  const handleReply = () => {
    if (!replyText.trim() || !replyTarget) return;
    setReviews((prev) => prev.map((r) => r.id === replyTarget.id ? { ...r, reply: { en: replyText, zh: replyText } } : r));
    setReplyTarget(null);
    setReplyText("");
    toast({ title: isEn ? "Reply sent" : "回覆已發送" });
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <h1 className="mb-4 text-xl font-bold text-foreground">{isEn ? "Review Management" : "評價管理"}</h1>

      {/* Summary */}
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
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
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

      {/* Review list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <Card key={r.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{r.patient}</span>
                  <Badge variant="outline" className="text-[10px]">{r.type === "clinic" ? (isEn ? "Clinic" : "到診") : (isEn ? "Online" : "線上")}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
              <p className="text-sm text-foreground cursor-pointer" onClick={() => setDetailReview(r)}>{r.comment[lang]}</p>

              {/* Reply */}
              {r.reply ? (
                <div className="mt-3 rounded-lg bg-muted/50 p-3 border-l-2 border-primary">
                  <p className="text-xs font-semibold text-muted-foreground mb-1"><Reply className="inline h-3 w-3 mr-1" />{isEn ? "Your Reply" : "您的回覆"}</p>
                  <p className="text-sm text-foreground">{r.reply[lang]}</p>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="mt-2 text-xs text-primary" onClick={() => { setReplyTarget(r); setReplyText(""); }}>
                  <MessageSquare className="mr-1 h-3 w-3" />{isEn ? "Reply" : "回覆"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply dialog */}
      <Dialog open={!!replyTarget} onOpenChange={(open) => !open && setReplyTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{isEn ? "Reply to Review" : "回覆評價"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">{replyTarget?.patient} · {replyTarget?.date}</p>
              <p className="text-sm text-foreground mt-1">{replyTarget?.comment[lang]}</p>
            </div>
            <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={isEn ? "Write your reply..." : "撰寫回覆..."} className="min-h-[80px]" maxLength={500} />
            <p className="text-xs text-muted-foreground text-right">{replyText.length}/500</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setReplyTarget(null)}>{isEn ? "Cancel" : "取消"}</Button>
              <Button className="flex-1" onClick={handleReply} disabled={!replyText.trim()}><Send className="mr-1.5 h-4 w-4" />{isEn ? "Send" : "發送"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailReview} onOpenChange={(open) => !open && setDetailReview(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{isEn ? "Review Details" : "評價詳情"}</DialogTitle></DialogHeader>
          {detailReview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{detailReview.patient}</span>
                <Badge variant="outline" className="text-[10px]">{detailReview.type === "clinic" ? (isEn ? "Clinic" : "到診") : (isEn ? "Online" : "線上")}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= detailReview.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
                <span className="text-xs text-muted-foreground">{detailReview.date}</span>
              </div>
              <p className="text-sm text-foreground">{detailReview.comment[lang]}</p>
              {detailReview.reply && (
                <div className="rounded-lg bg-muted/50 p-3 border-l-2 border-primary">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{isEn ? "Your Reply" : "您的回覆"}</p>
                  <p className="text-sm text-foreground">{detailReview.reply[lang]}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorReviewsPage;
