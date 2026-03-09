import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft, Building2, Phone, Mail, FileCheck, Calendar, Star,
  ClipboardList, Stethoscope, Ban, CheckCircle, ImageIcon, Save, Shield,
} from "lucide-react";
import { adminDoctors, type AdminDoctor } from "../data/adminDoctorData";
import { getOrdersByDoctorId } from "../data/adminRelations";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const AdminDoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const source = adminDoctors.find((d) => d.id === id);
  const [doc, setDoc] = useState<AdminDoctor | null>(source ? { ...source } : null);
  const relatedOrders = doc ? getOrdersByDoctorId(doc.id) : [];

  const [editingPerms, setEditingPerms] = useState(false);
  const [perms, setPerms] = useState(source?.permissions || { inClinic: false, textConsult: false, videoConsult: false, canPrescribe: false, canIssueSickLeave: false });

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Stethoscope className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{isEn ? "Doctor not found" : "找不到醫生"}</p>
        <Button variant="link" onClick={() => navigate("/admin/doctors")}>{isEn ? "Back to list" : "返回列表"}</Button>
      </div>
    );
  }

  const handleToggle = () => {
    const newStatus = doc.status === "disabled" ? "active" : "disabled";
    setDoc((prev) => prev ? { ...prev, status: newStatus as AdminDoctor["status"] } : prev);
    toast.success(isEn ? `Doctor ${newStatus === "disabled" ? "disabled" : "enabled"}` : `醫生已${newStatus === "disabled" ? "停用" : "啟用"}`);
  };

  const savePerms = () => {
    setDoc((prev) => prev ? { ...prev, permissions: { ...perms } } : prev);
    setEditingPerms(false);
    toast.success(isEn ? "Permissions updated" : "權限已更新");
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: isEn ? "Active" : "活躍", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
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
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium text-foreground">{value || "—"}</p></div>
    </div>
  );

  const PermRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-2.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} disabled={!editingPerms} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/doctors")}><ArrowLeft className="h-4 w-4" /></Button>
        <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{doc.name.split(" ").pop()?.[0]}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{isEn ? doc.name : doc.nameZh}</h1>
            {statusBadge(doc.status)}
          </div>
          <p className="text-sm text-muted-foreground">{doc.id} · {doc.specialties.join(", ")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleToggle} className="gap-1">
          {doc.status === "disabled" ? <><CheckCircle className="h-3.5 w-3.5" />{isEn ? "Enable" : "啟用"}</> : <><Ban className="h-3.5 w-3.5" />{isEn ? "Disable" : "停用"}</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Clinic Orders" : "到店訂單"} value={doc.clinicOrders} />
        <AdminMetricCard icon={Stethoscope} label={isEn ? "Consultations" : "線上問診"} value={doc.consultations} />
        <AdminMetricCard icon={Star} label={isEn ? "Rating" : "評分"} value={doc.rating > 0 ? `${doc.rating} (${doc.reviewCount})` : "—"} />
        <AdminMetricCard icon={Calendar} label={isEn ? "Experience" : "經驗"} value={`${doc.yearsExp} ${isEn ? "years" : "年"}`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Profile" : "基本資料"}</CardTitle></CardHeader>
          <CardContent className="space-y-1 divide-y divide-border">
            <InfoRow icon={Stethoscope} label={isEn ? "Specialties" : "專科"} value={doc.specialties.join(", ")} />
            <InfoRow icon={Building2} label={isEn ? "Institution" : "所屬機構"} value={isEn ? doc.institution : doc.institutionZh} />
            <InfoRow icon={Phone} label={isEn ? "Phone" : "電話"} value={doc.phone} />
            <InfoRow icon={Mail} label={isEn ? "Email" : "電郵"} value={doc.email} />
            <InfoRow icon={Calendar} label={isEn ? "Onboarded" : "入駐日期"} value={doc.onboardingDate} />
            <div className="py-2">
              <p className="text-xs text-muted-foreground mb-1">{isEn ? "Bio" : "簡介"}</p>
              <p className="text-sm text-foreground">{isEn ? doc.bio : doc.bioZh}</p>
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{isEn ? "Credentials" : "資質信息"}</CardTitle>
              {credBadge(doc.credentialStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 divide-y divide-border">
              <InfoRow icon={FileCheck} label={isEn ? "Dental License" : "牙醫執照"} value={doc.license} />
            </div>
            {doc.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive mb-1">{isEn ? "Rejection Reason" : "拒絕原因"}</p>
                <p className="text-sm text-foreground">{doc.rejectionReason}</p>
              </div>
            )}
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{isEn ? "Certificates" : "證書文件"}</p>
              <div className="flex flex-wrap gap-2">
                {doc.certificates.map((cert, i) => (
                  <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium">{cert}</span>
                  </div>
                ))}
              </div>
              <ApiPlaceholderNotice service={isEn ? "Certificate Viewer" : "證書查看器"} className="mt-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />{isEn ? "Service Permissions" : "服務權限"}</CardTitle>
          {editingPerms ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setPerms(doc.permissions); setEditingPerms(false); }}>{isEn ? "Cancel" : "取消"}</Button>
              <Button size="sm" onClick={savePerms} className="gap-1"><Save className="h-3.5 w-3.5" />{isEn ? "Save" : "保存"}</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditingPerms(true)}>{isEn ? "Edit Permissions" : "編輯權限"}</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="max-w-md divide-y divide-border">
            <PermRow label={isEn ? "In-Clinic Appointments" : "到店預約"} checked={perms.inClinic} onChange={(v) => setPerms((p) => ({ ...p, inClinic: v }))} />
            <PermRow label={isEn ? "Text & Image Consultation" : "圖文問診"} checked={perms.textConsult} onChange={(v) => setPerms((p) => ({ ...p, textConsult: v }))} />
            <PermRow label={isEn ? "Video Consultation" : "視頻問診"} checked={perms.videoConsult} onChange={(v) => setPerms((p) => ({ ...p, videoConsult: v }))} />
            <PermRow label={isEn ? "Prescribe Medication" : "開具處方"} checked={perms.canPrescribe} onChange={(v) => setPerms((p) => ({ ...p, canPrescribe: v }))} />
            <PermRow label={isEn ? "Issue Sick Leave Certificate" : "開具病假證明"} checked={perms.canIssueSickLeave} onChange={(v) => setPerms((p) => ({ ...p, canIssueSickLeave: v }))} />
          </div>
        </CardContent>
      </Card>

      {/* Placeholders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Recent Orders" : "近期訂單"}</CardTitle></CardHeader>
          <CardContent>
            {relatedOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <ClipboardList className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">{isEn ? "No order data yet" : "暫無訂單資料"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {relatedOrders.slice(0, 4).map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 hover:bg-muted/50"
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
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Rating Summary" : "評分概覽"}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Star className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">{isEn ? "Rating breakdown will be shown here" : "評分詳情將在此顯示"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDoctorDetailPage;
