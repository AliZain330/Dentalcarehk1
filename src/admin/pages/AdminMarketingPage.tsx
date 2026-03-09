import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMetricCard from "../components/AdminMetricCard";
import { Ticket, Gift, TrendingUp, Search, Eye, Ban, Plus } from "lucide-react";
import {
  mockPlatformCoupons, mockInstitutionCoupons,
  type AdminCoupon,
} from "../data/adminMarketingData";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { useAdminNotify } from "@/admin/hooks/useAdminNotify";

const AdminMarketingPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const notify = useAdminNotify();

  const [platformCoupons, setPlatformCoupons] = useState(mockPlatformCoupons);
  const [instCoupons, setInstCoupons] = useState(mockInstitutionCoupons);
  const [searchP, setSearchP] = useState("");
  const [searchI, setSearchI] = useState("");
  const [statusFilterP, setStatusFilterP] = useState<string>("all");
  const [statusFilterI, setStatusFilterI] = useState<string>("all");

  const filterCoupons = (list: AdminCoupon[], search: string, statusFilter: string) =>
    list.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.nameZh.includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });

  const filteredP = filterCoupons(platformCoupons, searchP, statusFilterP);
  const filteredI = filterCoupons(instCoupons, searchI, statusFilterI);

  const toggleInstCoupon = (id: string) => {
    setInstCoupons((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === "disabled" ? "active" : "disabled" as AdminCoupon["status"] } : c)
    );
    notify.success("Status updated", "狀態已更新");
  };

  const totalActive = platformCoupons.filter((c) => c.status === "active").length + instCoupons.filter((c) => c.status === "active").length;
  const totalIssued = [...platformCoupons, ...instCoupons].reduce((s, c) => s + c.totalIssued, 0);
  const totalUsed = [...platformCoupons, ...instCoupons].reduce((s, c) => s + c.totalUsed, 0);
  const redemptionRate = totalIssued > 0 ? ((totalUsed / totalIssued) * 100).toFixed(1) : "0";

  const CouponTable = ({ data, isInst }: { data: AdminCoupon[]; isInst?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>{isEn ? "Name" : "名稱"}</TableHead>
          {isInst && <TableHead>{isEn ? "Institution" : "機構"}</TableHead>}
          <TableHead>{isEn ? "Type" : "類型"}</TableHead>
          <TableHead className="text-right">{isEn ? "Value" : "面額"}</TableHead>
          <TableHead className="text-right">{isEn ? "Min Spend" : "最低消費"}</TableHead>
          <TableHead className="text-center">{isEn ? "Issued" : "已發"}</TableHead>
          <TableHead className="text-center">{isEn ? "Used" : "已用"}</TableHead>
          <TableHead>{isEn ? "Validity" : "有效期"}</TableHead>
          <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
          <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow><TableCell colSpan={isInst ? 11 : 10} className="text-center py-8 text-muted-foreground">{isEn ? "No coupons found" : "未找到優惠券"}</TableCell></TableRow>
        ) : data.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono text-xs">{c.id}</TableCell>
            <TableCell className="font-medium">{isEn ? c.name : c.nameZh}</TableCell>
            {isInst && <TableCell className="text-sm">{c.institutionName}</TableCell>}
            <TableCell><Badge variant="outline">{c.type === "fixed" ? (isEn ? "Fixed" : "固定") : (isEn ? "%" : "百分比")}</Badge></TableCell>
            <TableCell className="text-right font-medium">{c.type === "fixed" ? `HK$${c.amount}` : `${c.amount}%`}</TableCell>
            <TableCell className="text-right">HK${c.minSpend}</TableCell>
            <TableCell className="text-center">{c.totalIssued.toLocaleString()}</TableCell>
            <TableCell className="text-center">{c.totalUsed.toLocaleString()}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{c.validFrom} ~ {c.validTo}</TableCell>
            <TableCell className="text-center"><AdminStatusBadge status={c.status} /></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/marketing/coupons/${c.id}`)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {isInst && c.status !== "expired" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleInstCoupon(c.id)}>
                    <Ban className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const statusTabs = [
    { val: "all", label: isEn ? "All" : "全部" },
    { val: "active", label: isEn ? "Active" : "進行中" },
    { val: "draft", label: isEn ? "Draft" : "草稿" },
    { val: "disabled", label: isEn ? "Disabled" : "已停用" },
    { val: "expired", label: isEn ? "Expired" : "已過期" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Marketing — Coupons" : "營銷管理 — 優惠券"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Platform and institution coupon management" : "平台及機構優惠券管理"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/marketing/campaigns")}>{isEn ? "Campaigns" : "活動管理"}</Button>
          <Button variant="outline" onClick={() => navigate("/admin/marketing/banners")}>{isEn ? "Banners" : "橫幅管理"}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminMetricCard icon={Ticket} label={isEn ? "Active Coupons" : "進行中優惠券"} value={String(totalActive)} />
        <AdminMetricCard icon={Gift} label={isEn ? "Total Issued" : "已發總數"} value={totalIssued.toLocaleString()} />
        <AdminMetricCard icon={TrendingUp} label={isEn ? "Redemption Rate" : "使用率"} value={`${redemptionRate}%`} />
      </div>

      <Tabs defaultValue="platform">
        <TabsList>
          <TabsTrigger value="platform">{isEn ? "Platform Coupons" : "平台優惠券"}</TabsTrigger>
          <TabsTrigger value="institution">{isEn ? "Institution Coupons" : "機構優惠券"}</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search by ID or name..." : "搜索ID或名稱..."} value={searchP} onChange={(e) => setSearchP(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {statusTabs.map((t) => (
                <Button key={t.val} variant={statusFilterP === t.val ? "default" : "outline"} size="sm" onClick={() => setStatusFilterP(t.val)}>{t.label}</Button>
              ))}
            </div>
            <Button onClick={() => navigate("/admin/marketing/coupons/create")}><Plus className="h-4 w-4 mr-1" />{isEn ? "Create Coupon" : "創建優惠券"}</Button>
          </div>
          <Card>
            <CardContent className="p-0"><CouponTable data={filteredP} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institution" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search institution coupons..." : "搜索機構優惠券..."} value={searchI} onChange={(e) => setSearchI(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {statusTabs.filter((t) => t.val !== "draft").map((t) => (
                <Button key={t.val} variant={statusFilterI === t.val ? "default" : "outline"} size="sm" onClick={() => setStatusFilterI(t.val)}>{t.label}</Button>
              ))}
            </div>
          </div>
          <Card>
            <CardContent className="p-0"><CouponTable data={filteredI} isInst /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMarketingPage;
