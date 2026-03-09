import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useOrders } from "@/context/OrdersContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockInstitutions, mockOnlineDoctors } from "@/data/mockData";

interface UserReview {
  id: string;
  type: "in_clinic" | "consultation";
  targetName: { en: string; zh: string };
  rating: number;
  comment: string;
  date: string;
  orderId: string;
}

const MyReviewsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const r = t.myReviews;
  const lang = language === "zh-HK" ? "zh" : "en";
  const { orders } = useOrders();
  const { consultations } = useConsultation();

  // Build reviews from reviewed orders
  const initialReviews = useMemo(() => {
    const clinicReviews: UserReview[] = orders
      .filter((o) => o.reviewed)
      .map((o) => {
        const inst = mockInstitutions.find((i) => i.id === o.institutionId);
        return {
          id: `clinic-${o.id}`,
          type: "in_clinic" as const,
          targetName: inst?.name || { en: "Unknown", zh: "未知" },
          rating: 5,
          comment: "Great experience!",
          date: o.createdAt.split("T")[0],
          orderId: o.id,
        };
      });

    const consultReviews: UserReview[] = consultations
      .filter((c) => c.reviewed)
      .map((c) => {
        const doc = mockOnlineDoctors.find((d) => d.id === c.doctorId);
        return {
          id: `consult-${c.id}`,
          type: "consultation" as const,
          targetName: doc?.name || { en: "Unknown", zh: "未知" },
          rating: 4,
          comment: "Very helpful consultation.",
          date: c.createdAt.split("T")[0],
          orderId: c.id,
        };
      });

    // Add some mock reviews for demo
    const mockReviews: UserReview[] = [
      { id: "ur1", type: "in_clinic", targetName: { en: "SmileCare Dental Central", zh: "微笑牙科中環診所" }, rating: 5, comment: "Excellent service! Very professional and clean environment.", date: "2026-02-20", orderId: "" },
      { id: "ur2", type: "consultation", targetName: { en: "Dr. Sarah Chan", zh: "陳醫生" }, rating: 4, comment: "Very helpful advice. Quick response time.", date: "2026-03-01", orderId: "" },
    ];

    return [...clinicReviews, ...consultReviews, ...mockReviews];
  }, [orders, consultations]);

  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const startEdit = (review: UserReview) => {
    setEditingId(review.id);
    setEditText(review.comment);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setReviews((prev) => prev.map((rv) => rv.id === editingId ? { ...rv, comment: editText } : rv));
    setEditingId(null);
    toast({ title: r.updated });
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((rv) => rv.id !== id));
    toast({ title: r.deleted });
  };

  const renderList = (type: "in_clinic" | "consultation") => {
    const filtered = reviews.filter((rv) => rv.type === type);
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center py-16 text-center">
          <MessageSquare className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{r.empty}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.emptyDesc}</p>
        </div>
      );
    }
    return (
      <div className="mt-3 space-y-2">
        {filtered.map((rv) => (
          <Card key={rv.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{rv.targetName[lang]}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= rv.rating ? "fill-warning text-warning" : "text-border"}`} />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground">{rv.date}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(rv)} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteReview(rv.id)} className="p-1.5 hover:bg-muted rounded"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </div>
              {editingId === rv.id ? (
                <div className="space-y-2">
                  <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="min-h-[60px]" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>{t.common.save}</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>{t.common.cancel}</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{rv.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{r.title}</h1>
      </div>
      <Tabs defaultValue="in_clinic">
        <TabsList className="w-full">
          <TabsTrigger value="in_clinic" className="flex-1">{r.inClinic}</TabsTrigger>
          <TabsTrigger value="consultation" className="flex-1">{r.consultation}</TabsTrigger>
        </TabsList>
        <TabsContent value="in_clinic">{renderList("in_clinic")}</TabsContent>
        <TabsContent value="consultation">{renderList("consultation")}</TabsContent>
      </Tabs>
    </div>
  );
};

export default MyReviewsPage;
