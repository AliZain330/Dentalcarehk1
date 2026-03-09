import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrders } from "@/context/OrdersContext";
import { mockInstitutions } from "@/data/mockData";
import { ArrowLeft, Camera, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRatingInput from "@/components/StarRatingInput";
import { toast } from "@/hooks/use-toast";

const ReviewPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { orders, markReviewed } = useOrders();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = orders.find((o) => o.id === orderId);
  const inst = order ? mockInstitutions.find((i) => i.id === order.institutionId) : null;
  const svc = inst?.services.find((s) => s.id === order?.serviceId);
  const doc = inst?.doctors.find((d) => d.id === order?.doctorId);

  const [envRating, setEnvRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [doctorSkill, setDoctorSkill] = useState(0);
  const [doctorAttitude, setDoctorAttitude] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!order || !inst) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const canSubmit = envRating > 0 && serviceRating > 0 && doctorSkill > 0 && doctorAttitude > 0;

  const handleSubmit = () => {
    markReviewed(order.id);
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
            <Button className="mt-6 w-full" onClick={() => navigate(`/order/${orderId}`)}>
              {t.booking.viewOrder}
            </Button>
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

      {/* Order summary */}
      <Card className="mb-4 border-0 bg-secondary shadow-sm">
        <CardContent className="flex items-center gap-3 p-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${inst.logoColor}`}>
            <span className="text-xs font-bold text-primary-foreground">{inst.logoInitials}</span>
          </div>
          <div className="text-xs">
            <p className="font-medium text-foreground">{svc?.name[lang]}</p>
            <p className="text-muted-foreground">{doc?.name[lang]} · {order.date}</p>
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <StarRatingInput label={t.review.envRating} value={envRating} onChange={setEnvRating} />
          <StarRatingInput label={t.review.serviceRating} value={serviceRating} onChange={setServiceRating} />
          <StarRatingInput label={t.review.doctorSkill} value={doctorSkill} onChange={setDoctorSkill} />
          <StarRatingInput label={t.review.doctorAttitude} value={doctorAttitude} onChange={setDoctorAttitude} />
        </CardContent>
      </Card>

      {/* Comment */}
      <Card className="mb-4 border-0 shadow-sm">
        <CardContent className="p-4">
          <label className="mb-2 block text-sm font-medium text-foreground">{t.review.comment}</label>
          <Textarea
            placeholder={t.review.commentPlaceholder}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Photo upload placeholder */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground hover:border-primary">
            <Camera className="h-5 w-5" />
            {t.review.addPhotos}
          </button>
        </CardContent>
      </Card>

      <Button className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
        {t.review.submit}
      </Button>
    </div>
  );
};

export default ReviewPage;
