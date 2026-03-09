import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Building2, FileCheck, CheckCircle, XCircle, ImageIcon, ArrowLeft } from "lucide-react";
import { adminInstitutions, type AdminInstitution } from "../data/adminInstitutionData";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const AdminInstitutionReviewsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [pendingList, setPendingList] = useState<AdminInstitution[]>(
    adminInstitutions.filter((i) => i.status === "pending")
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reviewTarget, setReviewTarget] = useState<AdminInstitution | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [rejectReason, setRejectReason] = useState("");

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === pendingList.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pendingList.map((i) => i.id)));
    }
  };

  const handleReview = () => {
    if (!reviewTarget) return;
    setPendingList((prev) => prev.filter((i) => i.id !== reviewTarget.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(reviewTarget.id); return n; });
    toast.success(
      reviewAction === "approve"
        ? (isEn ? `${reviewTarget.name} approved` : `${reviewTarget.nameZh} 已批准`)
        : (isEn ? `${reviewTarget.name} rejected` : `${reviewTarget.nameZh} 已拒絕`)
    );
    setReviewTarget(null);
    setRejectReason("");
  };

  const handleBatchApprove = () => {
    setPendingList((prev) => prev.filter((i) => !selected.has(i.id)));
    toast.success(isEn ? `${selected.size} institutions approved` : `${selected.size} 個機構已批准`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/institutions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Credential Reviews" : "資質審核"}</h1>
          <p className="text-sm text-muted-foreground">
            {isEn ? `${pendingList.length} applications pending review` : `${pendingList.length} 個申請待審核`}
          </p>
        </div>
      </div>

      {pendingList.length > 0 && (
        <div className="flex items-center gap-3">
          <Checkbox checked={selected.size === pendingList.length && pendingList.length > 0} onCheckedChange={toggleAll} />
          <span className="text-sm text-muted-foreground">
            {selected.size > 0
              ? (isEn ? `${selected.size} selected` : `已選 ${selected.size} 個`)
              : (isEn ? "Select all" : "全選")}
          </span>
          {selected.size > 0 && (
            <Button size="sm" onClick={handleBatchApprove} className="gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              {isEn ? "Batch Approve" : "批量批准"}
            </Button>
          )}
        </div>
      )}

      {pendingList.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">{isEn ? "No pending reviews" : "沒有待審核的申請"}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingList.map((inst) => (
            <Card key={inst.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Checkbox checked={selected.has(inst.id)} onCheckedChange={() => toggleSelect(inst.id)} className="mt-1" />
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{isEn ? inst.name : inst.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{inst.id} · {inst.region}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{isEn ? "Pending" : "待審核"}</Badge>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Contact" : "聯繫人"}</p>
                        <p className="font-medium">{inst.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Phone" : "電話"}</p>
                        <p className="font-medium">{inst.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Business License" : "商業登記"}</p>
                        <p className="font-medium font-mono text-xs">{inst.businessLicense || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{isEn ? "Medical License" : "醫療執照"}</p>
                        <p className="font-medium font-mono text-xs">{inst.medicalLicense || "—"}</p>
                      </div>
                    </div>

                    {/* Certificate placeholders */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Uploaded Certificates" : "已上傳證書"}</p>
                      {inst.certificates.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">{isEn ? "No certificates uploaded" : "未上傳證書"}</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {inst.certificates.map((cert, i) => (
                            <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs font-medium">{cert}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <ApiPlaceholderNotice service={isEn ? "Certificate Viewer" : "證書查看器"} className="mt-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => { setReviewTarget(inst); setReviewAction("approve"); }} className="gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />{isEn ? "Approve" : "批准"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setReviewTarget(inst); setReviewAction("reject"); }} className="gap-1">
                        <XCircle className="h-3.5 w-3.5" />{isEn ? "Reject" : "拒絕"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/admin/institutions/${inst.id}`)}>
                        {isEn ? "View Details" : "查看詳情"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review confirmation dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={(o) => { if (!o) { setReviewTarget(null); setRejectReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve"
                ? (isEn ? "Approve Institution" : "批准機構")
                : (isEn ? "Reject Institution" : "拒絕機構")}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? (isEn
                  ? `Approve "${reviewTarget?.name}" and activate their account?`
                  : `批准「${reviewTarget?.nameZh}」並啟動其帳戶？`)
                : (isEn
                  ? `Reject "${reviewTarget?.name}"? Please provide a reason.`
                  : `拒絕「${reviewTarget?.nameZh}」？請提供原因。`)}
            </DialogDescription>
          </DialogHeader>
          {reviewAction === "reject" && (
            <Textarea
              placeholder={isEn ? "Enter rejection reason..." : "輸入拒絕原因..."}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReviewTarget(null); setRejectReason(""); }}>
              {isEn ? "Cancel" : "取消"}
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={handleReview}
              disabled={reviewAction === "reject" && !rejectReason.trim()}
            >
              {reviewAction === "approve" ? (isEn ? "Confirm Approve" : "確認批准") : (isEn ? "Confirm Reject" : "確認拒絕")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInstitutionReviewsPage;
