import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRatingInput from "@/components/StarRatingInput";
import { toast } from "@/hooks/use-toast";

const ConsultationReviewPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations, markConsultationReviewed } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = consultations.find((c) => c.id === orderId);
  const doctor = order ? mockOnlineDoctors.find((d) => d.id === order.doctorId) : null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!order || !doctor) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const handleSubmit = () => {
    markConsultationReviewed(order.id);
    setSubmitted(true);
    toast({ title: t.review.success, description: t.review.successDesc });
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm border-0 shadow-md">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <CheckCircle2 className="mb-4 h-14 w-14 text-success" />
            <h1 className="text-xl font-bold text-foreground">{t.review.success}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.review.successDesc}</p>
            <Button className="mt-6 w-full" onClick={() => navigate(`/consultation/order/${orderId}`)}>{t.booking.viewOrder}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.review.title}</h1>
      </div>

      <Card className="mb-4 border-0 bg-secondary shadow-sm">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-bold text-primary">{doctor.name[lang].charAt(0)}</span>
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">{doctor.name[lang]}</p>
            <p className="text-muted-foreground">{order.consultationType === "text_image" ? t.consultation.textImage : t.consultation.video}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <StarRatingInput label={t.consultation.overallRating} value={rating} onChange={setRating} />
        </CardContent>
      </Card>

      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="p-4">
          <label className="mb-2 block text-sm font-medium text-foreground">{t.review.comment}</label>
          <Textarea placeholder={t.review.commentPlaceholder} value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
        </CardContent>
      </Card>

      <Button className="w-full" disabled={rating === 0} onClick={handleSubmit}>{t.review.submit}</Button>
    </div>
  );
};

export default ConsultationReviewPage;
