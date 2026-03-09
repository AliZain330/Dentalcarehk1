import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, Building2, MapPin, Phone, Mail, User, FileCheck, Calendar,
  ClipboardList, Wallet, Stethoscope, Pencil, Ban, CheckCircle, Trash2, AlertTriangle, ImageIcon, Save,
} from "lucide-react";
import { adminInstitutions, type AdminInstitution } from "../data/adminInstitutionData";
import { getDisputesByInstitutionId, getOrdersByInstitutionId } from "../data/adminRelations";
import { adminDoctors } from "../data/adminDoctorData";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const AdminInstitutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const source = adminInstitutions.find((i) => i.id === id);
  const relatedOrders = inst ? getOrdersByInstitutionId(inst.id) : [];
  const relatedDoctors = inst ? adminDoctors.filter((doctor) => doctor.institutionId === inst.id) : [];
  const relatedDisputes = inst ? getDisputesByInstitutionId(inst.id) : [];

  const [inst, setInst] = useState<AdminInstitution | null>(source ? { ...source } : null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminInstitution>>({});
  const [showDelete, setShowDelete] = useState(false);

  if (!inst) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{isEn ? "Institution not found" : "找不到機構"}</p>
        <Button variant="link" onClick={() => navigate("/admin/institutions")}>{isEn ? "Back to list" : "返回列表"}</Button>
      </div>
    );
  }

  const startEdit = () => {
    setEditForm({ name: inst.name, nameZh: inst.nameZh, phone: inst.phone, email: inst.email, address: inst.address, contactPerson: inst.contactPerson });
    setEditing(true);
  };

  const saveEdit = () => {
    setInst((prev) => prev ? { ...prev, ...editForm } : prev);
    setEditing(false);
    toast.success(isEn ? "Institution updated" : "機構已更新");
  };

  const handleToggle = () => {
    const newStatus = inst.status === "disabled" ? "approved" : "disabled";
    setInst((prev) => prev ? { ...prev, status: newStatus as AdminInstitution["status"] } : prev);
    toast.success(isEn ? `Institution ${newStatus === "disabled" ? "disabled" : "enabled"}` : `機構已${newStatus === "disabled" ? "停用" : "啟用"}`);
  };

  const handleDelete = () => {
    if (inst.orders > 0) {
      toast.error(isEn ? "Cannot delete — institution has orders" : "無法刪除 — 機構已有訂單");
      setShowDelete(false);
      return;
    }
    toast.success(isEn ? "Institution deleted" : "機構已刪除");
    navigate("/admin/institutions");
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      approved: { label: isEn ? "Approved" : "已批准", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", variant: "destructive" },
      disabled: { label: isEn ? "Disabled" : "已停用", variant: "outline" },
    };
    return <Badge variant={(map[s] || map.pending).variant}>{(map[s] || map.pending).label}</Badge>;
  };

  const credBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      approved: { label: isEn ? "Verified" : "已驗證", variant: "default" },
      pending: { label: isEn ? "Under Review" : "審核中", variant: "secondary" },
      rejected: { label: isEn ? "Failed" : "未通過", variant: "destructive" },
      not_submitted: { label: isEn ? "Not Submitted" : "未提交", variant: "outline" },
    };
    return <Badge variant={(map[s] || map.pending).variant}>{(map[s] || map.pending).label}</Badge>;
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/institutions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{isEn ? inst.name : inst.nameZh}</h1>
            {statusBadge(inst.status)}
          </div>
          <p className="text-sm text-muted-foreground">{inst.id} · {inst.region}</p>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <>
              <Button variant="outline" size="sm" onClick={startEdit} className="gap-1">
                <Pencil className="h-3.5 w-3.5" />{isEn ? "Edit" : "編輯"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleToggle} className="gap-1">
                {inst.status === "disabled"
                  ? <><CheckCircle className="h-3.5 w-3.5" />{isEn ? "Enable" : "啟用"}</>
                  : <><Ban className="h-3.5 w-3.5" />{isEn ? "Disable" : "停用"}</>}
              </Button>
              <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive" onClick={() => setShowDelete(true)}>
                <Trash2 className="h-3.5 w-3.5" />{isEn ? "Delete" : "刪除"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Total Orders" : "總訂單"} value={inst.orders.toLocaleString()} />
        <AdminMetricCard icon={Wallet} label={isEn ? "Revenue" : "交易額"} value={`HK$${inst.transactionAmount.toLocaleString()}`} />
        <AdminMetricCard icon={Stethoscope} label={isEn ? "Doctors" : "醫生"} value={inst.doctors} />
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Disputes" : "爭議"} value={relatedDisputes.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic info / edit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">{isEn ? "Basic Information" : "基本資訊"}</CardTitle>
            {editing && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>{isEn ? "Cancel" : "取消"}</Button>
                <Button size="sm" onClick={saveEdit} className="gap-1"><Save className="h-3.5 w-3.5" />{isEn ? "Save" : "保存"}</Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{isEn ? "Name (EN)" : "名稱（英文）"}</Label><Input value={editForm.name || ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></div>
                  <div><Label>{isEn ? "Name (ZH)" : "名稱（中文）"}</Label><Input value={editForm.nameZh || ""} onChange={(e) => setEditForm((p) => ({ ...p, nameZh: e.target.value }))} /></div>
                </div>
                <div><Label>{isEn ? "Contact Person" : "聯繫人"}</Label><Input value={editForm.contactPerson || ""} onChange={(e) => setEditForm((p) => ({ ...p, contactPerson: e.target.value }))} /></div>
                <div><Label>{isEn ? "Phone" : "電話"}</Label><Input value={editForm.phone || ""} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} /></div>
                <div><Label>{isEn ? "Email" : "電郵"}</Label><Input value={editForm.email || ""} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} /></div>
                <div><Label>{isEn ? "Address" : "地址"}</Label><Input value={editForm.address || ""} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} /></div>
              </div>
            ) : (
              <div className="space-y-1 divide-y divide-border">
                <InfoRow icon={Building2} label={isEn ? "Name (EN)" : "英文名稱"} value={inst.name} />
                <InfoRow icon={Building2} label={isEn ? "Name (ZH)" : "中文名稱"} value={inst.nameZh} />
                <InfoRow icon={User} label={isEn ? "Contact" : "聯繫人"} value={inst.contactPerson} />
                <InfoRow icon={Phone} label={isEn ? "Phone" : "電話"} value={inst.phone} />
                <InfoRow icon={Mail} label={isEn ? "Email" : "電郵"} value={inst.email} />
                <InfoRow icon={MapPin} label={isEn ? "Address" : "地址"} value={inst.address} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{isEn ? "Credentials" : "資質信息"}</CardTitle>
              {credBadge(inst.credentialStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 divide-y divide-border">
              <InfoRow icon={FileCheck} label={isEn ? "Business License" : "商業登記"} value={inst.businessLicense} />
              <InfoRow icon={FileCheck} label={isEn ? "Medical License" : "醫療執照"} value={inst.medicalLicense} />
            </div>

            {inst.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive mb-1">{isEn ? "Rejection Reason" : "拒絕原因"}</p>
                <p className="text-sm text-foreground">{inst.rejectionReason}</p>
              </div>
            )}

            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Uploaded Certificates" : "已上傳證書"}</p>
              {inst.certificates.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">{isEn ? "No certificates" : "無證書"}</p>
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
              <ApiPlaceholderNotice service={isEn ? "Certificate Viewer" : "證書查看器"} className="mt-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected related data */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Recent Orders" : "近期訂單"}</CardTitle></CardHeader>
          <CardContent>
            {relatedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardList className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">{isEn ? "No related orders yet" : "暫無相關訂單"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedOrders.slice(0, 4).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:bg-muted/50"
                  >
                    <span className="font-mono text-xs">{order.id}</span>
                    <span className="text-sm">HK${order.amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Doctor Overview" : "醫生概覽"}</CardTitle></CardHeader>
          <CardContent>
            {relatedDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Stethoscope className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">{isEn ? "No doctors linked" : "暫無關聯醫生"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedDoctors.slice(0, 4).map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => navigate(`/admin/doctors/${doctor.id}`)}
                    className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-left hover:bg-muted/50"
                  >
                    <span className="text-sm">{isEn ? doctor.name : doctor.nameZh}</span>
                    <span className="font-mono text-xs text-muted-foreground">{doctor.id}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {inst.orders > 0 ? (isEn ? "Deletion Blocked" : "無法刪除") : (isEn ? "Delete Institution" : "刪除機構")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {inst.orders > 0 ? (
                <span className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <span>
                    {isEn
                      ? `This institution has ${inst.orders} orders and HK$${inst.transactionAmount.toLocaleString()} in transactions. It cannot be deleted. Consider disabling the account instead.`
                      : `此機構已有 ${inst.orders} 個訂單及 HK$${inst.transactionAmount.toLocaleString()} 交易額，無法刪除。建議改為停用帳戶。`}
                  </span>
                </span>
              ) : (
                isEn ? "This action cannot be undone. Are you sure?" : "此操作無法撤銷，確定要繼續嗎？"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isEn ? "Cancel" : "取消"}</AlertDialogCancel>
            {inst.orders > 0 ? (
              <AlertDialogAction onClick={() => { handleToggle(); setShowDelete(false); }}>
                {isEn ? "Disable Instead" : "改為停用"}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isEn ? "Delete" : "刪除"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminInstitutionDetailPage;
