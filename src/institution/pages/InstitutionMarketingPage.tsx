import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus, Search, Eye, Ticket, TrendingUp, Users, Percent, DollarSign,
  Calendar, QrCode, Send, CheckCircle, XCircle, Clock, Target, Megaphone,
  BarChart3, MousePointerClick, ShoppingCart, Image, Tag,
} from "lucide-react";

type CouponType = "threshold" | "percentage";
type CouponStatus = "draft" | "active" | "expired" | "depleted";
type DistributionMethod = "manual" | "batch" | "qr";

interface Coupon {
  id: string;
  name: string;
  nameZh: string;
  code: string;
  type: CouponType;
  discount: number; // amount for threshold, percentage for percentage type
  threshold?: number; // minimum order amount for threshold type
  quantity: number;
  used: number;
  validFrom: string;
  validUntil: string;
  status: CouponStatus;
  applicableServices: string[];
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  type: "banner" | "recommendation" | "promotion";
  enrolled: boolean;
  startDate: string;
  endDate: string;
  stats?: {
    impressions: number;
    clicks: number;
    conversions: number;
    orders: number;
  };
}

const mockCoupons: Coupon[] = [
  { id: "c1", name: "New Patient Discount", nameZh: "新患者折扣", code: "NEW50", type: "threshold", discount: 50, threshold: 200, quantity: 100, used: 35, validFrom: "2024-03-01", validUntil: "2024-06-30", status: "active", applicableServices: ["all"], createdAt: "2024-02-25" },
  { id: "c2", name: "Teeth Whitening 20% Off", nameZh: "牙齒美白8折", code: "WHITE20", type: "percentage", discount: 20, quantity: 50, used: 45, validFrom: "2024-03-01", validUntil: "2024-03-31", status: "active", applicableServices: ["s2"], createdAt: "2024-02-20" },
  { id: "c3", name: "Spring Festival Special", nameZh: "春節特惠", code: "SPRING100", type: "threshold", discount: 100, threshold: 500, quantity: 200, used: 180, validFrom: "2024-02-01", validUntil: "2024-02-28", status: "expired", applicableServices: ["all"], createdAt: "2024-01-25" },
  { id: "c4", name: "Orthodontics 15% Off", nameZh: "矯齒85折", code: "ORTHO15", type: "percentage", discount: 15, quantity: 30, used: 30, validFrom: "2024-03-01", validUntil: "2024-12-31", status: "depleted", applicableServices: ["s4"], createdAt: "2024-02-28" },
  { id: "c5", name: "VIP Member Exclusive", nameZh: "VIP會員專享", code: "VIP200", type: "threshold", discount: 200, threshold: 1000, quantity: 50, used: 0, validFrom: "2024-04-01", validUntil: "2024-12-31", status: "draft", applicableServices: ["all"], createdAt: "2024-03-05" },
];

const mockCampaigns: Campaign[] = [
  { id: "camp1", name: "Homepage Banner Promotion", nameZh: "首頁橫幅推廣", description: "Feature your institution on the app homepage banner", descriptionZh: "在應用程式首頁橫幅展示您的機構", type: "banner", enrolled: true, startDate: "2024-03-01", endDate: "2024-03-31", stats: { impressions: 15420, clicks: 892, conversions: 124, orders: 78 } },
  { id: "camp2", name: "Popular Services Spotlight", nameZh: "熱門服務推薦", description: "Highlight your top services in recommendation section", descriptionZh: "在推薦區突出您的熱門服務", type: "recommendation", enrolled: true, startDate: "2024-03-01", endDate: "2024-03-31", stats: { impressions: 8750, clicks: 425, conversions: 68, orders: 42 } },
  { id: "camp3", name: "Weekend Flash Sale", nameZh: "週末限時優惠", description: "Weekend-only promotion with special discounts", descriptionZh: "僅限週末的特價優惠", type: "promotion", enrolled: false, startDate: "2024-03-16", endDate: "2024-03-17" },
  { id: "camp4", name: "New Patient Welcome", nameZh: "新患者歡迎", description: "Attract first-time patients with exclusive offers", descriptionZh: "以專屬優惠吸引首次患者", type: "banner", enrolled: false, startDate: "2024-03-20", endDate: "2024-04-20" },
];

