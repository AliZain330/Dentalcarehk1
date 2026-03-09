import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Upload } from "lucide-react";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { basicSystemSettings, type BasicSystemSettings } from "@/admin/data/adminSystemSettingsData";
import SettingsStatusBadge from "@/admin/components/settings/SettingsStatusBadge";
import SystemSettingsNav from "@/admin/components/settings/SystemSettingsNav";
import { persistAdminSystemSettings, useAdminSystemSettings } from "@/admin/hooks/useAdminSystemSettings";
import { toast } from "sonner";

const AdminSystemBasicSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const loaded = useAdminSystemSettings();
  const [form, setForm] = useState<BasicSystemSettings>(loaded || basicSystemSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(form.updatedAt);

  const updateField = <K extends keyof BasicSystemSettings>(field: K, value: BasicSystemSettings[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.platformName.trim()) {
      toast.error(isEn ? "Platform name is required" : "平台名稱為必填");
      return false;
    }
    if (form.serviceFeeRate < 0 || form.serviceFeeRate > 100) {
      toast.error(isEn ? "Service fee rate must be between 0 and 100" : "服務費率需介於 0 至 100");
      return false;
    }
    if (form.appointmentPenaltyRate < 0 || form.appointmentPenaltyRate > 100) {
      toast.error(isEn ? "Penalty rate must be between 0 and 100" : "罰款比率需介於 0 至 100");
      return false;
    }
    return true;
  };

  const saveSettings = () => {
    if (!validate()) return;
    setIsSaving(true);
    setTimeout(() => {
      const now = new Date().toLocaleString("en-GB", { hour12: false });
      const next = { ...form, updatedAt: now };
      setForm(next);
      persistAdminSystemSettings(next);
      setLastUpdated(now);
      setIsSaving(false);
      toast.success(isEn ? "Basic settings updated" : "基本設定已更新");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "System Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEn ? "Configure platform-wide operational settings" : "配置平台層級的營運設定"}
        </p>
      </div>

      <SystemSettingsNav />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEn ? "Basic Settings" : "基本設定"}</CardTitle>
          <div className="flex items-center gap-2">
            <SettingsStatusBadge status="updated" />
            <span className="text-xs text-muted-foreground">{lastUpdated}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isEn ? "Platform Name" : "平台名稱"}</Label>
              <Input
                value={form.platformName}
                onChange={(event) => updateField("platformName", event.target.value)}
                placeholder={isEn ? "Enter platform name" : "請輸入平台名稱"}
              />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Platform Service Fee Rate (%)" : "平台服務費率 (%)"}</Label>
              <Input
                type="number"
                value={form.serviceFeeRate}
                onChange={(event) => updateField("serviceFeeRate", Number(event.target.value))}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>{isEn ? "Platform Logo" : "平台標誌"}</Label>
            <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-md border border-border bg-muted">
                  <img src={form.logoUrl} alt="logo" className="h-full w-full object-contain" />
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.info(isEn ? "API key not added yet" : "API 金鑰尚未添加")
                  }
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isEn ? "Upload Logo" : "上傳標誌"}
                </Button>
              </div>
              <ApiPlaceholderNotice service={isEn ? "Logo Upload" : "標誌上傳"} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{isEn ? "Appointment Cancellation Window (hours)" : "可取消預約時限（小時）"}</Label>
              <Input
                type="number"
                value={form.appointmentCancellationHours}
                onChange={(event) => updateField("appointmentCancellationHours", Number(event.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Appointment Cancellation Penalty Rate (%)" : "預約取消罰款比率 (%)"}</Label>
              <Input
                type="number"
                value={form.appointmentPenaltyRate}
                onChange={(event) => updateField("appointmentPenaltyRate", Number(event.target.value))}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{isEn ? "Consultation Text Message Count" : "問診文字訊息數量"}</Label>
              <Input
                type="number"
                value={form.consultationTextMessageCount}
                onChange={(event) => updateField("consultationTextMessageCount", Number(event.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Consultation Time Window (minutes)" : "問診時限（分鐘）"}</Label>
              <Input
                type="number"
                value={form.consultationTimeWindowMinutes}
                onChange={(event) => updateField("consultationTimeWindowMinutes", Number(event.target.value))}
                min={5}
              />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Video Duration (minutes)" : "視像時長（分鐘）"}</Label>
              <Input
                type="number"
                value={form.consultationVideoDurationMinutes}
                onChange={(event) => updateField("consultationVideoDurationMinutes", Number(event.target.value))}
                min={5}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? (isEn ? "Saving..." : "儲存中...") : (isEn ? "Save Settings" : "儲存設定")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemBasicSettingsPage;
