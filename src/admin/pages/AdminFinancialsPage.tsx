import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import {
  Wallet, TrendingUp, Percent, Search, Download, Eye, ArrowUpRight,
  Check, X, Banknote, CreditCard, Loader2,
} from "lucide-react";
import {
  mockTransactions, mockSettlements, mockWithdrawals,
  type AdminTransaction, type AdminSettlement, type AdminWithdrawal,
} from "../data/adminFinancialData";
import { useToast } from "@/hooks/use-toast";

const paymentMethodLabel = (m: AdminTransaction["paymentMethod"], isEn: boolean) => {
  const map: Record<string, [string, string]> = {
    credit_card: ["Credit Card", "信用卡"], fps: ["FPS", "轉數快"],
    alipay: ["Alipay", "支付寶"], wechat_pay: ["WeChat Pay", "微信支付"], payme: ["PayMe", "PayMe"],
  };
  return isEn ? map[m][0] : map[m][1];
};

const txnStatusBadge = (s: AdminTransaction["status"], isEn: boolean) => {
  if (s === "completed") return <Badge variant="default">{isEn ? "Completed" : "已完成"}</Badge>;
  if (s === "refunded") return <Badge variant="destructive">{isEn ? "Refunded" : "已退款"}</Badge>;
  return <Badge variant="outline">{isEn ? "Pending" : "處理中"}</Badge>;
};

const settlementStatusBadge = (s: AdminSettlement["status"], isEn: boolean) => {
  const map: Record<string, { v: "default" | "secondary" | "destructive" | "outline"; en: string; zh: string }> = {
    settled: { v: "default", en: "Settled", zh: "已結算" },
    confirmed: { v: "secondary", en: "Confirmed", zh: "已確認" },
    pending: { v: "outline", en: "Pending", zh: "待結算" },
    disputed: { v: "destructive", en: "Disputed", zh: "爭議中" },
  };
  const m = map[s];
  return <Badge variant={m.v}>{isEn ? m.en : m.zh}</Badge>;
};

const withdrawalStatusBadge = (s: AdminWithdrawal["status"], isEn: boolean) => {
  const map: Record<string, { v: "default" | "secondary" | "destructive" | "outline"; en: string; zh: string }> = {
    pending: { v: "outline", en: "Pending", zh: "待審批" },
    approved: { v: "secondary", en: "Approved", zh: "已批准" },
    payment_arranged: { v: "secondary", en: "Payment Arranged", zh: "付款安排中" },
    paid: { v: "default", en: "Paid", zh: "已付款" },
    rejected: { v: "destructive", en: "Rejected", zh: "已拒絕" },
  };
  const m = map[s];
  return <Badge variant={m.v}>{isEn ? m.en : m.zh}</Badge>;
};

const AdminFinancialsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const { toast } = useToast();

  // Transactions state
  const [txnSearch, setTxnSearch] = useState("");
  const [txnTypeFilter, setTxnTypeFilter] = useState("all");
  const [txnStatusFilter, setTxnStatusFilter] = useState("all");

  // Settlements state
  const [stlSearch, setStlSearch] = useState("");
  const [stlStatusFilter, setStlStatusFilter] = useState("all");

  // Withdrawals state
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [wdrSearch, setWdrSearch] = useState("");
  const [wdrStatusFilter, setWdrStatusFilter] = useState("all");

  // Withdrawal action dialog
  const [actionDialog, setActionDialog] = useState<{ open: boolean; wdr: AdminWithdrawal | null; action: "approve" | "reject" | "arrange" | "confirm_paid" | null }>({ open: false, wdr: null, action: null });
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  // --- Transactions ---
  const filteredTxns = mockTransactions.filter((t) => {
    const q = txnSearch.toLowerCase();
    const matchSearch = !q || t.id.toLowerCase().includes(q) || t.orderId.toLowerCase().includes(q) || t.userName.toLowerCase().includes(q) || t.institutionName.toLowerCase().includes(q);
    const matchType = txnTypeFilter === "all" || t.orderType === txnTypeFilter;
    const matchStatus = txnStatusFilter === "all" || t.status === txnStatusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const totalRevenue = mockTransactions.filter((t) => t.status === "completed").reduce((s, t) => s + t.paymentAmount, 0);
  const totalFees = mockTransactions.filter((t) => t.status === "completed").reduce((s, t) => s + t.serviceFee, 0);
  const totalSettled = mockSettlements.filter((s) => s.status === "settled").reduce((a, s) => a + s.netSettlement, 0);

  // --- Settlements ---
  const filteredStl = mockSettlements.filter((s) => {
    const q = stlSearch.toLowerCase();
    const matchSearch = !q || s.id.toLowerCase().includes(q) || s.institutionName.toLowerCase().includes(q);
    const matchStatus = stlStatusFilter === "all" || s.status === stlStatusFilter;
    return matchSearch && matchStatus;
  });

  // --- Withdrawals ---
  const filteredWdr = withdrawals.filter((w) => {
    const q = wdrSearch.toLowerCase();
    const matchSearch = !q || w.id.toLowerCase().includes(q) || w.institutionName.toLowerCase().includes(q);
    const matchStatus = wdrStatusFilter === "all" || w.status === wdrStatusFilter;
    return matchSearch && matchStatus;
  });

  const openAction = (wdr: AdminWithdrawal, action: typeof actionDialog.action) => {
    setActionDialog({ open: true, wdr, action });
    setRejectReason("");
  };

  const handleWithdrawalAction = () => {
    if (!actionDialog.wdr || !actionDialog.action) return;
    setProcessing(true);
    setTimeout(() => {
      const id = actionDialog.wdr!.id;
      const now = new Date().toISOString().slice(0, 16).replace("T", " ");
      setWithdrawals((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          switch (actionDialog.action) {
            case "approve": return { ...w, status: "approved" as const, processedAt: now };
            case "reject": return { ...w, status: "rejected" as const, processedAt: now, rejectionReason: rejectReason };
            case "arrange": return { ...w, status: "payment_arranged" as const, processedAt: now };
            case "confirm_paid": return { ...w, status: "paid" as const, processedAt: now, adminNote: "Payment confirmed" };
            default: return w;
          }
        })
      );
      setProcessing(false);
      setActionDialog({ open: false, wdr: null, action: null });
      const labels: Record<string, [string, string]> = {
        approve: ["Approved", "已批准"], reject: ["Rejected", "已拒絕"],
        arrange: ["Payment Arranged", "付款已安排"], confirm_paid: ["Paid", "已確認付款"],
      };
      const l = labels[actionDialog.action!];
      toast({ title: isEn ? l[0] : l[1] });
    }, 1000);
  };

  const actionTitle = () => {
    const map: Record<string, [string, string]> = {
      approve: ["Approve Withdrawal", "批准提款"],
      reject: ["Reject Withdrawal", "拒絕提款"],
      arrange: ["Arrange Payment", "安排付款"],
      confirm_paid: ["Confirm Paid", "確認已付款"],
    };
    const m = map[actionDialog.action || "approve"];
    return isEn ? m[0] : m[1];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Financial Management" : "財務管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Transactions, settlements, and withdrawals" : "交易記錄、結算及提款管理"}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => toast({ title: isEn ? "Export API key not added yet" : "導出 API 金鑰尚未添加" })}>
          <Download className="h-4 w-4" />{isEn ? "Export Report" : "導出報表"}
        </Button>
      </div>

      <ApiPlaceholderNotice service={isEn ? "Financial Export" : "財務導出"} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminMetricCard icon={Wallet} label={isEn ? "Total Revenue" : "總收入"} value={`HK$${totalRevenue.toLocaleString()}`} />
        <AdminMetricCard icon={Percent} label={isEn ? "Platform Fees" : "平台服務費"} value={`HK$${totalFees.toLocaleString()}`} />
        <AdminMetricCard icon={TrendingUp} label={isEn ? "Settled Amount" : "已結算金額"} value={`HK$${totalSettled.toLocaleString()}`} />
        <AdminMetricCard icon={Banknote} label={isEn ? "Pending Withdrawals" : "待處理提款"} value={String(withdrawals.filter((w) => w.status === "pending").length)} />
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">{isEn ? "Transactions" : "交易記錄"}</TabsTrigger>
          <TabsTrigger value="settlements">{isEn ? "Settlements" : "結算管理"}</TabsTrigger>
          <TabsTrigger value="withdrawals">{isEn ? "Withdrawals" : "提款管理"}</TabsTrigger>
        </TabsList>

        {/* === TRANSACTIONS === */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search order, user, institution..." : "搜索訂單、用戶、機構..."} value={txnSearch} onChange={(e) => setTxnSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {[{ v: "all", l: isEn ? "All" : "全部" }, { v: "in_clinic", l: isEn ? "In-Clinic" : "門診" }, { v: "consultation", l: isEn ? "Consult" : "問診" }].map((t) => (
                <Button key={t.v} variant={txnTypeFilter === t.v ? "default" : "outline"} size="sm" onClick={() => setTxnTypeFilter(t.v)}>{t.l}</Button>
              ))}
            </div>
            <div className="flex gap-1">
              {[{ v: "all", l: isEn ? "All Status" : "全部狀態" }, { v: "completed", l: isEn ? "Completed" : "已完成" }, { v: "refunded", l: isEn ? "Refunded" : "已退款" }, { v: "pending", l: isEn ? "Pending" : "處理中" }].map((t) => (
                <Button key={t.v} variant={txnStatusFilter === t.v ? "default" : "outline"} size="sm" onClick={() => setTxnStatusFilter(t.v)}>{t.l}</Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isEn ? "Order No." : "訂單號"}</TableHead>
                    <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                    <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                    <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                    <TableHead>{isEn ? "Method" : "付款方式"}</TableHead>
                    <TableHead>{isEn ? "Time" : "時間"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Fee" : "服務費"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Settlement" : "結算額"}</TableHead>
                    <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTxns.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">{isEn ? "No transactions found" : "未找到交易記錄"}</TableCell></TableRow>
                  ) : filteredTxns.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.orderId}</TableCell>
                      <TableCell className="text-sm">{t.userName}</TableCell>
                      <TableCell className="text-sm">{t.institutionName}</TableCell>
                      <TableCell><Badge variant="outline">{t.orderType === "in_clinic" ? (isEn ? "Clinic" : "門診") : (isEn ? "Consult" : "問診")}</Badge></TableCell>
                      <TableCell className="text-right font-medium">HK${t.paymentAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-xs"><Badge variant="secondary">{paymentMethodLabel(t.paymentMethod, isEn)}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.paymentTime}</TableCell>
                      <TableCell className="text-right text-destructive text-sm">-HK${t.serviceFee.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold text-sm">HK${t.settlementAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{txnStatusBadge(t.status, isEn)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SETTLEMENTS === */}
        <TabsContent value="settlements" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search settlement..." : "搜索結算記錄..."} value={stlSearch} onChange={(e) => setStlSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {[{ v: "all", l: isEn ? "All" : "全部" }, { v: "pending", l: isEn ? "Pending" : "待結算" }, { v: "confirmed", l: isEn ? "Confirmed" : "已確認" }, { v: "settled", l: isEn ? "Settled" : "已結算" }, { v: "disputed", l: isEn ? "Disputed" : "爭議中" }].map((t) => (
                <Button key={t.v} variant={stlStatusFilter === t.v ? "default" : "outline"} size="sm" onClick={() => setStlStatusFilter(t.v)}>{t.l}</Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                    <TableHead>{isEn ? "Cycle" : "結算週期"}</TableHead>
                    <TableHead className="text-center">{isEn ? "Orders" : "訂單數"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Gross" : "總額"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Fee Rate" : "費率"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Service Fee" : "服務費"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Net Settlement" : "淨結算額"}</TableHead>
                    <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStl.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">{isEn ? "No settlements found" : "未找到結算記錄"}</TableCell></TableRow>
                  ) : filteredStl.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.institutionName}</TableCell>
                      <TableCell>{s.cycle}</TableCell>
                      <TableCell className="text-center">{s.orderCount}</TableCell>
                      <TableCell className="text-right">HK${s.grossAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(s.serviceFeeRate * 100).toFixed(0)}%</TableCell>
                      <TableCell className="text-right text-destructive">-HK${s.totalServiceFee.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">HK${s.netSettlement.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{settlementStatusBadge(s.status, isEn)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/admin/financials/settlements/${s.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === WITHDRAWALS === */}
        <TabsContent value="withdrawals" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search withdrawals..." : "搜索提款..."} value={wdrSearch} onChange={(e) => setWdrSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1">
              {[{ v: "all", l: isEn ? "All" : "全部" }, { v: "pending", l: isEn ? "Pending" : "待審批" }, { v: "approved", l: isEn ? "Approved" : "已批准" }, { v: "payment_arranged", l: isEn ? "Arranged" : "安排中" }, { v: "paid", l: isEn ? "Paid" : "已付" }, { v: "rejected", l: isEn ? "Rejected" : "已拒絕" }].map((t) => (
                <Button key={t.v} variant={wdrStatusFilter === t.v ? "default" : "outline"} size="sm" onClick={() => setWdrStatusFilter(t.v)}>{t.l}</Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                    <TableHead>{isEn ? "Bank" : "銀行"}</TableHead>
                    <TableHead>{isEn ? "Account" : "帳戶"}</TableHead>
                    <TableHead>{isEn ? "Requested" : "申請時間"}</TableHead>
                    <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWdr.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">{isEn ? "No withdrawal requests" : "無提款申請"}</TableCell></TableRow>
                  ) : filteredWdr.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-xs">{w.id}</TableCell>
                      <TableCell className="font-medium">{w.institutionName}</TableCell>
                      <TableCell className="text-right font-semibold">HK${w.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{w.bankName}</TableCell>
                      <TableCell className="font-mono text-xs">{w.bankAccount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{w.requestedAt}</TableCell>
                      <TableCell className="text-center">{withdrawalStatusBadge(w.status, isEn)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {w.status === "pending" && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => openAction(w, "approve")} title={isEn ? "Approve" : "批准"}><Check className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => openAction(w, "reject")} title={isEn ? "Reject" : "拒絕"}><X className="h-4 w-4" /></Button>
                            </>
                          )}
                          {w.status === "approved" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAction(w, "arrange")} title={isEn ? "Arrange Payment" : "安排付款"}><ArrowUpRight className="h-4 w-4" /></Button>
                          )}
                          {w.status === "payment_arranged" && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAction(w, "confirm_paid")} title={isEn ? "Confirm Paid" : "確認付款"}><CreditCard className="h-4 w-4" /></Button>
                          )}
                          {w.status === "rejected" && w.rejectionReason && (
                            <span className="text-xs text-destructive max-w-[120px] truncate" title={w.rejectionReason}>{w.rejectionReason}</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Withdrawal Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(o) => !o && setActionDialog({ open: false, wdr: null, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionTitle()}</DialogTitle>
          </DialogHeader>
          {actionDialog.wdr && (
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">{isEn ? "Institution:" : "機構："}</span> {actionDialog.wdr.institutionName}</p>
                <p><span className="text-muted-foreground">{isEn ? "Amount:" : "金額："}</span> <span className="font-semibold">HK${actionDialog.wdr.amount.toLocaleString()}</span></p>
                <p><span className="text-muted-foreground">{isEn ? "Bank:" : "銀行："}</span> {actionDialog.wdr.bankName} {actionDialog.wdr.bankAccount}</p>
              </div>
              {actionDialog.action === "reject" && (
                <div className="space-y-1.5">
                  <Label>{isEn ? "Rejection Reason" : "拒絕原因"} *</Label>
                  <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={isEn ? "Enter reason..." : "輸入原因..."} rows={3} />
                </div>
              )}
              {actionDialog.action === "arrange" && (
                <ApiPlaceholderNotice service={isEn ? "Bank Transfer" : "銀行轉帳"} />
              )}
              {actionDialog.action === "confirm_paid" && (
                <p className="text-sm text-muted-foreground">{isEn ? "Confirm that the bank transfer has been completed." : "確認銀行轉帳已完成。"}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, wdr: null, action: null })}>{isEn ? "Cancel" : "取消"}</Button>
            <Button
              onClick={handleWithdrawalAction}
              disabled={processing || (actionDialog.action === "reject" && !rejectReason.trim())}
              variant={actionDialog.action === "reject" ? "destructive" : "default"}
            >
              {processing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              {isEn ? "Confirm" : "確認"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFinancialsPage;
