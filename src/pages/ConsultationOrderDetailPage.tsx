import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useConsultation } from "@/context/ConsultationContext";
import { mockOnlineDoctors } from "@/data/mockData";
import { ArrowLeft, MessageSquareText, Video, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConsultationStatusBadge from "@/components/ConsultationStatusBadge";

const ConsultationOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { consultations, cancelConsultation, acceptConsultation } = useConsultation();
  const lang = language === "zh-HK" ? "zh" : "en";

  const order = consultations.find((c) => c.id === orderId);
  if (!order) return <div className="p-8 text-center text-muted-foreground">Not found</div>;

  const doctor = mockOnlineDoctors.find((d) => d.id === order.doctorId);

  const canCancel = order.status === "pending_acceptance";
  const canChat = order.status === "in_consultation" && order.consultationType === "text_image";
  const canVideo = order.status === "in_consultation" && order.consultationType === "video";
  const canReview = order.status === "completed" && !order.reviewed;
  const hasReport = order.status === "completed" && order.diagnosisNotes;

  const rows = [
    { label: t.orderManagement.orderNo, value: order.orderNumber },
    { label: t.orderManagement.status, value: <ConsultationStatusBadge status={order.status} /> },
    { label: t.booking.doctor, value: doctor?.name[lang] || "" },
    { label: t.consultation.consultationType, value: order.consultationType === "text_image" ? t.consultation.textImage : t.consultation.video },
    { label: t.consultation.symptoms, value: order.symptoms.substring(0, 60) + (order.symptoms.length > 60 ? "..." : "") },
    { label: t.orderManagement.createdAt, value: new Date(order.createdAt).toLocaleString() },
  ];

  return (
    <div className="animate-fade-in pb-28">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-lg font-bold text-foreground">{t.consultation.orderDetail}</h1>
      </div>

      <div className="space-y-4 px-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="divide-y divide-border p-0">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm font-medium text-foreground">{r.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Price */}
        <Card className="border-0 shadow-sm">
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t.consultation.consultationFee}</span>
              <span className="text-foreground">HK${order.price}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-base font-semibold text-foreground">{t.booking.finalAmount}</span>
              <span className="text-xl font-bold text-primary">HK${order.finalAmount}</span>
            </div>
            {order.status === "cancelled" && order.refundAmount !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.orderManagement.refundAmount}</span>
                <span className="font-semibold text-success">HK${order.refundAmount}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cancellation rules */}
        {canCancel && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t.consultation.cancellationRules}</h3>
              <p className="text-xs text-muted-foreground">• {t.consultation.cancelPendingRule}</p>
              <p className="text-xs text-muted-foreground">• {t.consultation.cancelInProgressRule}</p>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis output for completed */}
        {hasReport && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t.consultation.diagnosisNotes}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{order.diagnosisNotes?.[lang]}</p>
              <h3 className="mb-2 mt-4 text-sm font-semibold text-foreground">{t.consultation.medicationAdvice}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{order.medicationAdvice?.[lang]}</p>
            </CardContent>
          </Card>
        )}

        {/* Mock accept button for pending orders (for demo) */}
        {order.status === "pending_acceptance" && (
          <Button variant="outline" className="w-full" onClick={() => acceptConsultation(order.id)}>
            {t.consultation.simulateAccept}
          </Button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
        <div className="mx-auto flex max-w-lg gap-3 px-4 py-3">
          {canCancel && (
            <Button variant="outline" className="flex-1 text-destructive" onClick={() => { cancelConsultation(order.id); navigate(-1); }}>
              {t.orderManagement.cancelOrder}
            </Button>
          )}
          {canChat && (
            <Button className="flex-1" onClick={() => navigate(`/consultation/chat/${orderId}`)}>
              <MessageSquareText className="mr-1 h-4 w-4" /> {t.consultation.enterChat}
            </Button>
          )}
          {canVideo && (
            <Button className="flex-1" onClick={() => navigate(`/consultation/video/${orderId}`)}>
              <Video className="mr-1 h-4 w-4" /> {t.consultation.joinVideo}
            </Button>
          )}
          {canReview && (
            <Button className="flex-1" onClick={() => navigate(`/consultation/order/${orderId}/review`)}>
              {t.orderManagement.writeReview}
            </Button>
          )}
          {hasReport && (
            <Button variant="outline" className="flex-1" onClick={() => navigate(`/report/${orderId}`)}>
              <FileText className="mr-1 h-4 w-4" /> {t.consultation.viewReport}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationOrderDetailPage;
