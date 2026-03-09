import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, FileCheck, CheckCircle, XCircle, ImageIcon, Stethoscope, Building2, Bell } from "lucide-react";
import { adminDoctors, type AdminDoctor } from "../data/adminDoctorData";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const AdminDoctorReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [pendingList, setPendingList] = useState<AdminDoctor[]>(
    adminDoctors.filter((d) => d.credentialStatus === "pending")
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reviewTarget, setReviewTarget] = useState<AdminDoctor | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [rejectReason, setRejectReason] = useState("");

  const toggleSelect = (id: string) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(selected.size === pendingList.length ? new Set() : new Set(pendingList.map((d) => d.id)));

  const handleReview = () => {
    if (!reviewTarget) return;
    setPendingList((prev) => prev.filter((d) => d.id !== reviewTarget.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(reviewTarget.id); return n; });
    const action = reviewAction === "approve" ? (isEn ? "approved" : "已批准") : (isEn ? "rejected" : "已拒絕");
    toast.success(`${isEn ? reviewTarget.name : reviewTarget.nameZh} ${action}`);
    toast.info(isEn ? `Institution "${reviewTarget.institution}" has been notified` : `已通知機構「${reviewTarget.institutionZh}」`, { icon: <Bell className="h-4 w-4" /> });
    setReviewTarget(null);
    setRejectReason("");
  };

  const handleBatchApprove = () => {
    setPendingList((prev) => prev.filter((d) => !selected.has(d.id)));
    toast.success(isEn ? `${selected.size} doctors approved` : `${selected.size} 位醫生已批准`);
    toast.info(isEn ? "All affiliated institutions have been notified" : "已通知所有相關機構");
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/doctors")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Doctor Credential Reviews" : "醫生資質審核"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? `${pendingList.length} applications pending` : `${pendingList.length} 個申請待審核`}</p>
        </div>
      </div>

      {pendingList.length > 0 && (
        <div className="flex items-center gap-3">
          <Checkbox checked={selected.size === pendingList.length && pendingList.length > 0} onCheckedChange={toggleAll} />
          <span className="text-sm text-muted-foreground">{selected.size > 0 ? (isEn ? `${selected.size} selected` : `已選 ${selected.size}`) : (isEn ? "Select all" : "全選")}</span>
          {selected.size > 0 && (
            <Button size="sm" onClick={handleBatchApprove} className="gap-1"><CheckCircle className="h-3.5 w-3.5" />{isEn ? "Batch Approve" : "批量批准"}</Button>
          )}
        </div>
      )}

      {pendingList.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <FileCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">{isEn ? "No pending reviews" : "沒有待審核的申請"}</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {pendingList.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Checkbox checked={selected.has(doc.id)} onCheckedChange={() => toggleSelect(doc.id)} className="mt-1" />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/10 text-primary font-semibold">{doc.name.split(" ").pop()?.[0]}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{isEn ? doc.name : doc.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{doc.id} · {doc.specialties.join(", ")}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{isEn ? "Pending" : "待審核"}</Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Institution" : "所屬機構"}</p>
                        <div className="flex items-center gap-1"><Building2 className="h-3 w-3 text-muted-foreground" /><span className="font-medium">{isEn ? doc.institution : doc.institutionZh}</span></div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "License" : "執照號碼"}</p>
                        <p className="font-medium font-mono text-xs">{doc.license}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Experience" : "經驗"}</p>
                        <p className="font-medium">{doc.yearsExp} {isEn ? "years" : "年"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Applied" : "申請日期"}</p>
                        <p className="font-medium">{doc.onboardingDate}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Certificates" : "證書文件"}</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.certificates.map((cert, i) => (
                          <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium">{cert}</span>
                          </div>
                        ))}
                      </div>
                      <ApiPlaceholderNotice service={isEn ? "Certificate Viewer" : "證書查看器"} className="mt-2" />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => { setReviewTarget(doc); setReviewAction("approve"); }} className="gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />{isEn ? "Approve" : "批准"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setReviewTarget(doc); setReviewAction("reject"); }} className="gap-1">
                        <XCircle className="h-3.5 w-3.5" />{isEn ? "Reject" : "拒絕"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/doctors/${doc.id}`)}>{isEn ? "View Details" : "查看詳情"}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!reviewTarget} onOpenChange={(o) => { if (!o) { setReviewTarget(null); setRejectReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reviewAction === "approve" ? (isEn ? "Approve Doctor" : "批准醫生") : (isEn ? "Reject Doctor" : "拒絕醫生")}</DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? (isEn ? `Approve "${reviewTarget?.name}" and activate their account? The affiliated institution will be notified.` : `批准「${reviewTarget?.nameZh}」並啟動帳戶？將通知所屬機構。`)
                : (isEn ? `Reject "${reviewTarget?.name}"? Please provide a reason. The affiliated institution will be notified.` : `拒絕「${reviewTarget?.nameZh}」？請提供原因。將通知所屬機構。`)}
            </DialogDescription>
          </DialogHeader>
          {reviewAction === "reject" && (
            <Textarea placeholder={isEn ? "Enter rejection reason..." : "輸入拒絕原因..."} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReviewTarget(null); setRejectReason(""); }}>{isEn ? "Cancel" : "取消"}</Button>
            <Button variant={reviewAction === "approve" ? "default" : "destructive"} onClick={handleReview} disabled={reviewAction === "reject" && !rejectReason.trim()}>
              {reviewAction === "approve" ? (isEn ? "Confirm Approve" : "確認批准") : (isEn ? "Confirm Reject" : "確認拒絕")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDoctorReviewsPage;
