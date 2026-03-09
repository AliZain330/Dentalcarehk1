import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";

const specialtyOptions = [
  { en: "General Dentistry", zh: "一般牙科" },
  { en: "Orthodontics", zh: "矯齒科" },
  { en: "Oral Surgery", zh: "口腔外科" },
  { en: "Periodontics", zh: "牙周病科" },
  { en: "Prosthodontics", zh: "修復齒科" },
  { en: "Endodontics", zh: "牙髓治療科" },
  { en: "Pediatric Dentistry", zh: "兒童齒科" },
  { en: "Cosmetic Dentistry", zh: "美容牙科" },
];

const DoctorPersonalInfoPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";
  const lang = isEn ? "en" : "zh";

  const [editing, setEditing] = useState(false);
  const [showUploadNotice, setShowUploadNotice] = useState(false);
  const [form, setForm] = useState({
    nameEn: "Chen Wei",
    nameZh: "陳偉",
    titleEn: "Dr.",
    titleZh: "醫生",
    phone: "+852 9123 4567",
    email: "dr.chenwei@example.com",
    bioEn: "Over 8 years of experience in general and cosmetic dentistry. Specializes in dental implants and smile design.",
    bioZh: "超過8年一般牙科及美容牙科經驗，專注牙齒種植及笑容設計。",
    licenseNo: "DC-2018-00456",
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([0, 7]);

  const toggleSpecialty = (idx: number) => {
    setSelectedSpecialties((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const handleSave = () => {
    if (!form.nameEn.trim() || !form.nameZh.trim()) {
      toast({ title: isEn ? "Name is required" : "姓名為必填", variant: "destructive" });
      return;
    }
    if (selectedSpecialties.length === 0) {
      toast({ title: isEn ? "Select at least one specialty" : "請選擇至少一個專科", variant: "destructive" });
      return;
    }
    setEditing(false);
    toast({ title: isEn ? "Profile updated" : "資料已更新" });
  };

  return (
    <div className="animate-fade-in pb-24">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="flex-1 text-lg font-bold text-foreground">{isEn ? "Personal Information" : "個人資訊"}</h1>
          {!editing && <Button size="sm" variant="outline" onClick={() => setEditing(true)}>{isEn ? "Edit" : "編輯"}</Button>}
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">{isEn ? "CW" : "陳"}</span>
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-sm" onClick={() => setShowUploadNotice(true)}>
                <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Basic info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">{isEn ? "BASIC INFORMATION" : "基本資料"}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">{isEn ? "Name (EN)" : "姓名（英文）"}</label>
                {editing ? <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="mt-1" /> : <p className="mt-1 text-sm font-medium text-foreground">{form.nameEn}</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{isEn ? "Name (ZH)" : "姓名（中文）"}</label>
                {editing ? <Input value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} className="mt-1" /> : <p className="mt-1 text-sm font-medium text-foreground">{form.nameZh}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{isEn ? "Phone" : "電話"}</label>
              {editing ? <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /> : <p className="mt-1 text-sm font-medium text-foreground">{form.phone}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{isEn ? "Email" : "電郵"}</label>
              {editing ? <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /> : <p className="mt-1 text-sm font-medium text-foreground">{form.email}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{isEn ? "License No." : "執照號碼"}</label>
              <p className="mt-1 text-sm font-medium text-foreground">{form.licenseNo}</p>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">{isEn ? "SPECIALTIES" : "專科"}</p>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((s, i) => (
                <Badge
                  key={i}
                  variant={selectedSpecialties.includes(i) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${editing ? "hover:opacity-80" : ""} ${selectedSpecialties.includes(i) ? "" : ""}`}
                  onClick={() => editing && toggleSpecialty(i)}
                >
                  {s[lang]}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground">{isEn ? "BIOGRAPHY" : "個人簡介"}</p>
            <div>
              <label className="text-xs text-muted-foreground">English</label>
              {editing ? <Textarea value={form.bioEn} onChange={(e) => setForm({ ...form, bioEn: e.target.value })} className="mt-1 min-h-[60px]" /> : <p className="mt-1 text-sm text-foreground">{form.bioEn}</p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">繁體中文</label>
              {editing ? <Textarea value={form.bioZh} onChange={(e) => setForm({ ...form, bioZh: e.target.value })} className="mt-1 min-h-[60px]" /> : <p className="mt-1 text-sm text-foreground">{form.bioZh}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save bar */}
      {editing && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
          <div className="mx-auto max-w-lg flex gap-2 px-4 py-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button className="flex-1" onClick={handleSave}><Save className="mr-1.5 h-4 w-4" />{isEn ? "Save" : "儲存"}</Button>
          </div>
        </div>
      )}

      {/* Upload notice */}
      {showUploadNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowUploadNotice(false)}>
          <Card className="max-w-sm" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <ApiPlaceholderNotice service={isEn ? "Avatar Upload" : "頭像上傳"} />
              <Button className="mt-4 w-full" variant="outline" onClick={() => setShowUploadNotice(false)}>{isEn ? "Close" : "關閉"}</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorPersonalInfoPage;
