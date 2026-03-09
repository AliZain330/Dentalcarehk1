import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ClipboardList, Download, AlertTriangle, Wallet } from "lucide-react";
import { adminOrders, type AdminOrder } from "../data/adminOrderData";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

type TypeFilter = "all" | "in_clinic" | "consultation";
type StatusFilter = "all" | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

const AdminOrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [settlementFilter, setSettlementFilter] = useState("all");

  const filtered = useMemo(() => {
    return adminOrders.filter((o) => {
      if (typeFilter !== "all" && o.type !== typeFilter) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (settlementFilter !== "all" && o.settlementStatus !== settlementFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.userName.toLowerCase().includes(q) || o.institution.toLowerCase().includes(q) || o.doctor.toLowerCase().includes(q);
      }
      return true;
    });
  }, [typeFilter, statusFilter, settlementFilter, search]);

  const disputeCount = adminOrders.filter((o) => o.hasDispute).length;
  const totalRevenue = adminOrders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0);

  const statusBadge = (s: string) => {
    const m: Record<string, { l: string; v: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { l: isEn ? "Pending" : "待處理", v: "outline" },
      confirmed: { l: isEn ? "Confirmed" : "已確認", v: "secondary" },
      in_progress: { l: isEn ? "In Progress" : "進行中", v: "secondary" },
      completed: { l: isEn ? "Completed" : "已完成", v: "default" },
      cancelled: { l: isEn ? "Cancelled" : "已取消", v: "destructive" },
    };
    const c = m[s] || m.pending;
    return <Badge variant={c.v}>{c.l}</Badge>;
  };

  const settleBadge = (s: string) => {
    const m: Record<string, { l: string; v: "default" | "secondary" | "destructive" }> = {
      settled: { l: isEn ? "Settled" : "已結算", v: "default" },
      unsettled: { l: isEn ? "Unsettled" : "未結算", v: "secondary" },
      refunded: { l: isEn ? "Refunded" : "已退款", v: "destructive" },
    };
    const c = m[s] || m.unsettled;
    return <Badge variant={c.v}>{c.l}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Order Management" : "訂單管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Manage all platform orders" : "管理所有平台訂單"}</p>
        </div>
        <div className="flex gap-2">
          {disputeCount > 0 && (
            <Button variant="outline" onClick={() => navigate("/admin/orders/disputes")} className="gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              {isEn ? `${disputeCount} Disputes` : `${disputeCount} 個爭議`}
            </Button>
          )}
          <Button variant="outline" onClick={() => toast.info(isEn ? "Export API key not added yet" : "導出 API 金鑰尚未添加")} className="gap-2">
            <Download className="h-4 w-4" />{isEn ? "Export" : "導出"}
          </Button>
        </div>
      </div>

      <ApiPlaceholderNotice service={isEn ? "Order Report Export" : "訂單報告導出"} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Total Orders" : "總訂單"} value={adminOrders.length} />
        <AdminMetricCard icon={Wallet} label={isEn ? "Revenue" : "收入"} value={`HK$${totalRevenue.toLocaleString()}`} />
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Disputes" : "爭議"} value={disputeCount} />
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Completed" : "已完成"} value={adminOrders.filter((o) => o.status === "completed").length} />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search order, user, institution..." : "搜索訂單、用戶、機構..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
          <TabsList>
            <TabsTrigger value="all">{isEn ? "All" : "全部"}</TabsTrigger>
            <TabsTrigger value="in_clinic">{isEn ? "In-Clinic" : "到店"}</TabsTrigger>
            <TabsTrigger value="consultation">{isEn ? "Consult" : "問診"}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-36"><SelectValue placeholder={isEn ? "Status" : "狀態"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
            <SelectItem value="pending">{isEn ? "Pending" : "待處理"}</SelectItem>
            <SelectItem value="confirmed">{isEn ? "Confirmed" : "已確認"}</SelectItem>
            <SelectItem value="in_progress">{isEn ? "In Progress" : "進行中"}</SelectItem>
            <SelectItem value="completed">{isEn ? "Completed" : "已完成"}</SelectItem>
            <SelectItem value="cancelled">{isEn ? "Cancelled" : "已取消"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={settlementFilter} onValueChange={setSettlementFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder={isEn ? "Settlement" : "結算"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All" : "全部"}</SelectItem>
            <SelectItem value="settled">{isEn ? "Settled" : "已結算"}</SelectItem>
            <SelectItem value="unsettled">{isEn ? "Unsettled" : "未結算"}</SelectItem>
            <SelectItem value="refunded">{isEn ? "Refunded" : "已退款"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{isEn ? "No orders found" : "未找到訂單"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "Order" : "訂單號"}</TableHead>
                  <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                  <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                  <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                  <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Settlement" : "結算"}</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                    <TableCell>
                      <div>
                        <p className="font-mono text-xs font-medium">{o.id}</p>
                        <p className="text-[11px] text-muted-foreground">{o.createdAt}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{o.userName}</TableCell>
                    <TableCell className="text-sm">{o.institution}</TableCell>
                    <TableCell className="text-sm">{o.doctor}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {o.type === "in_clinic" ? (isEn ? "Clinic" : "到店") : (isEn ? "Consult" : "問診")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">HK${o.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {statusBadge(o.status)}
                        {o.hasDispute && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{settleBadge(o.settlementStatus)}</TableCell>
                    <TableCell className="text-muted-foreground">→</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
