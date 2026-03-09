import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import { mockPlatformCoupons, mockInstitutionCoupons } from "../data/adminMarketingData";

const AdminCouponDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const coupon = [...mockPlatformCoupons, ...mockInstitutionCoupons].find((c) => c.id === id);

  if (!coupon) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Ticket className="h-10 w-10 mb-3" />
        <p>{isEn ? "Coupon not found" : "未找到優惠券"}</p>
        <Button variant="link" onClick={() => navigate("/admin/marketing")}>{isEn ? "Back" : "返回"}</Button>
      </div>
    );
  }

  const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    active: { variant: "default", label: isEn ? "Active" : "進行中" },
    draft: { variant: "outline", label: isEn ? "Draft" : "草稿" },
    disabled: { variant: "destructive", label: isEn ? "Disabled" : "已停用" },
    expired: { variant: "secondary", label: isEn ? "Expired" : "已過期" },
  };

  const s = statusMap[coupon.status];
  const usageRate = coupon.totalIssued > 0 ? ((coupon.totalUsed / coupon.totalIssued) * 100).toFixed(1) : "0";

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/marketing")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEn ? coupon.name : coupon.nameZh}</h1>
          <p className="text-sm text-muted-foreground">{coupon.id}</p>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Coupon Information" : "優惠券資訊"}</CardTitle></CardHeader>
        <CardContent>
          <Row label={isEn ? "Type" : "類型"} value={coupon.type === "fixed" ? (isEn ? "Fixed Amount" : "固定金額") : (isEn ? "Percentage" : "百分比")} />
          <Row label={isEn ? "Value" : "面額"} value={coupon.type === "fixed" ? `HK$${coupon.amount}` : `${coupon.amount}%`} />
          <Row label={isEn ? "Min Spend" : "最低消費"} value={`HK$${coupon.minSpend}`} />
          <Row label={isEn ? "Max Per User" : "每人限領"} value={coupon.maxPerUser} />
          <Row label={isEn ? "Applicable To" : "適用範圍"} value={coupon.applicableTo === "all" ? (isEn ? "All" : "全部") : coupon.applicableTo === "in_clinic" ? (isEn ? "In-Clinic" : "門診") : (isEn ? "Consultation" : "線上問診")} />
          <Row label={isEn ? "Source" : "來源"} value={coupon.source === "platform" ? (isEn ? "Platform" : "平台") : coupon.institutionName || (isEn ? "Institution" : "機構")} />
          <Row label={isEn ? "Distribution" : "發放方式"} value={coupon.distribution === "auto_new_user" ? (isEn ? "Auto: New User" : "自動：新用戶") : coupon.distribution === "campaign" ? (isEn ? "Campaign" : "活動") : (isEn ? "Manual" : "手動")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Usage Statistics" : "使用統計"}</CardTitle></CardHeader>
        <CardContent>
          <Row label={isEn ? "Validity Period" : "有效期"} value={`${coupon.validFrom} ~ ${coupon.validTo}`} />
          <Row label={isEn ? "Total Issued" : "已發數量"} value={coupon.totalIssued.toLocaleString()} />
          <Row label={isEn ? "Total Used" : "已用數量"} value={coupon.totalUsed.toLocaleString()} />
          <Row label={isEn ? "Usage Rate" : "使用率"} value={`${usageRate}%`} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCouponDetailPage;