const serviceOptions = [
  { id: "all", name: "All Services", nameZh: "全部服務" },
  { id: "s1", name: "Teeth Cleaning", nameZh: "洗牙" },
  { id: "s2", name: "Teeth Whitening", nameZh: "牙齒美白" },
  { id: "s3", name: "Dental Check-up", nameZh: "牙齒檢查" },
  { id: "s4", name: "Orthodontics", nameZh: "矯齒諮詢" },
];

const InstitutionMarketingPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [mainTab, setMainTab] = useState<"coupons" | "campaigns">("coupons");
  const [coupons, setCoupons] = useState(mockCoupons);
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  // Coupon filters
  const [couponSearch, setCouponSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CouponStatus>("all");

  // Dialogs
  const [createCouponOpen, setCreateCouponOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [detailCoupon, setDetailCoupon] = useState<Coupon | null>(null);
  const [distributeCoupon, setDistributeCoupon] = useState<Coupon | null>(null);
  const [enrollCampaign, setEnrollCampaign] = useState<Campaign | null>(null);

  // Coupon form
  const emptyCouponForm = {
    name: "", nameZh: "", code: "", type: "threshold" as CouponType,
    discount: 0, threshold: 0, quantity: 100,
    validFrom: "", validUntil: "",
    applicableServices: ["all"] as string[],
  };
  const [couponForm, setCouponForm] = useState(emptyCouponForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Distribution form
  const [distMethod, setDistMethod] = useState<DistributionMethod>("manual");
  const [distUsers, setDistUsers] = useState("");

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    let list = coupons;
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    if (couponSearch.trim()) {
      const q = couponSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.nameZh.includes(q) || c.code.toLowerCase().includes(q));
    }
    return list;
  }, [coupons, statusFilter, couponSearch]);

  // Stats
  const couponStats = useMemo(() => ({
    total: coupons.length,
    active: coupons.filter(c => c.status === "active").length,
    totalIssued: coupons.reduce((sum, c) => sum + c.quantity, 0),
    totalUsed: coupons.reduce((sum, c) => sum + c.used, 0),
    redemptionRate: coupons.reduce((sum, c) => sum + c.quantity, 0) > 0
      ? Math.round((coupons.reduce((sum, c) => sum + c.used, 0) / coupons.reduce((sum, c) => sum + c.quantity, 0)) * 100)
      : 0,
  }), [coupons]);

  const campaignStats = useMemo(() => ({
    enrolled: campaigns.filter(c => c.enrolled).length,
    totalImpressions: campaigns.filter(c => c.enrolled && c.stats).reduce((sum, c) => sum + (c.stats?.impressions || 0), 0),
    totalClicks: campaigns.filter(c => c.enrolled && c.stats).reduce((sum, c) => sum + (c.stats?.clicks || 0), 0),
    totalOrders: campaigns.filter(c => c.enrolled && c.stats).reduce((sum, c) => sum + (c.stats?.orders || 0), 0),
  }), [campaigns]);

  // Status helpers
  const statusConfig: Record<CouponStatus, { label: string; labelZh: string; color: string }> = {
    draft: { label: "Draft", labelZh: "草稿", color: "bg-muted text-muted-foreground" },
    active: { label: "Active", labelZh: "活躍", color: "bg-success/10 text-success border-success/30" },
    expired: { label: "Expired", labelZh: "已過期", color: "bg-destructive/10 text-destructive border-destructive/30" },
    depleted: { label: "Depleted", labelZh: "已用盡", color: "bg-warning/10 text-warning border-warning/30" },
  };

  const StatusBadge = ({ status }: { status: CouponStatus }) => {
    const c = statusConfig[status];
    return <Badge variant="outline" className={c.color}>{isEn ? c.label : c.labelZh}</Badge>;
  };

  // Actions
  const openCreateCoupon = () => {
    setEditingCoupon(null);
    setCouponForm(emptyCouponForm);
    setFormErrors({});
    setCreateCouponOpen(true);
  };

  const openEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      name: coupon.name, nameZh: coupon.nameZh, code: coupon.code, type: coupon.type,
      discount: coupon.discount, threshold: coupon.threshold || 0, quantity: coupon.quantity,
      validFrom: coupon.validFrom, validUntil: coupon.validUntil,
      applicableServices: coupon.applicableServices,
    });
    setFormErrors({});
    setCreateCouponOpen(true);
  };

  const validateCouponForm = () => {
    const e: Record<string, string> = {};
    if (!couponForm.name.trim()) e.name = isEn ? "Required" : "必填";
    if (!couponForm.nameZh.trim()) e.nameZh = isEn ? "Required" : "必填";
    if (!couponForm.code.trim()) e.code = isEn ? "Required" : "必填";
    if (couponForm.discount <= 0) e.discount = isEn ? "Must be > 0" : "必須大於0";
    if (couponForm.type === "threshold" && couponForm.threshold <= 0) e.threshold = isEn ? "Must be > 0" : "必須大於0";
    if (couponForm.quantity <= 0) e.quantity = isEn ? "Must be > 0" : "必須大於0";
    if (!couponForm.validFrom) e.validFrom = isEn ? "Required" : "必填";
    if (!couponForm.validUntil) e.validUntil = isEn ? "Required" : "必填";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveCoupon = () => {
    if (!validateCouponForm()) return;
    const now = new Date();
    const validFrom = new Date(couponForm.validFrom);
    const validUntil = new Date(couponForm.validUntil);
    let status: CouponStatus = "draft";
    if (now >= validFrom && now <= validUntil) status = "active";
    else if (now > validUntil) status = "expired";

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? {
        ...c, ...couponForm, status,
      } : c));
      toast({ title: isEn ? "Coupon updated" : "優惠券已更新" });
    } else {
      const newCoupon: Coupon = {
        id: `c${Date.now()}`, ...couponForm, status, used: 0, createdAt: new Date().toISOString().split("T")[0],
      };
      setCoupons(prev => [...prev, newCoupon]);
      toast({ title: isEn ? "Coupon created" : "優惠券已創建" });
    }
    setCreateCouponOpen(false);
  };

  const handleDistribute = () => {
    if (!distributeCoupon) return;
    if (distMethod === "manual" && !distUsers.trim()) {
      toast({ title: isEn ? "Please specify users" : "請指定用戶", variant: "destructive" });
      return;
    }
    toast({
      title: distMethod === "qr" ? (isEn ? "API key not added yet" : "尚未添加API密鑰") : (isEn ? "Distributed successfully" : "已成功分發"),
      description: distMethod === "qr" ? (isEn ? "QR code generation requires backend integration" : "QR碼生成需要後端整合") : undefined,
    });
    setDistributeCoupon(null);
    setDistUsers("");
    setDistMethod("manual");
  };

  const handleEnrollCampaign = () => {
    if (!enrollCampaign) return;
    setCampaigns(prev => prev.map(c => c.id === enrollCampaign.id ? { ...c, enrolled: true, stats: { impressions: 0, clicks: 0, conversions: 0, orders: 0 } } : c));
    toast({ title: isEn ? "Enrolled in campaign" : "已加入活動" });
    setEnrollCampaign(null);
  };

  const handleWithdrawCampaign = (campId: string) => {
    setCampaigns(prev => prev.map(c => c.id === campId ? { ...c, enrolled: false, stats: undefined } : c));
    toast({ title: isEn ? "Withdrawn from campaign" : "已退出活動" });
  };

  const toggleServiceSelection = (serviceId: string) => {
    if (serviceId === "all") {
      setCouponForm(prev => ({ ...prev, applicableServices: ["all"] }));
    } else {
      setCouponForm(prev => {
        const current = prev.applicableServices.filter(s => s !== "all");
        if (current.includes(serviceId)) {
          return { ...prev, applicableServices: current.filter(s => s !== serviceId) };
        } else {
          return { ...prev, applicableServices: [...current, serviceId] };
        }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Marketing Management" : "營銷管理"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{isEn ? "Manage coupons and marketing campaigns" : "管理優惠券及營銷活動"}</p>
      </div>

      <Tabs value={mainTab} onValueChange={v => setMainTab(v as any)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="coupons" className="flex items-center gap-1.5">
            <Ticket className="h-4 w-4" /> {isEn ? "Coupons" : "優惠券"}
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-1.5">
            <Megaphone className="h-4 w-4" /> {isEn ? "Campaigns" : "營銷活動"}
          </TabsTrigger>
        </TabsList>

        {/* Coupons Tab */}
        <TabsContent value="coupons" className="mt-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: isEn ? "Total Coupons" : "總優惠券", value: couponStats.total, icon: Ticket, color: "text-primary" },
              { label: isEn ? "Active" : "活躍", value: couponStats.active, icon: CheckCircle, color: "text-success" },
              { label: isEn ? "Issued" : "已發行", value: couponStats.totalIssued, icon: Send, color: "text-info" },
              { label: isEn ? "Used" : "已使用", value: couponStats.totalUsed, icon: ShoppingCart, color: "text-warning" },
              { label: isEn ? "Redemption Rate" : "兌換率", value: `${couponStats.redemptionRate}%`, icon: TrendingUp, color: "text-success" },
            ].map((s, i) => (
              <Card key={i}><CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
                <div><p className="text-xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent></Card>
            ))}
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search coupons..." : "搜尋優惠券..."} value={couponSearch} onChange={e => setCouponSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
                <SelectItem value="draft">{isEn ? "Draft" : "草稿"}</SelectItem>
                <SelectItem value="active">{isEn ? "Active" : "活躍"}</SelectItem>
                <SelectItem value="expired">{isEn ? "Expired" : "已過期"}</SelectItem>
                <SelectItem value="depleted">{isEn ? "Depleted" : "已用盡"}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreateCoupon}><Plus className="h-4 w-4 mr-1" /> {isEn ? "Create Coupon" : "創建優惠券"}</Button>
          </div>

          {/* Coupon Table */}
          <Card>
            <CardContent className="p-0">
              {filteredCoupons.length === 0 ? (
                <div className="py-16 text-center">
                  <Ticket className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">{isEn ? "No coupons found" : "找不到優惠券"}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isEn ? "Coupon" : "優惠券"}</TableHead>
                      <TableHead className="hidden md:table-cell">{isEn ? "Type" : "類型"}</TableHead>
                      <TableHead className="hidden lg:table-cell">{isEn ? "Validity" : "有效期"}</TableHead>
                      <TableHead>{isEn ? "Usage" : "使用情況"}</TableHead>
                      <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoupons.map(coupon => (
                      <TableRow key={coupon.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{isEn ? coupon.name : coupon.nameZh}</p>
                            <p className="text-xs text-muted-foreground font-mono">{coupon.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {coupon.type === "threshold" ? (
                              <><DollarSign className="h-3 w-3 mr-1" /> {isEn ? `$${coupon.discount} off` : `減${coupon.discount}元`}</>
                            ) : (
                              <><Percent className="h-3 w-3 mr-1" /> {coupon.discount}% {isEn ? "off" : "折扣"}</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{coupon.validFrom} ~ {coupon.validUntil}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-24">
                              <div className="h-full bg-primary" style={{ width: `${Math.min((coupon.used / coupon.quantity) * 100, 100)}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{coupon.used}/{coupon.quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={coupon.status} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailCoupon(coupon)}><Eye className="h-3.5 w-3.5" /></Button>
                            {coupon.status === "active" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDistributeCoupon(coupon)}><Send className="h-3.5 w-3.5" /></Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="mt-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: isEn ? "Enrolled" : "已加入", value: campaignStats.enrolled, icon: Target, color: "text-primary" },
              { label: isEn ? "Impressions" : "曝光量", value: campaignStats.totalImpressions.toLocaleString(), icon: Image, color: "text-info" },
              { label: isEn ? "Clicks" : "點擊數", value: campaignStats.totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-success" },
              { label: isEn ? "Orders" : "訂單數", value: campaignStats.totalOrders, icon: ShoppingCart, color: "text-warning" },
            ].map((s, i) => (
              <Card key={i}><CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
                <div><p className="text-xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent></Card>
            ))}
          </div>

          {/* Campaign List */}
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map(camp => (
              <Card key={camp.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${camp.type === "banner" ? "bg-primary/10" : camp.type === "recommendation" ? "bg-success/10" : "bg-warning/10"}`}>
                          {camp.type === "banner" && <Image className="h-5 w-5 text-primary" />}
                          {camp.type === "recommendation" && <Target className="h-5 w-5 text-success" />}
                          {camp.type === "promotion" && <Tag className="h-5 w-5 text-warning" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{isEn ? camp.name : camp.nameZh}</p>
                          <p className="text-sm text-muted-foreground">{isEn ? camp.description : camp.descriptionZh}</p>
                        </div>
                        {camp.enrolled ? (
                          <Badge variant="default" className="shrink-0">{isEn ? "Enrolled" : "已加入"}</Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">{isEn ? "Available" : "可加入"}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {camp.startDate} ~ {camp.endDate}</div>
                      </div>
                      {camp.enrolled && camp.stats && (
                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                          <div><p className="text-xs text-muted-foreground">{isEn ? "Impressions" : "曝光量"}</p><p className="text-lg font-bold text-foreground">{camp.stats.impressions.toLocaleString()}</p></div>
                          <div><p className="text-xs text-muted-foreground">{isEn ? "Clicks" : "點擊數"}</p><p className="text-lg font-bold text-foreground">{camp.stats.clicks.toLocaleString()}</p></div>
                          <div><p className="text-xs text-muted-foreground">{isEn ? "Conversions" : "轉化數"}</p><p className="text-lg font-bold text-foreground">{camp.stats.conversions}</p></div>
                          <div><p className="text-xs text-muted-foreground">{isEn ? "Orders" : "訂單數"}</p><p className="text-lg font-bold text-foreground">{camp.stats.orders}</p></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {camp.enrolled ? (
                      <Button variant="outline" size="sm" onClick={() => handleWithdrawCampaign(camp.id)}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Withdraw" : "退出"}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setEnrollCampaign(camp)}>
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> {isEn ? "Enroll Now" : "立即加入"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ApiPlaceholderNotice service={isEn ? "Campaign Metrics" : "活動指標"} variant="inline" />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Coupon Dialog */}
      <Dialog open={createCouponOpen} onOpenChange={setCreateCouponOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? (isEn ? "Edit Coupon" : "編輯優惠券") : (isEn ? "Create Coupon" : "創建優惠券")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (EN)" : "名稱（英文）"}</Label>
                <Input value={couponForm.name} onChange={e => setCouponForm(p => ({ ...p, name: e.target.value }))} className={formErrors.name ? "border-destructive" : ""} />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (ZH)" : "名稱（中文）"}</Label>
                <Input value={couponForm.nameZh} onChange={e => setCouponForm(p => ({ ...p, nameZh: e.target.value }))} className={formErrors.nameZh ? "border-destructive" : ""} />
                {formErrors.nameZh && <p className="text-xs text-destructive">{formErrors.nameZh}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Coupon Code" : "優惠券代碼"}</Label>
              <Input value={couponForm.code} onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" className={formErrors.code ? "border-destructive" : ""} />
              {formErrors.code && <p className="text-xs text-destructive">{formErrors.code}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Coupon Type" : "優惠券類型"}</Label>
              <Select value={couponForm.type} onValueChange={v => setCouponForm(p => ({ ...p, type: v as CouponType }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="threshold">{isEn ? "Threshold Discount (e.g., $50 off $200)" : "滿減優惠（例如：滿200減50）"}</SelectItem>
                  <SelectItem value="percentage">{isEn ? "Percentage Discount (e.g., 20% off)" : "折扣優惠（例如：8折）"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{couponForm.type === "threshold" ? (isEn ? "Discount Amount (HKD)" : "折扣金額（港幣）") : (isEn ? "Discount Percentage (%)" : "折扣百分比（%）")}</Label>
                <Input type="number" value={couponForm.discount} onChange={e => setCouponForm(p => ({ ...p, discount: Number(e.target.value) }))} className={formErrors.discount ? "border-destructive" : ""} />
                {formErrors.discount && <p className="text-xs text-destructive">{formErrors.discount}</p>}
              </div>
              {couponForm.type === "threshold" && (
                <div className="space-y-1.5">
                  <Label>{isEn ? "Minimum Order Amount (HKD)" : "最低訂單金額（港幣）"}</Label>
                  <Input type="number" value={couponForm.threshold} onChange={e => setCouponForm(p => ({ ...p, threshold: Number(e.target.value) }))} className={formErrors.threshold ? "border-destructive" : ""} />
                  {formErrors.threshold && <p className="text-xs text-destructive">{formErrors.threshold}</p>}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Quantity Issued" : "發行數量"}</Label>
              <Input type="number" value={couponForm.quantity} onChange={e => setCouponForm(p => ({ ...p, quantity: Number(e.target.value) }))} className={formErrors.quantity ? "border-destructive" : ""} />
              {formErrors.quantity && <p className="text-xs text-destructive">{formErrors.quantity}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Valid From" : "生效日期"}</Label>
                <Input type="date" value={couponForm.validFrom} onChange={e => setCouponForm(p => ({ ...p, validFrom: e.target.value }))} className={formErrors.validFrom ? "border-destructive" : ""} />
                {formErrors.validFrom && <p className="text-xs text-destructive">{formErrors.validFrom}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Valid Until" : "失效日期"}</Label>
                <Input type="date" value={couponForm.validUntil} onChange={e => setCouponForm(p => ({ ...p, validUntil: e.target.value }))} className={formErrors.validUntil ? "border-destructive" : ""} />
                {formErrors.validUntil && <p className="text-xs text-destructive">{formErrors.validUntil}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Applicable Services" : "適用服務"}</Label>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map(svc => (
                  <Badge
                    key={svc.id}
                    variant={couponForm.applicableServices.includes(svc.id) || (svc.id !== "all" && couponForm.applicableServices.includes("all")) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleServiceSelection(svc.id)}
                  >
                    {isEn ? svc.name : svc.nameZh}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCouponOpen(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleSaveCoupon}>{editingCoupon ? (isEn ? "Save Changes" : "儲存更改") : (isEn ? "Create Coupon" : "創建優惠券")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupon Detail Dialog */}
      <Dialog open={!!detailCoupon} onOpenChange={() => setDetailCoupon(null)}>
        <DialogContent className="max-w-lg">
          {detailCoupon && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{isEn ? detailCoupon.name : detailCoupon.nameZh}</span>
                  <StatusBadge status={detailCoupon.status} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Code" : "代碼"}</p><p className="font-mono font-medium">{detailCoupon.code}</p></div>
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Type" : "類型"}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {detailCoupon.type === "threshold" ? (isEn ? `$${detailCoupon.discount} off $${detailCoupon.threshold}` : `滿${detailCoupon.threshold}減${detailCoupon.discount}`) : `${detailCoupon.discount}% off`}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Valid From" : "生效日期"}</p><p>{detailCoupon.validFrom}</p></div>
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Valid Until" : "失效日期"}</p><p>{detailCoupon.validUntil}</p></div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{isEn ? "Usage Statistics" : "使用統計"}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg"><p className="text-lg font-bold text-foreground">{detailCoupon.quantity}</p><p className="text-xs text-muted-foreground">{isEn ? "Issued" : "已發行"}</p></div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg"><p className="text-lg font-bold text-foreground">{detailCoupon.used}</p><p className="text-xs text-muted-foreground">{isEn ? "Used" : "已使用"}</p></div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg"><p className="text-lg font-bold text-foreground">{Math.round((detailCoupon.used / detailCoupon.quantity) * 100)}%</p><p className="text-xs text-muted-foreground">{isEn ? "Rate" : "比率"}</p></div>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{isEn ? "Applicable Services" : "適用服務"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailCoupon.applicableServices.map(svcId => {
                      const svc = serviceOptions.find(s => s.id === svcId);
                      return svc ? <Badge key={svcId} variant="outline" className="text-xs">{isEn ? svc.name : svc.nameZh}</Badge> : null;
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDetailCoupon(null); openEditCoupon(detailCoupon); }}>{isEn ? "Edit" : "編輯"}</Button>
                <Button variant="ghost" onClick={() => setDetailCoupon(null)}>{isEn ? "Close" : "關閉"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Distribute Coupon Dialog */}
      <Dialog open={!!distributeCoupon} onOpenChange={() => { setDistributeCoupon(null); setDistMethod("manual"); setDistUsers(""); }}>
        <DialogContent className="max-w-md">
          {distributeCoupon && (
            <>
              <DialogHeader>
                <DialogTitle>{isEn ? "Distribute Coupon" : "分發優惠券"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-foreground">{isEn ? distributeCoupon.name : distributeCoupon.nameZh}</p>
                  <p className="text-sm text-muted-foreground mt-1">{isEn ? "Code" : "代碼"}: <span className="font-mono">{distributeCoupon.code}</span></p>
                </div>
                <div className="space-y-1.5">
                  <Label>{isEn ? "Distribution Method" : "分發方式"}</Label>
                  <Select value={distMethod} onValueChange={v => setDistMethod(v as DistributionMethod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">{isEn ? "Manual Distribution" : "手動分發"}</SelectItem>
                      <SelectItem value="batch">{isEn ? "Batch Distribution" : "批量分發"}</SelectItem>
                      <SelectItem value="qr">{isEn ? "QR Code Generation" : "生成QR碼"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {distMethod === "manual" && (
                  <div className="space-y-1.5">
                    <Label>{isEn ? "User IDs or Phone Numbers (comma separated)" : "用戶ID或手機號（逗號分隔）"}</Label>
                    <Input placeholder="9123 4567, 9234 5678" value={distUsers} onChange={e => setDistUsers(e.target.value)} />
                  </div>
                )}
                {distMethod === "batch" && (
                  <div className="p-3 rounded-lg bg-info/10 border border-info/30 text-sm text-muted-foreground">
                    {isEn ? "This will distribute coupons to all registered users on the platform." : "這將分發優惠券給平台所有註冊用戶。"}
                  </div>
                )}
                {distMethod === "qr" && (
                  <div className="p-6 rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center">
                    <QrCode className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">{isEn ? "QR code will be generated here" : "QR碼將在此生成"}</p>
                    <p className="text-xs text-warning mt-2">{isEn ? "API key not added yet" : "尚未添加API密鑰"}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setDistributeCoupon(null); setDistMethod("manual"); setDistUsers(""); }}>{isEn ? "Cancel" : "取消"}</Button>
                <Button onClick={handleDistribute}>{isEn ? "Distribute" : "分發"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Enroll Campaign Dialog */}
      <Dialog open={!!enrollCampaign} onOpenChange={() => setEnrollCampaign(null)}>
        <DialogContent className="max-w-md">
          {enrollCampaign && (
            <>
              <DialogHeader>
                <DialogTitle>{isEn ? "Enroll in Campaign" : "加入活動"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-foreground">{isEn ? enrollCampaign.name : enrollCampaign.nameZh}</p>
                  <p className="text-sm text-muted-foreground mt-1">{isEn ? enrollCampaign.description : enrollCampaign.descriptionZh}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">{isEn ? "Start Date" : "開始日期"}</p><p className="font-medium">{enrollCampaign.startDate}</p></div>
                  <div><p className="text-xs text-muted-foreground">{isEn ? "End Date" : "結束日期"}</p><p className="font-medium">{enrollCampaign.endDate}</p></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isEn ? "By enrolling, your institution will be featured in this marketing campaign. Campaign performance metrics will be tracked automatically." : "加入後，您的機構將會在此營銷活動中展示。活動績效指標將自動追蹤。"}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEnrollCampaign(null)}>{isEn ? "Cancel" : "取消"}</Button>
                <Button onClick={handleEnrollCampaign}>{isEn ? "Confirm Enrollment" : "確認加入"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionMarketingPage;
