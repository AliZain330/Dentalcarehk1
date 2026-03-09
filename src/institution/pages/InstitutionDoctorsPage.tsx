import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";
import {
  Plus, Search, Pencil, User, Shield, DollarSign, Eye,
  CheckCircle, XCircle, Clock, AlertTriangle, ImagePlus, FileText, Upload,
} from "lucide-react";

type AccountStatus = "active" | "disabled";
type PricingStatus = "current" | "pending" | "approved" | "rejected";

interface DoctorPricing {
  textImage: number;
  textImageStatus: PricingStatus;
  textImagePending?: number;
  video: number;
  videoStatus: PricingStatus;
  videoPending?: number;
}

interface Doctor {
  id: string;
  name: string;
  nameZh: string;
  title: string;
  titleZh: string;
  specialties: string[];
  specialtiesZh: string[];
  licenseNo: string;
  photo: boolean;
  credentials: number;
  status: AccountStatus;
  permissions: {
    inClinic: boolean;
    onlineConsult: boolean;
  };
  pricing: DoctorPricing;
  consultations: number;
}

const initialDoctors: Doctor[] = [
  {
    id: "d1", name: "Dr. James Wong", nameZh: "黃俊明醫生",
    title: "Senior Dentist", titleZh: "高級牙醫",
    specialties: ["General Dentistry", "Orthodontics"], specialtiesZh: ["一般牙科", "矯齒"],
    licenseNo: "DC12345", photo: true, credentials: 3, status: "active",
    permissions: { inClinic: true, onlineConsult: true },
    pricing: { textImage: 280, textImageStatus: "current", video: 480, videoStatus: "current" },
    consultations: 156,
  },
  {
    id: "d2", name: "Dr. Emily Chen", nameZh: "陳美玲醫生",
    title: "Orthodontist", titleZh: "矯齒專科醫生",
    specialties: ["Orthodontics", "Cosmetic Dentistry"], specialtiesZh: ["矯齒", "美容牙科"],
    licenseNo: "DC23456", photo: true, credentials: 4, status: "active",
    permissions: { inClinic: true, onlineConsult: true },
    pricing: { textImage: 320, textImageStatus: "pending", textImagePending: 380, video: 520, videoStatus: "current" },
    consultations: 89,
  },
  {
    id: "d3", name: "Dr. Michael Lee", nameZh: "李偉明醫生",
    title: "Implant Specialist", titleZh: "植牙專科醫生",
    specialties: ["Dental Implants", "Oral Surgery"], specialtiesZh: ["植牙", "口腔外科"],
    licenseNo: "DC34567", photo: true, credentials: 5, status: "active",
    permissions: { inClinic: true, onlineConsult: false },
    pricing: { textImage: 350, textImageStatus: "current", video: 550, videoStatus: "rejected" },
    consultations: 42,
  },
  {
    id: "d4", name: "Dr. Sarah Lam", nameZh: "林淑儀醫生",
    title: "Pediatric Dentist", titleZh: "兒童牙科醫生",
    specialties: ["Pediatric Dentistry"], specialtiesZh: ["兒童牙科"],
    licenseNo: "DC45678", photo: false, credentials: 2, status: "disabled",
    permissions: { inClinic: true, onlineConsult: true },
    pricing: { textImage: 250, textImageStatus: "current", video: 400, videoStatus: "current" },
    consultations: 0,
  },
];

const specialtyOptions = [
  { en: "General Dentistry", zh: "一般牙科" },
  { en: "Orthodontics", zh: "矯齒" },
  { en: "Cosmetic Dentistry", zh: "美容牙科" },
  { en: "Dental Implants", zh: "植牙" },
  { en: "Oral Surgery", zh: "口腔外科" },
  { en: "Pediatric Dentistry", zh: "兒童牙科" },
  { en: "Endodontics", zh: "根管治療" },
  { en: "Periodontics", zh: "牙周病學" },
];

const InstitutionDoctorsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [detailDoctor, setDetailDoctor] = useState<Doctor | null>(null);
  const [detailTab, setDetailTab] = useState("info");

  const emptyForm = {
    name: "", nameZh: "", title: "", titleZh: "",
    specialties: [] as string[], specialtiesZh: [] as string[],
    licenseNo: "", photo: false, credentials: 0,
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let list = doctors;
    if (statusFilter !== "all") list = list.filter(d => d.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.nameZh.includes(q) ||
        d.licenseNo.toLowerCase().includes(q)
      );
    }
    return list;
  }, [doctors, search, statusFilter]);

  const openAdd = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setForm({
      name: doc.name, nameZh: doc.nameZh, title: doc.title, titleZh: doc.titleZh,
      specialties: doc.specialties, specialtiesZh: doc.specialtiesZh,
      licenseNo: doc.licenseNo, photo: doc.photo, credentials: doc.credentials,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isEn ? "Required" : "必填";
    if (!form.nameZh.trim()) e.nameZh = isEn ? "Required" : "必填";
    if (!form.title.trim()) e.title = isEn ? "Required" : "必填";
    if (!form.licenseNo.trim()) e.licenseNo = isEn ? "Required" : "必填";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingDoctor) {
      setDoctors(prev => prev.map(d => d.id === editingDoctor.id ? {
        ...d, name: form.name, nameZh: form.nameZh, title: form.title, titleZh: form.titleZh,
        specialties: form.specialties, specialtiesZh: form.specialtiesZh, licenseNo: form.licenseNo,
        photo: form.photo, credentials: form.credentials,
      } : d));
      toast({ title: isEn ? "Doctor updated" : "醫生已更新" });
    } else {
      const newDoc: Doctor = {
        id: `d${Date.now()}`, name: form.name, nameZh: form.nameZh,
        title: form.title, titleZh: form.titleZh,
        specialties: form.specialties, specialtiesZh: form.specialtiesZh,
        licenseNo: form.licenseNo, photo: form.photo, credentials: form.credentials,
        status: "active", permissions: { inClinic: true, onlineConsult: false },
        pricing: { textImage: 280, textImageStatus: "current", video: 480, videoStatus: "current" },
        consultations: 0,
      };
      setDoctors(prev => [...prev, newDoc]);
      toast({ title: isEn ? "Doctor added" : "醫生已新增" });
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: d.status === "active" ? "disabled" : "active" } : d));
    toast({ title: isEn ? "Status updated" : "狀態已更新" });
  };

  const updatePermissions = (id: string, key: "inClinic" | "onlineConsult", value: boolean) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, permissions: { ...d.permissions, [key]: value } } : d));
    toast({ title: isEn ? "Permissions updated" : "權限已更新" });
  };

  const handlePricingAction = (docId: string, type: "textImage" | "video", action: "approve" | "reject") => {
    setDoctors(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const pricing = { ...d.pricing };
      if (type === "textImage") {
        if (action === "approve" && pricing.textImagePending) {
          pricing.textImage = pricing.textImagePending;
          pricing.textImagePending = undefined;
          pricing.textImageStatus = "approved";
        } else if (action === "reject") {
          pricing.textImagePending = undefined;
          pricing.textImageStatus = "rejected";
        }
      } else {
        if (action === "approve" && pricing.videoPending) {
          pricing.video = pricing.videoPending;
          pricing.videoPending = undefined;
          pricing.videoStatus = "approved";
        } else if (action === "reject") {
          pricing.videoPending = undefined;
          pricing.videoStatus = "rejected";
        }
      }
      return { ...d, pricing };
    }));
    toast({ title: action === "approve" ? (isEn ? "Pricing approved" : "定價已批准") : (isEn ? "Pricing rejected" : "定價已拒絕") });
  };

  const toggleSpecialty = (specEn: string, specZh: string) => {
    if (form.specialties.includes(specEn)) {
      setForm(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== specEn),
        specialtiesZh: prev.specialtiesZh.filter(s => s !== specZh),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        specialties: [...prev.specialties, specEn],
        specialtiesZh: [...prev.specialtiesZh, specZh],
      }));
    }
  };

  const StatusBadge = ({ status }: { status: AccountStatus }) => (
    <Badge variant={status === "active" ? "default" : "secondary"} className={status === "disabled" ? "bg-destructive/10 text-destructive border-destructive/30" : ""}>
      {status === "active" ? (isEn ? "Active" : "啟用") : (isEn ? "Disabled" : "停用")}
    </Badge>
  );

  const PricingStatusBadge = ({ status }: { status: PricingStatus }) => {
    const config: Record<PricingStatus, { label: string; labelZh: string; variant: "default" | "secondary"; className?: string }> = {
      current: { label: "Current", labelZh: "現行", variant: "secondary" },
      pending: { label: "Pending Review", labelZh: "待審核", variant: "secondary", className: "bg-warning/10 text-warning border-warning/30" },
      approved: { label: "Approved", labelZh: "已批准", variant: "default" },
      rejected: { label: "Rejected", labelZh: "已拒絕", variant: "secondary", className: "bg-destructive/10 text-destructive border-destructive/30" },
    };
    const c = config[status];
    return <Badge variant={c.variant} className={c.className}>{isEn ? c.label : c.labelZh}</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Doctor Management" : "醫生管理"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isEn ? "Manage doctors under your institution" : "管理您機構的醫生"}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> {isEn ? "Add Doctor" : "新增醫生"}
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={isEn ? "Search by name or license..." : "按姓名或執照搜尋..."} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
              <SelectItem value="active">{isEn ? "Active" : "啟用"}</SelectItem>
              <SelectItem value="disabled">{isEn ? "Disabled" : "停用"}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: isEn ? "Total Doctors" : "總醫生數", value: doctors.length },
          { label: isEn ? "Active" : "啟用", value: doctors.filter(d => d.status === "active").length },
          { label: isEn ? "Pending Pricing" : "待審定價", value: doctors.filter(d => d.pricing.textImageStatus === "pending" || d.pricing.videoStatus === "pending").length },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {/* Doctor Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <User className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium">{isEn ? "No doctors found" : "找不到醫生"}</p>
              <p className="text-sm text-muted-foreground mt-1">{isEn ? "Try adjusting your search or add a new doctor" : "請嘗試調整搜尋條件或新增醫生"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                  <TableHead className="hidden md:table-cell">{isEn ? "License No." : "執照號碼"}</TableHead>
                  <TableHead className="hidden lg:table-cell">{isEn ? "Permissions" : "權限"}</TableHead>
                  <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(doc => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${doc.photo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {doc.photo ? (isEn ? doc.name : doc.nameZh).charAt(0) : <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{isEn ? doc.name : doc.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{isEn ? doc.title : doc.titleZh}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">{doc.licenseNo}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-1">
                        {doc.permissions.inClinic && <Badge variant="outline" className="text-xs">{isEn ? "In-Clinic" : "到診"}</Badge>}
                        {doc.permissions.onlineConsult && <Badge variant="outline" className="text-xs">{isEn ? "Online" : "線上"}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={doc.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setDetailDoctor(doc); setDetailTab("info"); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(doc)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDoctor ? (isEn ? "Edit Doctor" : "編輯醫生") : (isEn ? "Add New Doctor" : "新增醫生")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (EN)" : "姓名（英文）"}</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. John Smith" className={formErrors.name ? "border-destructive" : ""} />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (ZH)" : "姓名（中文）"}</Label>
                <Input value={form.nameZh} onChange={e => setForm(p => ({ ...p, nameZh: e.target.value }))} placeholder="史密斯醫生" className={formErrors.nameZh ? "border-destructive" : ""} />
                {formErrors.nameZh && <p className="text-xs text-destructive">{formErrors.nameZh}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Title (EN)" : "職稱（英文）"}</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Senior Dentist" className={formErrors.title ? "border-destructive" : ""} />
                {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Title (ZH)" : "職稱（中文）"}</Label>
                <Input value={form.titleZh} onChange={e => setForm(p => ({ ...p, titleZh: e.target.value }))} placeholder="高級牙醫" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "License Number" : "執照號碼"}</Label>
              <Input value={form.licenseNo} onChange={e => setForm(p => ({ ...p, licenseNo: e.target.value }))} placeholder="DC12345" className={formErrors.licenseNo ? "border-destructive" : ""} />
              {formErrors.licenseNo && <p className="text-xs text-destructive">{formErrors.licenseNo}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Specialties" : "專科"}</Label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map(spec => (
                  <Badge
                    key={spec.en}
                    variant={form.specialties.includes(spec.en) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSpecialty(spec.en, spec.zh)}
                  >
                    {isEn ? spec.en : spec.zh}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Doctor Photo" : "醫生照片"}</Label>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImagePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{isEn ? "API key not added yet" : "尚未添加API密鑰"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Credential Certificates" : "專業資格證書"}</Label>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{isEn ? "API key not added yet" : "尚未添加API密鑰"}</p>
                  <p className="text-xs mt-1">{isEn ? "Upload professional credentials" : "上傳專業資格證明"}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleSave}>{editingDoctor ? (isEn ? "Save Changes" : "儲存更改") : (isEn ? "Add Doctor" : "新增醫生")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Doctor Detail Dialog */}
      <Dialog open={!!detailDoctor} onOpenChange={() => setDetailDoctor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailDoctor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold ${detailDoctor.photo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {detailDoctor.photo ? (isEn ? detailDoctor.name : detailDoctor.nameZh).charAt(0) : <User className="h-5 w-5" />}
                  </div>
                  <div>
                    <p>{isEn ? detailDoctor.name : detailDoctor.nameZh}</p>
                    <p className="text-sm font-normal text-muted-foreground">{isEn ? detailDoctor.title : detailDoctor.titleZh}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs value={detailTab} onValueChange={setDetailTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info" className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> {isEn ? "Info" : "資訊"}
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> {isEn ? "Permissions" : "權限"}
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" /> {isEn ? "Pricing" : "定價"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{isEn ? "License Number" : "執照號碼"}</p>
                      <p className="font-mono text-sm">{detailDoctor.licenseNo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{isEn ? "Account Status" : "帳戶狀態"}</p>
                      <StatusBadge status={detailDoctor.status} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{isEn ? "Specialties" : "專科"}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(isEn ? detailDoctor.specialties : detailDoctor.specialtiesZh).map((s, i) => (
                        <Badge key={i} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{isEn ? "Credentials Uploaded" : "已上傳證書"}</p>
                    <p className="text-sm">{detailDoctor.credentials} {isEn ? "documents" : "份文件"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{isEn ? "Total Consultations" : "總諮詢數"}</p>
                    <p className="text-sm font-medium">{detailDoctor.consultations}</p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{isEn ? "Account Status" : "帳戶狀態"}</p>
                      <p className="text-xs text-muted-foreground">{detailDoctor.status === "disabled" ? (isEn ? "Doctor cannot accept orders" : "醫生無法接受訂單") : (isEn ? "Doctor can accept orders" : "醫生可接受訂單")}</p>
                    </div>
                    <Switch
                      checked={detailDoctor.status === "active"}
                      onCheckedChange={() => {
                        toggleStatus(detailDoctor.id);
                        setDetailDoctor(prev => prev ? { ...prev, status: prev.status === "active" ? "disabled" : "active" } : null);
                      }}
                    />
                  </div>
                  {detailDoctor.status === "disabled" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-destructive">{isEn ? "Account Disabled" : "帳戶已停用"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{isEn ? "This doctor cannot accept new orders or consultations." : "此醫生無法接受新訂單或諮詢。"}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="permissions" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{isEn ? "Configure which services this doctor can provide." : "設定此醫生可以提供的服務。"}</p>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{isEn ? "In-Clinic Treatment" : "到診治療"}</p>
                          <p className="text-xs text-muted-foreground">{isEn ? "Allow booking for in-person appointments" : "允許預約現場診療"}</p>
                        </div>
                        <Switch
                          checked={detailDoctor.permissions.inClinic}
                          onCheckedChange={(v) => {
                            updatePermissions(detailDoctor.id, "inClinic", v);
                            setDetailDoctor(prev => prev ? { ...prev, permissions: { ...prev.permissions, inClinic: v } } : null);
                          }}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{isEn ? "Online Consultation" : "線上諮詢"}</p>
                          <p className="text-xs text-muted-foreground">{isEn ? "Allow text/video consultations" : "允許圖文/視頻諮詢"}</p>
                        </div>
                        <Switch
                          checked={detailDoctor.permissions.onlineConsult}
                          onCheckedChange={(v) => {
                            updatePermissions(detailDoctor.id, "onlineConsult", v);
                            setDetailDoctor(prev => prev ? { ...prev, permissions: { ...prev.permissions, onlineConsult: v } } : null);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <ApiPlaceholderNotice service={isEn ? "Permission Sync" : "權限同步"} variant="inline" />
                </TabsContent>

                <TabsContent value="pricing" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{isEn ? "Review and approve consultation pricing changes." : "審核並批准諮詢定價變更。"}</p>
                  
                  {/* Text & Image Consultation */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {isEn ? "Text & Image Consultation" : "圖文諮詢"}
                        <PricingStatusBadge status={detailDoctor.pricing.textImageStatus} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isEn ? "Current Price" : "現行價格"}</span>
                        <span className="font-semibold">HK${detailDoctor.pricing.textImage}</span>
                      </div>
                      {detailDoctor.pricing.textImageStatus === "pending" && detailDoctor.pricing.textImagePending && (
                        <>
                          <div className="flex items-center justify-between text-warning">
                            <span className="text-sm">{isEn ? "Proposed Price" : "建議價格"}</span>
                            <span className="font-semibold">HK${detailDoctor.pricing.textImagePending}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => {
                              handlePricingAction(detailDoctor.id, "textImage", "approve");
                              setDetailDoctor(prev => prev ? {
                                ...prev,
                                pricing: { ...prev.pricing, textImage: prev.pricing.textImagePending!, textImagePending: undefined, textImageStatus: "approved" }
                              } : null);
                            }}>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Approve" : "批准"}
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                              handlePricingAction(detailDoctor.id, "textImage", "reject");
                              setDetailDoctor(prev => prev ? {
                                ...prev,
                                pricing: { ...prev.pricing, textImagePending: undefined, textImageStatus: "rejected" }
                              } : null);
                            }}>
                              <XCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Reject" : "拒絕"}
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Video Consultation */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {isEn ? "Video Consultation" : "視頻諮詢"}
                        <PricingStatusBadge status={detailDoctor.pricing.videoStatus} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{isEn ? "Current Price" : "現行價格"}</span>
                        <span className="font-semibold">HK${detailDoctor.pricing.video}</span>
                      </div>
                      {detailDoctor.pricing.videoStatus === "pending" && detailDoctor.pricing.videoPending && (
                        <>
                          <div className="flex items-center justify-between text-warning">
                            <span className="text-sm">{isEn ? "Proposed Price" : "建議價格"}</span>
                            <span className="font-semibold">HK${detailDoctor.pricing.videoPending}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={() => {
                              handlePricingAction(detailDoctor.id, "video", "approve");
                              setDetailDoctor(prev => prev ? {
                                ...prev,
                                pricing: { ...prev.pricing, video: prev.pricing.videoPending!, videoPending: undefined, videoStatus: "approved" }
                              } : null);
                            }}>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Approve" : "批准"}
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                              handlePricingAction(detailDoctor.id, "video", "reject");
                              setDetailDoctor(prev => prev ? {
                                ...prev,
                                pricing: { ...prev.pricing, videoPending: undefined, videoStatus: "rejected" }
                              } : null);
                            }}>
                              <XCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Reject" : "拒絕"}
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/50">
                    <Clock className="h-3.5 w-3.5 inline mr-1" />
                    {isEn ? "Doctors can propose pricing changes. Institution approval is required before changes take effect." : "醫生可以提議定價變更，需機構批准後才能生效。"}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => openEdit(detailDoctor)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> {isEn ? "Edit Doctor" : "編輯醫生"}
                </Button>
                <Button variant="ghost" onClick={() => setDetailDoctor(null)}>{isEn ? "Close" : "關閉"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionDoctorsPage;
