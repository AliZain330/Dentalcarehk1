import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInstitution } from "../context/InstitutionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";
import { Pencil, Save, X, Clock, Phone, MapPin, Bus, ImagePlus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface InstitutionPhoto {
  id: string;
  label: string;
  labelZh: string;
  uploaded: boolean;
}

const InstitutionInfoPage: React.FC = () => {
  const { language } = useLanguage();
  const { profile, updateProfile } = useInstitution();
  const isEn = language === "en";

  // Info editing
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    introduction: profile.introduction || (isEn ? "A modern dental clinic in Hong Kong providing comprehensive dental care services." : "一家位於香港的現代牙科診所，提供全面的牙科護理服務。"),
    businessHours: profile.businessHours || (isEn ? "Mon-Fri 9:00-18:00, Sat 9:00-13:00" : "週一至週五 9:00-18:00，週六 9:00-13:00"),
    contactPhone: profile.contactPhone || "+852 2345 6789",
    transport: profile.transport || (isEn ? "MTR Tsim Sha Tsui Station Exit B2, 5 min walk" : "港鐵尖沙咀站B2出口，步行5分鐘"),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState(profile.address || (isEn ? "Room 1201, 12/F, Medical Tower, 18 Nathan Road, Tsim Sha Tsui, Kowloon" : "九龍尖沙咀彌敦道18號醫療大廈12樓1201室"));

  // Photos
  const [photos, setPhotos] = useState<InstitutionPhoto[]>([
    { id: "1", label: "Storefront", labelZh: "門面", uploaded: true },
    { id: "2", label: "Reception", labelZh: "接待區", uploaded: true },
    { id: "3", label: "Treatment Room", labelZh: "診療室", uploaded: true },
    { id: "4", label: "Equipment", labelZh: "設備", uploaded: false },
    { id: "5", label: "Waiting Area", labelZh: "候診區", uploaded: false },
  ]);

  const handleSaveInfo = () => {
    const newErrors: Record<string, string> = {};
    if (!form.introduction.trim()) newErrors.introduction = isEn ? "Required" : "必填";
    if (!form.businessHours.trim()) newErrors.businessHours = isEn ? "Required" : "必填";
    if (!form.contactPhone.trim()) newErrors.contactPhone = isEn ? "Required" : "必填";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    updateProfile(form);
    setEditing(false);
    toast({ title: isEn ? "Information saved" : "資訊已儲存" });
  };

  const handleSaveAddress = () => {
    if (!address.trim()) { toast({ title: isEn ? "Address is required" : "地址必填", variant: "destructive" }); return; }
    updateProfile({ address });
    setEditingAddress(false);
    toast({ title: isEn ? "Address saved" : "地址已儲存" });
  };

  const handlePhotoAction = (id: string, action: "upload" | "remove") => {
    if (action === "upload") {
      toast({ title: isEn ? "API key not added yet" : "尚未添加API密鑰", description: isEn ? "File upload requires backend integration" : "文件上傳需要後端整合" });
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, uploaded: true } : p));
    } else {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, uploaded: false } : p));
      toast({ title: isEn ? "Photo removed" : "照片已移除" });
    }
  };

  const movePhoto = (index: number, dir: "up" | "down") => {
    const newPhotos = [...photos];
    const swapIdx = dir === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newPhotos.length) return;
    [newPhotos[index], newPhotos[swapIdx]] = [newPhotos[swapIdx], newPhotos[index]];
    setPhotos(newPhotos);
  };

  const addPhoto = () => {
    const id = String(Date.now());
    setPhotos(prev => [...prev, { id, label: `Photo ${prev.length + 1}`, labelZh: `照片 ${prev.length + 1}`, uploaded: false }]);
  };

  const removePhotoSlot = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const infoFields = [
    { key: "introduction", label: isEn ? "Institution Introduction" : "機構簡介", icon: null, multiline: true },
    { key: "businessHours", label: isEn ? "Business Hours" : "營業時間", icon: Clock, multiline: false },
    { key: "contactPhone", label: isEn ? "Contact Phone" : "聯絡電話", icon: Phone, multiline: false },
    { key: "transport", label: isEn ? "Transportation Guidance" : "交通指引", icon: Bus, multiline: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Institution Information" : "機構資訊"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{isEn ? "Manage your institution's public profile" : "管理您的機構公開資料"}</p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{isEn ? "Basic Information" : "基本資訊"}</CardTitle>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4 mr-1" /> {isEn ? "Edit" : "編輯"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setErrors({}); }}>
                <X className="h-4 w-4 mr-1" /> {isEn ? "Cancel" : "取消"}
              </Button>
              <Button size="sm" onClick={handleSaveInfo}>
                <Save className="h-4 w-4 mr-1" /> {isEn ? "Save" : "儲存"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          {infoFields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <Label className="flex items-center gap-2 text-sm font-medium">
                {f.icon && <f.icon className="h-4 w-4 text-muted-foreground" />}
                {f.label}
              </Label>
              {editing ? (
                <>
                  {f.multiline ? (
                    <Textarea
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      rows={3}
                      className={errors[f.key] ? "border-destructive" : ""}
                    />
                  ) : (
                    <Input
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className={errors[f.key] ? "border-destructive" : ""}
                    />
                  )}
                  {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
                </>
              ) : (
                <p className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2">{(form as any)[f.key] || <span className="text-muted-foreground italic">{isEn ? "Not set" : "未設定"}</span>}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            {isEn ? "Address" : "地址"}
          </CardTitle>
          {!editingAddress ? (
            <Button variant="outline" size="sm" onClick={() => setEditingAddress(true)}>
              <Pencil className="h-4 w-4 mr-1" /> {isEn ? "Edit" : "編輯"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingAddress(false)}>
                <X className="h-4 w-4 mr-1" /> {isEn ? "Cancel" : "取消"}
              </Button>
              <Button size="sm" onClick={handleSaveAddress}>
                <Save className="h-4 w-4 mr-1" /> {isEn ? "Save" : "儲存"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingAddress ? (
            <Textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} />
          ) : (
            <p className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2">{address}</p>
          )}
          <div className="rounded-lg border border-dashed border-border bg-muted/30 h-48 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">{isEn ? "Map Location Calibration" : "地圖定位校準"}</p>
              <p className="text-xs mt-1">{isEn ? "API key not added yet" : "尚未添加API密鑰"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{isEn ? "Photo Management" : "照片管理"}</CardTitle>
          <Button variant="outline" size="sm" onClick={addPhoto}>
            <ImagePlus className="h-4 w-4 mr-1" /> {isEn ? "Add Slot" : "新增"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {photos.map((photo, idx) => (
              <div key={photo.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <div className="flex flex-col gap-1">
                  <button onClick={() => movePhoto(idx, "up")} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => movePhoto(idx, "down")} disabled={idx === photos.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className={`h-16 w-24 rounded-md flex items-center justify-center text-xs ${photo.uploaded ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground border border-dashed border-border"}`}>
                  {photo.uploaded ? (isEn ? "Uploaded" : "已上傳") : (isEn ? "Empty" : "空")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{isEn ? photo.label : photo.labelZh}</p>
                  <Badge variant={photo.uploaded ? "default" : "secondary"} className="mt-1 text-xs">
                    {photo.uploaded ? (isEn ? "Active" : "已啟用") : (isEn ? "Pending" : "待上傳")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {!photo.uploaded ? (
                    <Button variant="outline" size="sm" onClick={() => handlePhotoAction(photo.id, "upload")}>
                      {isEn ? "Upload" : "上傳"}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handlePhotoAction(photo.id, "remove")}>
                      {isEn ? "Replace" : "替換"}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removePhotoSlot(photo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <ApiPlaceholderNotice service={isEn ? "Image Upload" : "圖片上傳"} variant="inline" />
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionInfoPage;
