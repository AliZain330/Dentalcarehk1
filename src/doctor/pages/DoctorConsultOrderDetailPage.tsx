import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, User, Clock, Video, Image, FileText, MessageSquare, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { mockConsultOrders, type ConsultOrderStatus } from "./DoctorOrdersPage";

const DoctorConsultOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const original = mockConsultOrders.find((o) => o.id === orderId);
  const [status, setStatus] = useState<ConsultOrderStatus>(original?.status || "pending_acceptance");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!original) return <div className="p-8 text-center text-muted-foreground">Not found</div>;
  const order = { ...original, status };

  const statusMap: Record<ConsultOrderStatus, { label: string; cls: string }> = {
    pending_acceptance: { label: isEn ? "Pending Acceptance" : "待接受", cls: "bg-warning/10 text-warning border-warning/20" },
    in_consultation: { label: isEn ? "In Consultation" : "諮詢中", cls: "bg-info/10 text-info border-info/20" },
    completed: { label: isEn ? "Completed" : "已完成", cls: "bg-success/10 text-success border-success/20" },
    rejected: { label: isEn ? "Rejected" : "已拒絕", cls: "bg-destructive/10 text-destructive border-destructive/20" },
  };
  const st = statusMap[order.status];

  const handleReject = () => {
    if (!rejectReason.trim()) { toast({ title: isEn ? "Please provide a reason" : "請填寫拒絕原因", variant: "destructive" }); return; }
    setStatus("rejected");
    setShowRejectDialog(false);
    toast({ title: isEn ? "Order rejected" : "已拒絕訂單" });
  };

  return (
    <div className="animate-fade-in p-4 pt-5 pb-28">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{isEn ? "Consultation Details" : "諮詢詳情"}</h1>
          <p className="text-xs text-muted-foreground">{order.orderNo}</p>
        </div>
        <Badge variant="outline" className={st.cls}>{st.label}</Badge>
      </div>

      <div className="space-y-3">
        {/* Patient */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "PATIENT" : "患者"}</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm font-semibold text-foreground">{order.patient.name}</p>
                <p className="text-xs text-muted-foreground">{order.patient.gender[lang]} · {order.patient.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "CONSULTATION" : "諮詢資訊"}</p>
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-info" />
              <span className="text-sm font-semibold text-foreground">{order.consultationType === "text_image" ? (isEn ? "Text & Image Consultation" : "圖文諮詢") : (isEn ? "Video Consultation" : "視頻諮詢")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">{isEn ? "Fee" : "費用"}</span><p className="font-medium text-primary">HK${order.amount}</p></div>
              <div><span className="text-muted-foreground">{isEn ? "Ordered" : "下單時間"}</span><p className="font-medium text-foreground">{order.createdAt.replace("T", " ").slice(0, 16)}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "SYMPTOMS" : "症狀描述"}</p>
            <p className="text-sm text-foreground">{order.symptoms[lang]}</p>
          </CardContent>
        </Card>

        {/* Medical history */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "MEDICAL HISTORY" : "病史"}</p>
            <p className="text-sm text-foreground">{order.medicalHistory[lang]}</p>
          </CardContent>
        </Card>

        {/* Images */}
        {order.imageCount > 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "UPLOADED IMAGES" : "已上傳圖片"}</p>
              <div className="flex gap-2">
                {Array.from({ length: order.imageCount }).map((_, i) => (
                  <div key={i} className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted"><Image className="h-6 w-6 text-muted-foreground/40" /></div>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{order.imageCount} {isEn ? "image(s)" : "張圖片"}</p>
            </CardContent>
          </Card>
        )}

        {/* Rejection reason */}
        {order.status === "rejected" && order.rejectionReason && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-4 flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">{isEn ? "Rejection Reason" : "拒絕原因"}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{order.rejectionReason}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Consultation timeline */}
        {(order.consultationStartedAt || order.consultationEndedAt) && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "TIMELINE" : "時間線"}</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground">{isEn ? "Created" : "建立"}</span><span className="text-foreground">{order.createdAt.replace("T", " ").slice(0, 16)}</span></div>
                {order.consultationStartedAt && <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-info" /><span className="text-muted-foreground">{isEn ? "Started" : "開始"}</span><span className="text-foreground">{order.consultationStartedAt.replace("T", " ").slice(0, 16)}</span></div>}
                {order.consultationEndedAt && <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /><span className="text-muted-foreground">{isEn ? "Ended" : "結束"}</span><span className="text-foreground">{order.consultationEndedAt.replace("T", " ").slice(0, 16)}</span></div>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis notes (completed) */}
        {order.status === "completed" && order.diagnosisNotes && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "DIAGNOSIS NOTES" : "診斷意見"}</p>
              <p className="text-sm text-foreground leading-relaxed">{order.diagnosisNotes[lang]}</p>
            </CardContent>
          </Card>
        )}

        {/* Medication advice (completed) */}
        {order.status === "completed" && order.medicationAdvice && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{isEn ? "MEDICATION ADVICE" : "用藥建議"}</p>
              <p className="text-sm text-foreground leading-relaxed">{order.medicationAdvice[lang]}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      {(order.status === "pending_acceptance" || order.status === "in_consultation") && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
          <div className="mx-auto max-w-lg px-4 py-3 space-y-2">
            {order.status === "pending_acceptance" && (
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { setStatus("in_consultation"); toast({ title: isEn ? "Consultation accepted — you can now communicate with the patient" : "已接受諮詢 — 您現在可以與患者溝通" }); }}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Accept" : "接受"}
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => setShowRejectDialog(true)}>
                  <XCircle className="mr-1.5 h-4 w-4" />{isEn ? "Reject" : "拒絕"}
                </Button>
              </div>
            )}
            {order.status === "in_consultation" && (
              <div className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => toast({ title: isEn ? "Opening chat (mock)" : "打開對話（模擬）" })}>
                  <MessageSquare className="mr-1.5 h-4 w-4" />{order.consultationType === "video" ? (isEn ? "Join Video Call" : "加入視頻通話") : (isEn ? "Enter Chat" : "進入對話")}
                </Button>
                <Button className="w-full" onClick={() => { setStatus("completed"); toast({ title: isEn ? "Consultation completed" : "諮詢已完成" }); }}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />{isEn ? "Mark Completed" : "標記完成"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{isEn ? "Reject Consultation" : "拒絕諮詢"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{isEn ? "Please provide a reason for rejecting this consultation request. The patient will be notified." : "請填寫拒絕此諮詢請求的原因。患者將收到通知。"}</p>
            <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={isEn ? "e.g. This condition requires a specialist..." : "例如：此情況需要專科醫生..."} className="min-h-[80px]" maxLength={300} />
            <p className="text-xs text-muted-foreground text-right">{rejectReason.length}/300</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectDialog(false)}>{isEn ? "Cancel" : "取消"}</Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={!rejectReason.trim()}>{isEn ? "Confirm Reject" : "確認拒絕"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorConsultOrderDetailPage;
