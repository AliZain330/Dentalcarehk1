import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import {
  Search, Star, MessageSquare, ChevronLeft, Image as ImageIcon,
  Send, Edit2, User, Building2, Filter, ThumbsUp, Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────

type ReviewTarget = "institution" | "doctor";
type ReplyStatus = "replied" | "unreplied";

interface ReviewReply {
  content: string;
  date: string;
  editedDate?: string;
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  text: string;
  date: string;
  target: ReviewTarget;
  targetName: string;
  orderRef: string;
  images: number; // placeholder count
  reply: ReviewReply | null;
}

// ─── Mock Data ───────────────────────────────────────────────

const INSTITUTION_NAME = "Bright Dental Clinic";

const initialMockReviews: Review[] = [
  {
    id: "R001",
    reviewerName: "Chan Tai Man",
    rating: 5,
    text: "非常專業的洗牙服務，醫生態度友善，環境整潔。會推薦給朋友！\nVery professional teeth cleaning service. The doctor was friendly and the environment was clean. Would recommend to friends!",
    date: "2024-03-05",
    target: "institution",
    targetName: INSTITUTION_NAME,
    orderRef: "IC20240305-001",
    images: 2,
    reply: {
      content: "感謝您的好評！我們會繼續努力提供優質服務。Thank you for your kind review! We will continue to provide quality service.",
      date: "2024-03-06",
    },
  },
  {
    id: "R002",
    reviewerName: "Wong Mei Ling",
    rating: 4,
    text: "補牙過程順利，但等候時間略長。整體滿意。\nFilling procedure went smoothly, but the wait time was a bit long. Overall satisfied.",
    date: "2024-03-04",
    target: "doctor",
    targetName: "Dr. James Wong",
    orderRef: "IC20240304-003",
    images: 0,
    reply: null,
  },
  {
    id: "R003",
    reviewerName: "Lee Ka Fai",
    rating: 5,
    text: "矯齒諮詢很詳細，醫生用心解釋了不同方案的優缺點。\nThe orthodontic consultation was very detailed. The doctor carefully explained the pros and cons of different options.",
    date: "2024-03-03",
    target: "doctor",
    targetName: "Dr. Emily Chen",
    orderRef: "IC20240303-007",
    images: 1,
    reply: {
      content: "謝謝您的肯定！如有任何問題歡迎隨時聯繫我們。Thank you for your feedback! Feel free to contact us anytime.",
      date: "2024-03-04",
    },
  },
  {
    id: "R004",
    reviewerName: "Lam Siu Ming",
    rating: 3,
    text: "服務一般，希望能改善預約流程和等候區舒適度。\nService was average. Hope to improve the appointment process and waiting area comfort.",
    date: "2024-03-02",
    target: "institution",
    targetName: "Bright Dental Clinic",
    orderRef: "ORD-20240302-002",
    images: 0,
    reply: null,
  },
  {
    id: "R005",
    reviewerName: "Ng Hoi Yan",
    rating: 5,
    text: "植牙手術非常成功！恢復很快，術後護理指導也很清楚。\nImplant surgery was very successful! Recovery was fast and post-op care instructions were clear.",
    date: "2024-03-01",
    target: "doctor",
    targetName: "Dr. Li Wei",
    orderRef: "ORD-20240301-005",
    images: 3,
    reply: null,
  },
  {
    id: "R006",
    reviewerName: "Cheung Wing Kei",
    rating: 2,
    text: "價格偏高，且未事先說明額外費用。希望收費能更透明。\nPricing was on the high side, and extra charges were not explained in advance. Hope pricing can be more transparent.",
    date: "2024-02-28",
    target: "institution",
    targetName: "Bright Dental Clinic",
    orderRef: "ORD-20240228-004",
    images: 0,
    reply: {
      content: "非常抱歉給您帶來不便，我們已改善收費說明流程。歡迎再次光臨體驗改善後的服務。We apologize for the inconvenience. We have improved our pricing explanation process.",
      date: "2024-03-01",
      editedDate: "2024-03-02",
    },
  },
  {
    id: "R007",
    reviewerName: "Ho Pui Shan",
    rating: 4,
    text: "智齒拔除手術比預想的輕鬆很多，麻醉效果很好。\nWisdom tooth extraction was much easier than expected. The anesthesia worked well.",
    date: "2024-02-27",
    target: "doctor",
    targetName: "Dr. Zhang Ming",
    orderRef: "ORD-20240227-006",
    images: 0,
    reply: null,
  },
  {
    id: "R008",
    reviewerName: "Yip Kwok Leung",
    rating: 1,
    text: "預約了但到場後等了超過一個小時，非常不滿意。\nBooked an appointment but waited over an hour after arrival. Very unsatisfied.",
    date: "2024-02-25",
    target: "institution",
    targetName: "Bright Dental Clinic",
    orderRef: "ORD-20240225-001",
    images: 0,
    reply: null,
  },
];

// ─── Component ────────────────────────────────────────────────

const InstitutionReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [reviews, setReviews] = useState<Review[]>(initialMockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetFilter, setTargetFilter] = useState<"all" | ReviewTarget>("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | string>("all");
  const [replyFilter, setReplyFilter] = useState<"all" | ReplyStatus>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState("");

  // ── Filtered reviews ──

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (targetFilter !== "all" && r.target !== targetFilter) return false;
      if (ratingFilter !== "all" && r.rating !== parseInt(ratingFilter)) return false;
      if (replyFilter === "replied" && !r.reply) return false;
      if (replyFilter === "unreplied" && r.reply) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (
          !r.reviewerName.toLowerCase().includes(q) &&
          !r.text.toLowerCase().includes(q) &&
          !r.targetName.toLowerCase().includes(q) &&
          !r.orderRef.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [reviews, searchTerm, targetFilter, ratingFilter, replyFilter]);

  // ── Stats ──

  const totalReviews = reviews.length;
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "0";
  const repliedCount = reviews.filter((r) => r.reply).length;
  const unrepliedCount = reviews.filter((r) => !r.reply).length;

  // ── Helpers ──

  const renderStars = (rating: number, size = "h-4 w-4") =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
      />
    ));

  const replyStatusBadge = (review: Review) => {
    if (review.reply) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          <MessageSquare className="h-3 w-3" />
          {isEn ? "Replied" : "已回覆"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
        <Clock className="h-3 w-3" />
        {isEn ? "Unreplied" : "未回覆"}
      </span>
    );
  };

  const targetBadge = (review: Review) => (
    <Badge variant="outline" className="gap-1 text-xs">
      {review.target === "institution" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
      {review.targetName}
    </Badge>
  );

  // ── Reply actions ──

  const handleSubmitReply = (reviewId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Reply cannot be empty" : "回覆不能為空", variant: "destructive" });
      return;
    }
    if (trimmed.length > 500) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Reply must be under 500 characters" : "回覆不能超過500字", variant: "destructive" });
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, reply: { content: trimmed, date: new Date().toISOString().slice(0, 10) } }
          : r
      )
    );
    setReplyText("");
    if (selectedReview?.id === reviewId) {
      setSelectedReview((prev) => prev ? { ...prev, reply: { content: trimmed, date: new Date().toISOString().slice(0, 10) } } : prev);
    }
    toast({ title: isEn ? "Sent" : "已發送", description: isEn ? "Reply submitted successfully" : "回覆已提交" });
  };

  const handleEditReply = (reviewId: string) => {
    const trimmed = editReplyText.trim();
    if (!trimmed) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Reply cannot be empty" : "回覆不能為空", variant: "destructive" });
      return;
    }
    if (trimmed.length > 500) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Reply must be under 500 characters" : "回覆不能超過500字", variant: "destructive" });
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId && r.reply
          ? { ...r, reply: { ...r.reply, content: trimmed, editedDate: today } }
          : r
      )
    );
    setEditingReplyId(null);
    setEditReplyText("");
    if (selectedReview?.id === reviewId && selectedReview.reply) {
      setSelectedReview((prev) => prev && prev.reply ? { ...prev, reply: { ...prev.reply, content: trimmed, editedDate: today } } : prev);
    }
    toast({ title: isEn ? "Updated" : "已更新", description: isEn ? "Reply updated" : "回覆已更新" });
  };

  const startEditReply = (review: Review) => {
    if (review.reply) {
      setEditingReplyId(review.id);
      setEditReplyText(review.reply.content);
    }
  };

  // ─── Review Card ───

  const ReviewCard: React.FC<{ review: Review; compact?: boolean }> = ({ review, compact }) => (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex">{renderStars(review.rating, "h-3.5 w-3.5")}</div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {replyStatusBadge(review)}
          </div>
        </div>

        {/* Target */}
        <div className="flex items-center gap-2">
          {targetBadge(review)}
          <span className="text-xs text-muted-foreground font-mono">{review.orderRef}</span>
        </div>

        {/* Review text */}
        <p className={`text-sm text-foreground leading-relaxed ${compact ? "line-clamp-3" : ""}`}>
          {review.text}
        </p>

        {/* Images placeholder */}
        {review.images > 0 && (
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(review.images, 4) }).map((_, i) => (
              <div key={i} className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center border border-border">
                <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
              </div>
            ))}
            {review.images > 4 && (
              <span className="text-xs text-muted-foreground">+{review.images - 4}</span>
            )}
          </div>
        )}

        {/* Existing reply */}
        {review.reply && editingReplyId !== review.id && (
          <div className="ml-4 border-l-2 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-primary">
                {isEn ? "Institution Reply" : "機構回覆"} · {review.reply.date}
                {review.reply.editedDate && (
                  <span className="text-muted-foreground ml-1">({isEn ? "edited" : "已編輯"} {review.reply.editedDate})</span>
                )}
              </span>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => startEditReply(review)}>
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{review.reply.content}</p>
          </div>
        )}

        {/* Edit reply form */}
        {editingReplyId === review.id && (
          <div className="ml-4 border-l-2 border-primary/30 pl-4 space-y-2">
            <Textarea
              value={editReplyText}
              onChange={(e) => setEditReplyText(e.target.value)}
              className="min-h-[80px] text-sm"
              maxLength={500}
              placeholder={isEn ? "Edit reply…" : "編輯回覆…"}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{editReplyText.length}/500</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingReplyId(null); setEditReplyText(""); }}>
                  {isEn ? "Cancel" : "取消"}
                </Button>
                <Button size="sm" onClick={() => handleEditReply(review.id)}>
                  {isEn ? "Save" : "保存"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reply form for unreplied */}
        {!review.reply && (
          <div className="space-y-2 pt-1">
            <Textarea
              value={selectedReview?.id === review.id ? replyText : ""}
              onChange={(e) => { setSelectedReview(review); setReplyText(e.target.value); }}
              onFocus={() => setSelectedReview(review)}
              className="min-h-[70px] text-sm"
              maxLength={500}
              placeholder={isEn ? "Write a reply (supports Chinese & English)…" : "撰寫回覆（支持中英文）…"}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {(selectedReview?.id === review.id ? replyText : "").length}/500
              </span>
              <Button size="sm" onClick={() => handleSubmitReply(review.id)} disabled={selectedReview?.id !== review.id || !replyText.trim()}>
                <Send className="h-3.5 w-3.5 mr-1" />
                {isEn ? "Reply" : "回覆"}
              </Button>
            </div>
          </div>
        )}

        {/* View detail (compact mode) */}
        {compact && (
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedReview(review)}>
            {isEn ? "View Details" : "查看詳情"}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // ═══════════════ Detail View ═══════════════

  if (selectedReview && !filtered.some(r => r.id === selectedReview.id && !replyText)) {
    // We use dialog for detail instead
  }

  // ═══════════════ Main View ═══════════════

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Review Management" : "評價管理"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEn ? "View and respond to patient reviews" : "查看並回覆患者評價"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isEn ? "Total Reviews" : "總評價數", value: totalReviews.toString(), icon: MessageSquare, color: "text-foreground" },
          { label: isEn ? "Average Rating" : "平均評分", value: avgRating, icon: Star, color: "text-warning" },
          { label: isEn ? "Replied" : "已回覆", value: repliedCount.toString(), icon: ThumbsUp, color: "text-primary" },
          { label: isEn ? "Unreplied" : "未回覆", value: unrepliedCount.toString(), icon: Clock, color: "text-destructive" },
        ].map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ApiPlaceholderNotice service={isEn ? "Review Analytics" : "評價分析"} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isEn ? "Search reviewer, content, order…" : "搜尋評價者、內容、訂單…"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={targetFilter} onValueChange={(v) => setTargetFilter(v as any)}>
          <SelectTrigger className="w-40">
            <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Targets" : "所有對象"}</SelectItem>
            <SelectItem value="institution">{isEn ? "Institution" : "機構"}</SelectItem>
            <SelectItem value="doctor">{isEn ? "Doctor" : "醫生"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder={isEn ? "Rating" : "評分"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Ratings" : "所有評分"}</SelectItem>
            <SelectItem value="5">★★★★★ (5)</SelectItem>
            <SelectItem value="4">★★★★ (4)</SelectItem>
            <SelectItem value="3">★★★ (3)</SelectItem>
            <SelectItem value="2">★★ (2)</SelectItem>
            <SelectItem value="1">★ (1)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={replyFilter} onValueChange={(v) => setReplyFilter(v as any)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Status" : "所有狀態"}</SelectItem>
            <SelectItem value="replied">{isEn ? "Replied" : "已回覆"}</SelectItem>
            <SelectItem value="unreplied">{isEn ? "Unreplied" : "未回覆"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Review list */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">{isEn ? "No reviews found" : "未找到評價"}</p>
            <p className="text-xs text-muted-foreground mt-1">{isEn ? "Try adjusting filters" : "嘗試調整篩選條件"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedReview && !!replyText === false && filtered.length > 0} onOpenChange={(open) => { if (!open) setSelectedReview(null); }}>
        {selectedReview && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEn ? "Review Details" : "評價詳情"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Reviewer */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedReview.reviewerName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex">{renderStars(selectedReview.rating)}</div>
                    <span className="text-sm text-muted-foreground">{selectedReview.date}</span>
                  </div>
                </div>
              </div>

              {/* Target & order */}
              <div className="flex items-center gap-3 flex-wrap">
                {targetBadge(selectedReview)}
                <Badge variant="secondary" className="font-mono text-xs">{selectedReview.orderRef}</Badge>
              </div>

              {/* Full text */}
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedReview.text}</p>
              </div>

              {/* Images */}
              {selectedReview.images > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{isEn ? "Attached Images" : "附加圖片"}</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: selectedReview.images }).map((_, i) => (
                      <div key={i} className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center border border-border">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply */}
              {selectedReview.reply && (
                <div className="border-l-2 border-primary/30 pl-4 py-2 bg-muted/30 rounded-r-lg">
                  <p className="text-xs font-medium text-primary mb-1">
                    {isEn ? "Institution Reply" : "機構回覆"} · {selectedReview.reply.date}
                    {selectedReview.reply.editedDate && (
                      <span className="text-muted-foreground ml-1">({isEn ? "edited" : "已編輯"})</span>
                    )}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedReview.reply.content}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default InstitutionReviewsPage;
