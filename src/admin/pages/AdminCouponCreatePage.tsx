import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminCouponCreatePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", nameZh: "",
    type: "fixed" as "fixed" | "percentage",
    amount: "",
    minSpend: "",
    applicableTo: "all" as "all" | "in_clinic" | "consultation",
    validFrom: "", validTo: "",
    maxPerUser: "1",
    distribution: "manual" as "auto_new_user" | "manual" | "campaign",
  });

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.amount || !form.validFrom || !form.validTo) {
      toast({ title: isEn ? "Please fill in all required fields" : "請填寫所有必填項", variant: "destructive" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: isEn ? "Coupon Created (Mock)" : "優惠券已創建（模擬）" });
      navigate("/admin/marketing");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/marketing")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Create Platform Coupon" : "創建平台優惠券"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Set up a new coupon with rules and distribution" : "設定新優惠券規則及發放方式"}</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Coupon Details" : "優惠券詳情"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEn ? "Coupon Name (EN)" : "優惠券名稱（英）"} *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. New User Welcome" />
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Coupon Name (ZH)" : "優惠券名稱（中）"}</Label>
              <Input value={form.nameZh} onChange={(e) => set("nameZh", e.target.value)} placeholder="例：新用戶迎新券" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEn ? "Coupon Type" : "優惠類型"}</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">{isEn ? "Fixed Amount (HK$)" : "固定金額 (HK$)"}</SelectItem>
                  <SelectItem value="percentage">{isEn ? "Percentage (%)" : "百分比 (%)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{form.type === "fixed" ? (isEn ? "Amount (HK$)" : "面額 (HK$)") : (isEn ? "Discount (%)" : "折扣 (%)")} *</Label>
              <Input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder={form.type === "fixed" ? "50" : "15"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEn ? "Minimum Spend (HK$)" : "最低消費 (HK$)"}</Label>
              <Input type="number" value={form.minSpend} onChange={(e) => set("minSpend", e.target.value)} placeholder="200" />
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Max Per User" : "每人限領"}</Label>
              <Input type="number" value={form.maxPerUser} onChange={(e) => set("maxPerUser", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEn ? "Applicable To" : "適用範圍"}</Label>
              <Select value={form.applicableTo} onValueChange={(v) => set("applicableTo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isEn ? "All Services" : "所有服務"}</SelectItem>
                  <SelectItem value="in_clinic">{isEn ? "In-Clinic Only" : "僅門診"}</SelectItem>
                  <SelectItem value="consultation">{isEn ? "Consultation Only" : "僅線上問診"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Distribution" : "發放方式"}</Label>
              <Select value={form.distribution} onValueChange={(v) => set("distribution", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto_new_user">{isEn ? "Auto: New User" : "自動：新用戶"}</SelectItem>
                  <SelectItem value="manual">{isEn ? "Manual" : "手動發放"}</SelectItem>
                  <SelectItem value="campaign">{isEn ? "Campaign" : "活動發放"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{isEn ? "Valid From" : "有效起始日"} *</Label>
              <Input type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Valid To" : "有效截止日"} *</Label>
              <Input type="date" value={form.validTo} onChange={(e) => set("validTo", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/admin/marketing")}>{isEn ? "Cancel" : "取消"}</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          {saving ? (isEn ? "Creating..." : "創建中...") : (isEn ? "Create Coupon" : "創建優惠券")}
        </Button>
      </div>
    </div>
  );
};

export default AdminCouponCreatePage;
