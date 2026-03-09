import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft, AlertTriangle, ImageIcon, ClipboardList, MessageSquareWarning,
} from "lucide-react";
import { adminDisputes, adminOrders, type AdminDispute } from "../data/adminOrderData";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";
import { useAdminNotify } from "@/admin/hooks/useAdminNotify";

/* ─── List page ─── */
export const AdminDisputesPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const notify = useAdminNotify();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? adminDisputes : adminDisputes.filter((d) => d.status === statusFilter);
  const openCount = adminDisputes.filter((d) => d.status === "open" || d.status === "under_review").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Dispute Handling" : "爭議處理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? `${adminDisputes.length} total disputes` : `共 ${adminDisputes.length} 個爭議`}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Open" : "待處理"} value={openCount} />
        <AdminMetricCard icon={MessageSquareWarning} label={isEn ? "Total" : "總數"} value={adminDisputes.length} />
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Resolved" : "已解決"} value={adminDisputes.filter((d) => ["resolved", "refunded", "compensated", "closed"].includes(d.status)).length} />
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Refunds Issued" : "已退款"} value={adminDisputes.filter((d) => d.refundAmount).length} />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
          <SelectItem value="open">{isEn ? "Open" : "待處理"}</SelectItem>
          <SelectItem value="under_review">{isEn ? "Under Review" : "審核中"}</SelectItem>
          <SelectItem value="resolved">{isEn ? "Resolved" : "已解決"}</SelectItem>
          <SelectItem value="refunded">{isEn ? "Refunded" : "已退款"}</SelectItem>
          <SelectItem value="compensated">{isEn ? "Compensated" : "已補償"}</SelectItem>
          <SelectItem value="closed">{isEn ? "Closed" : "已關閉"}</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{isEn ? "No disputes found" : "未找到爭議"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "ID" : "編號"}</TableHead>
                  <TableHead>{isEn ? "Order" : "訂單"}</TableHead>
                  <TableHead>{isEn ? "Source" : "來源"}</TableHead>
                  <TableHead>{isEn ? "Subject" : "主題"}</TableHead>
                  <TableHead>{isEn ? "Filed" : "提交日期"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/disputes/${d.id}`)}>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="font-mono text-xs">{d.orderId}</TableCell>
                    <TableCell>
                      <span className="text-sm">{d.sourceName}</span>
                      <Badge variant="outline" className="ml-1 text-[10px]">{isEn ? d.source : { user: "用戶", institution: "機構", doctor: "醫生" }[d.source]}</Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{d.subject}</TableCell>
                    <TableCell className="text-sm">{d.createdAt.split(" ")[0]}</TableCell>
                    <TableCell className="text-center"><AdminStatusBadge status={d.status} /></TableCell>
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

/* ─── Detail page ─── */
export const AdminDisputeDetailPage: React.FC = () => {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";
  const notify = useAdminNotify();

  const source = adminDisputes.find((d) => d.id === disputeId);
  const [dispute, setDispute] = useState<AdminDispute | null>(source ? { ...source } : null);
  const [showResolve, setShowResolve] = useState(false);
  const [resType, setResType] = useState<"refund" | "coupon" | "dismiss">("refund");
  const [refundAmt, setRefundAmt] = useState("");
  const [couponVal, setCouponVal] = useState("");
  const [notes, setNotes] = useState(dispute?.adminNotes || "");

  if (!dispute) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{isEn ? "Dispute not found" : "找不到爭議"}</p>
        <Button variant="link" onClick={() => navigate("/admin/disputes")}>{isEn ? "Back" : "返回"}</Button>
      </div>
    );
  }

  const order = adminOrders.find((o) => o.id === dispute.orderId);

  const handleSaveNotes = () => {
    setDispute((p) => p ? { ...p, adminNotes: notes } : p);
    notify.success("Notes saved", "備註已保存");
  };

  const handleResolve = () => {
    let resolution = "";
    let newStatus: AdminDispute["status"] = "resolved";
    if (resType === "refund") {
      resolution = `${isEn ? "Refund" : "退款"}: HK$${refundAmt}`;
      newStatus = "refunded";
    } else if (resType === "coupon") {
      resolution = `${isEn ? "Coupon compensation" : "優惠券補償"}: HK$${couponVal}`;
      newStatus = "compensated";
    } else {
      resolution = isEn ? "Dispute dismissed" : "爭議已駁回";
      newStatus = "closed";
    }
    setDispute((p) => p ? { ...p, status: newStatus, resolution, adminNotes: notes, resolvedAt: new Date().toISOString().split("T")[0], refundAmount: resType === "refund" ? Number(refundAmt) : undefined, couponCompensation: resType === "coupon" ? `HK$${couponVal} coupon` : undefined } : p);
    setShowResolve(false);
    notify.success("Dispute resolved", "爭議已處理");
    notify.info("All parties have been notified", "已通知所有相關方");
  };

  const isResolved = ["resolved", "refunded", "compensated", "closed"].includes(dispute.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/disputes")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{dispute.id}</h1>
            <AdminStatusBadge status={dispute.status} />
          </div>
          <p className="text-sm text-muted-foreground">{isEn ? "Order" : "訂單"}: {dispute.orderId}</p>
        </div>
        {!isResolved && (
          <Button onClick={() => setShowResolve(true)} className="gap-1">
            {isEn ? "Resolve Dispute" : "處理爭議"}
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dispute info */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Dispute Details" : "爭議詳情"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">{isEn ? "Source" : "來源"}</p><p className="font-medium">{dispute.sourceName} <Badge variant="outline" className="ml-1 text-[10px]">{isEn ? dispute.source : { user: "用戶", institution: "機構", doctor: "醫生" }[dispute.source]}</Badge></p></div>
              <div><p className="text-xs text-muted-foreground">{isEn ? "Filed" : "提交日期"}</p><p className="font-medium">{dispute.createdAt}</p></div>
              {dispute.resolvedAt && <div><p className="text-xs text-muted-foreground">{isEn ? "Resolved" : "處理日期"}</p><p className="font-medium">{dispute.resolvedAt}</p></div>}
            </div>
            <div><p className="text-xs text-muted-foreground mb-1">{isEn ? "Subject" : "主題"}</p><p className="text-sm font-semibold">{dispute.subject}</p></div>
            <div><p className="text-xs text-muted-foreground mb-1">{isEn ? "Description" : "描述"}</p><p className="text-sm">{dispute.description}</p></div>
            {dispute.evidence.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">{isEn ? "Evidence" : "證據"}</p>
                <div className="flex flex-wrap gap-2">
                  {dispute.evidence.map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-2"><ImageIcon className="h-4 w-4 text-muted-foreground" /><span className="text-xs font-medium">{e}</span></div>
                  ))}
                </div>
                <ApiPlaceholderNotice service={isEn ? "Evidence Viewer" : "證據查看器"} className="mt-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order summary + admin actions */}
        <div className="space-y-6">
          {order && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Related Order" : "相關訂單"}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">{isEn ? "Order" : "訂單"}</span><span className="font-mono">{order.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{isEn ? "User" : "用戶"}</span><span>{order.userName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{isEn ? "Institution" : "機構"}</span><span>{order.institution}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{isEn ? "Amount" : "金額"}</span><span className="font-medium">HK${order.amount.toLocaleString()}</span></div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate(`/admin/orders/${order.id}`)}>{isEn ? "View Full Order" : "查看完整訂單"}</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Admin Notes" : "管理員備註"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder={isEn ? "Add notes..." : "添加備註..."} disabled={isResolved} />
              {!isResolved && <Button size="sm" onClick={handleSaveNotes}>{isEn ? "Save Notes" : "保存備註"}</Button>}
            </CardContent>
          </Card>

          {dispute.resolution && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2"><CardTitle className="text-base text-primary">{isEn ? "Resolution" : "處理結果"}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{dispute.resolution}</p>
                {dispute.refundAmount && <p className="text-muted-foreground">{isEn ? "Refund" : "退款"}: HK${dispute.refundAmount.toLocaleString()}</p>}
                {dispute.couponCompensation && <p className="text-muted-foreground">{isEn ? "Compensation" : "補償"}: {dispute.couponCompensation}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resolve dialog */}
      <Dialog open={showResolve} onOpenChange={setShowResolve}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEn ? "Resolve Dispute" : "處理爭議"}</DialogTitle>
            <DialogDescription>{isEn ? "Choose a resolution for this dispute. Both parties will be notified." : "選擇爭議處理方式，雙方將收到通知。"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{isEn ? "Resolution Type" : "處理方式"}</Label>
              <Select value={resType} onValueChange={(v) => setResType(v as typeof resType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">{isEn ? "Issue Refund" : "退款"}</SelectItem>
                  <SelectItem value="coupon">{isEn ? "Coupon Compensation" : "優惠券補償"}</SelectItem>
                  <SelectItem value="dismiss">{isEn ? "Dismiss" : "駁回"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {resType === "refund" && (
              <div><Label>{isEn ? "Refund Amount (HK$)" : "退款金額 (HK$)"}</Label><Input type="number" value={refundAmt} onChange={(e) => setRefundAmt(e.target.value)} placeholder={order ? String(order.amount) : "0"} /></div>
            )}
            {resType === "coupon" && (
              <div><Label>{isEn ? "Coupon Value (HK$)" : "優惠券金額 (HK$)"}</Label><Input type="number" value={couponVal} onChange={(e) => setCouponVal(e.target.value)} placeholder="100" /></div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolve(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleResolve} disabled={(resType === "refund" && !refundAmt) || (resType === "coupon" && !couponVal)}>
              {isEn ? "Confirm Resolution" : "確認處理"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputeDetailPage;
