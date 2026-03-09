import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import {
  DollarSign, FileText, Download, Wallet, CreditCard, ArrowUpRight, ArrowDownRight,
  Search, Eye, ChevronLeft, BanknoteIcon, CheckCircle2, Clock, XCircle, AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ─── Mock Data ───────────────────────────────────────────────

type StatementPeriod = "daily" | "weekly" | "monthly";
type StatementStatus = "settled" | "pending" | "processing";
type WithdrawalStatus = "pending" | "approved" | "paid" | "rejected";

interface Statement {
  id: string;
  period: string;
  periodType: StatementPeriod;
  orderAmount: number;
  serviceFee: number;
  netAmount: number;
  orderCount: number;
  status: StatementStatus;
}

interface StatementOrder {
  orderNo: string;
  orderAmount: number;
  feeRate: number;
  deduction: number;
  netContribution: number;
  date: string;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  requestDate: string;
  status: WithdrawalStatus;
  arrivalTime: string | null;
  rejectReason: string | null;
  cycle: string;
}

interface BankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
  verified: boolean;
}

const mockStatements: Statement[] = [
  { id: "S2024-0301", period: "2024-03-01", periodType: "daily", orderAmount: 18600, serviceFee: 1860, netAmount: 16740, orderCount: 8, status: "settled" },
  { id: "S2024-0302", period: "2024-03-02", periodType: "daily", orderAmount: 22400, serviceFee: 2240, netAmount: 20160, orderCount: 11, status: "settled" },
  { id: "S2024-0303", period: "2024-03-03", periodType: "daily", orderAmount: 9800, serviceFee: 980, netAmount: 8820, orderCount: 5, status: "processing" },
  { id: "S2024-W09", period: "2024-02-26 ~ 2024-03-03", periodType: "weekly", orderAmount: 98400, serviceFee: 9840, netAmount: 88560, orderCount: 42, status: "settled" },
  { id: "S2024-W08", period: "2024-02-19 ~ 2024-02-25", periodType: "weekly", orderAmount: 112600, serviceFee: 11260, netAmount: 101340, orderCount: 51, status: "settled" },
  { id: "S2024-M02", period: "2024-02", periodType: "monthly", orderAmount: 428000, serviceFee: 42800, netAmount: 385200, orderCount: 196, status: "settled" },
  { id: "S2024-M01", period: "2024-01", periodType: "monthly", orderAmount: 392000, serviceFee: 39200, netAmount: 352800, orderCount: 178, status: "settled" },
  { id: "S2024-M03", period: "2024-03", periodType: "monthly", orderAmount: 50800, serviceFee: 5080, netAmount: 45720, orderCount: 24, status: "pending" },
];

const mockStatementOrders: StatementOrder[] = [
  { orderNo: "ORD-20240301-001", orderAmount: 2800, feeRate: 10, deduction: 280, netContribution: 2520, date: "2024-03-01 09:15" },
  { orderNo: "ORD-20240301-002", orderAmount: 1500, feeRate: 10, deduction: 150, netContribution: 1350, date: "2024-03-01 10:30" },
  { orderNo: "ORD-20240301-003", orderAmount: 3200, feeRate: 10, deduction: 320, netContribution: 2880, date: "2024-03-01 11:00" },
  { orderNo: "ORD-20240301-004", orderAmount: 4600, feeRate: 10, deduction: 460, netContribution: 4140, date: "2024-03-01 14:20" },
  { orderNo: "ORD-20240301-005", orderAmount: 1800, feeRate: 10, deduction: 180, netContribution: 1620, date: "2024-03-01 15:45" },
  { orderNo: "ORD-20240301-006", orderAmount: 2200, feeRate: 10, deduction: 220, netContribution: 1980, date: "2024-03-01 16:10" },
  { orderNo: "ORD-20240301-007", orderAmount: 1200, feeRate: 10, deduction: 120, netContribution: 1080, date: "2024-03-01 17:00" },
  { orderNo: "ORD-20240301-008", orderAmount: 1300, feeRate: 10, deduction: 130, netContribution: 1170, date: "2024-03-01 17:30" },
];

const mockWithdrawals: WithdrawalRecord[] = [
  { id: "W001", amount: 88560, requestDate: "2024-03-04", status: "paid", arrivalTime: "2024-03-06 14:00", rejectReason: null, cycle: "S2024-W09" },
  { id: "W002", amount: 101340, requestDate: "2024-02-26", status: "paid", arrivalTime: "2024-02-28 10:30", rejectReason: null, cycle: "S2024-W08" },
  { id: "W003", amount: 45720, requestDate: "2024-03-05", status: "pending", arrivalTime: null, rejectReason: null, cycle: "S2024-M03" },
  { id: "W004", amount: 30000, requestDate: "2024-02-15", status: "rejected", arrivalTime: null, rejectReason: "Insufficient settled balance / 結算餘額不足", cycle: "S2024-M02" },
  { id: "W005", amount: 352800, requestDate: "2024-02-05", status: "approved", arrivalTime: null, rejectReason: null, cycle: "S2024-M01" },
];

const mockBankAccount: BankAccount = {
  bankName: "HSBC",
  accountName: "Bright Dental Clinic Ltd.",
  accountNumber: "****-****-****-5678",
  verified: true,
};

// ─── Component ────────────────────────────────────────────────

const InstitutionFinancePage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [mainTab, setMainTab] = useState("settlements");
  const [periodFilter, setPeriodFilter] = useState<"all" | StatementPeriod>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null);

  // Withdrawal
  
  const [showBindDialog, setShowBindDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(mockBankAccount);
  const [bindForm, setBindForm] = useState({ bankName: "", accountName: "", accountNumber: "" });
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);

  // ── Helpers ──

  const fmt = (n: number) => `HK$${n.toLocaleString()}`;

  const statusBadge = (status: StatementStatus) => {
    const map: Record<StatementStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
      settled: { label: isEn ? "Settled" : "已結算", variant: "default" },
      processing: { label: isEn ? "Processing" : "處理中", variant: "secondary" },
      pending: { label: isEn ? "Pending" : "待結算", variant: "outline" },
    };
    const s = map[status];
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const wStatusBadge = (status: WithdrawalStatus) => {
    const map: Record<WithdrawalStatus, { label: string; icon: React.ElementType; cls: string }> = {
      pending: { label: isEn ? "Pending Review" : "待審核", icon: Clock, cls: "bg-warning/10 text-warning border-warning/30" },
      approved: { label: isEn ? "Approved" : "已批准", icon: CheckCircle2, cls: "bg-primary/10 text-primary border-primary/30" },
      paid: { label: isEn ? "Paid" : "已到賬", icon: CheckCircle2, cls: "bg-primary/10 text-primary border-primary/30" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", icon: XCircle, cls: "bg-destructive/10 text-destructive border-destructive/30" },
    };
    const s = map[status];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
        <s.icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  // ── Filtered statements ──

  const filteredStatements = mockStatements.filter((s) => {
    if (periodFilter !== "all" && s.periodType !== periodFilter) return false;
    if (searchTerm && !s.id.toLowerCase().includes(searchTerm.toLowerCase()) && !s.period.includes(searchTerm)) return false;
    return true;
  });

  // ── Summary ──

  const totalOrderAmt = filteredStatements.reduce((a, s) => a + s.orderAmount, 0);
  const totalFee = filteredStatements.reduce((a, s) => a + s.serviceFee, 0);
  const totalNet = filteredStatements.reduce((a, s) => a + s.netAmount, 0);

  const availableBalance = mockStatements.filter((s) => s.status === "settled").reduce((a, s) => a + s.netAmount, 0) -
    withdrawals.filter((w) => w.status === "paid" || w.status === "approved").reduce((a, w) => a + w.amount, 0);

  // ── Export ──

  const handleExport = () => {
    toast({ title: isEn ? "Export" : "導出", description: isEn ? "Export API key not added yet" : "導出 API 金鑰尚未添加" });
  };

  // ── Withdraw ──

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > availableBalance) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Invalid withdrawal amount" : "無效的提現金額", variant: "destructive" });
      return;
    }
    const newW: WithdrawalRecord = {
      id: `W${Date.now()}`,
      amount: amt,
      requestDate: new Date().toISOString().slice(0, 10),
      status: "pending",
      arrivalTime: null,
      rejectReason: null,
      cycle: isEn ? "Current cycle" : "當前週期",
    };
    setWithdrawals([newW, ...withdrawals]);
    setShowWithdrawDialog(false);
    setWithdrawAmount("");
    toast({ title: isEn ? "Submitted" : "已提交", description: isEn ? "Withdrawal request submitted" : "提現申請已提交" });
  };

  // ── Bind Account ──

  const handleBindAccount = () => {
    if (!bindForm.bankName || !bindForm.accountName || !bindForm.accountNumber) {
      toast({ title: isEn ? "Error" : "錯誤", description: isEn ? "Please fill all fields" : "請填寫所有欄位", variant: "destructive" });
      return;
    }
    setBankAccount({ ...bindForm, accountNumber: `****-****-****-${bindForm.accountNumber.slice(-4)}`, verified: false });
    setShowBindDialog(false);
    setBindForm({ bankName: "", accountName: "", accountNumber: "" });
    toast({ title: isEn ? "Saved" : "已保存", description: isEn ? "Bank account bound (verification pending)" : "銀行帳戶已綁定（待驗證）" });
  };

  // ═══════════════ Statement Detail View ═══════════════

  if (selectedStatement) {
    const s = selectedStatement;
    const orders = mockStatementOrders;
    const totOrd = orders.reduce((a, o) => a + o.orderAmount, 0);
    const totDed = orders.reduce((a, o) => a + o.deduction, 0);
    const totCont = orders.reduce((a, o) => a + o.netContribution, 0);

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <button onClick={() => setSelectedStatement(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          {isEn ? "Back to Statements" : "返回結算列表"}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">{isEn ? "Statement Details" : "結算明細"} — {s.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">{isEn ? "Period" : "週期"}: {s.period}</p>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(s.status)}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              {isEn ? "Export" : "導出"}
            </Button>
          </div>
        </div>

        <ApiPlaceholderNotice service={isEn ? "Statement Export" : "結算導出"} />

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Total Order Amount" : "總訂單金額"}</p>
            <p className="text-xl font-bold text-foreground mt-1">{fmt(totOrd)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Total Service Fee" : "總服務費"}</p>
            <p className="text-xl font-bold text-destructive mt-1">-{fmt(totDed)}</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{isEn ? "Net Settlement" : "淨結算金額"}</p>
            <p className="text-xl font-bold text-primary mt-1">{fmt(totCont)}</p>
          </CardContent></Card>
        </div>

        {/* Orders table */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">{isEn ? "Related Orders" : "相關訂單"}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "Order No." : "訂單號"}</TableHead>
                  <TableHead>{isEn ? "Date" : "日期"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Fee Rate" : "費率"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Deduction" : "扣除"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Net" : "淨額"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.orderNo}>
                    <TableCell className="font-mono text-xs">{o.orderNo}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{o.date}</TableCell>
                    <TableCell className="text-right">{fmt(o.orderAmount)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{o.feeRate}%</TableCell>
                    <TableCell className="text-right text-destructive">-{fmt(o.deduction)}</TableCell>
                    <TableCell className="text-right font-medium">{fmt(o.netContribution)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ═══════════════ Main View ═══════════════

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Financial Management" : "財務管理"}</h1>
        <p className="text-sm text-muted-foreground mt-1">{isEn ? "Settlements, withdrawals & accounts" : "結算、提現及帳戶管理"}</p>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="settlements" className="gap-1.5"><FileText className="h-3.5 w-3.5" />{isEn ? "Settlements" : "結算"}</TabsTrigger>
          <TabsTrigger value="withdrawals" className="gap-1.5"><Wallet className="h-3.5 w-3.5" />{isEn ? "Withdrawals" : "提現"}</TabsTrigger>
        </TabsList>

        {/* ─── Settlements Tab ─── */}
        <TabsContent value="settlements" className="space-y-6 mt-4">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: isEn ? "Total Orders" : "總訂單金額", value: fmt(totalOrderAmt), icon: DollarSign, color: "text-foreground" },
              { label: isEn ? "Platform Fees" : "平台服務費", value: `-${fmt(totalFee)}`, icon: ArrowDownRight, color: "text-destructive" },
              { label: isEn ? "Net Settlement" : "淨結算金額", value: fmt(totalNet), icon: ArrowUpRight, color: "text-primary" },
            ].map((c, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <c.icon className={`h-5 w-5 ${c.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{c.value}</p>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search statement ID or period…" : "搜尋結算單號或週期…"} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as any)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Periods" : "所有週期"}</SelectItem>
                <SelectItem value="daily">{isEn ? "Daily" : "每日"}</SelectItem>
                <SelectItem value="weekly">{isEn ? "Weekly" : "每週"}</SelectItem>
                <SelectItem value="monthly">{isEn ? "Monthly" : "每月"}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />{isEn ? "Export" : "導出"}</Button>
          </div>

          <ApiPlaceholderNotice service={isEn ? "Statement Export" : "結算導出"} />

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isEn ? "Statement ID" : "結算單號"}</TableHead>
                    <TableHead>{isEn ? "Period" : "週期"}</TableHead>
                    <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Orders" : "訂單金額"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Fee" : "服務費"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Net" : "淨額"}</TableHead>
                    <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStatements.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">{isEn ? "No statements found" : "未找到結算記錄"}</TableCell></TableRow>
                  ) : filteredStatements.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="text-sm">{s.period}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {s.periodType === "daily" ? (isEn ? "Daily" : "日") : s.periodType === "weekly" ? (isEn ? "Weekly" : "週") : (isEn ? "Monthly" : "月")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{fmt(s.orderAmount)}</TableCell>
                      <TableCell className="text-right text-destructive">-{fmt(s.serviceFee)}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(s.netAmount)}</TableCell>
                      <TableCell>{statusBadge(s.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStatement(s)}><Eye className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Withdrawals Tab ─── */}
        <TabsContent value="withdrawals" className="space-y-6 mt-4">
          {/* Balance & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{isEn ? "Available Balance" : "可提現餘額"}</p>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold text-primary">{fmt(Math.max(0, availableBalance))}</p>
                <Button className="mt-4 w-full" onClick={() => setShowWithdrawDialog(true)} disabled={availableBalance <= 0}>
                  <BanknoteIcon className="h-4 w-4 mr-1" />
                  {isEn ? "Initiate Withdrawal" : "發起提現"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{isEn ? "Withdrawal Account" : "提現帳戶"}</p>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                {bankAccount ? (
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{bankAccount.bankName}</p>
                    <p className="text-xs text-muted-foreground">{bankAccount.accountName}</p>
                    <p className="text-xs font-mono text-muted-foreground">{bankAccount.accountNumber}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {bankAccount.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" />{isEn ? "Verified" : "已驗證"}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-warning"><AlertCircle className="h-3 w-3" />{isEn ? "Pending Verification" : "待驗證"}</span>
                      )}
                      <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowBindDialog(true)}>
                        {isEn ? "Change" : "更改"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full mt-2" onClick={() => setShowBindDialog(true)}>
                    <CreditCard className="h-4 w-4 mr-1" />
                    {isEn ? "Bind Account" : "綁定帳戶"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          <ApiPlaceholderNotice service={isEn ? "Bank Account Verification" : "銀行帳戶驗證"} />

          {/* Records */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{isEn ? "Withdrawal Records" : "提現記錄"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isEn ? "Amount" : "金額"}</TableHead>
                    <TableHead>{isEn ? "Request Date" : "申請日期"}</TableHead>
                    <TableHead>{isEn ? "Cycle" : "結算週期"}</TableHead>
                    <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                    <TableHead>{isEn ? "Arrival" : "到賬時間"}</TableHead>
                    <TableHead>{isEn ? "Remark" : "備註"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{isEn ? "No records" : "暫無記錄"}</TableCell></TableRow>
                  ) : withdrawals.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{fmt(w.amount)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{w.requestDate}</TableCell>
                      <TableCell className="font-mono text-xs">{w.cycle}</TableCell>
                      <TableCell>{wStatusBadge(w.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{w.arrivalTime || "—"}</TableCell>
                      <TableCell className="text-xs text-destructive">{w.rejectReason || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── Bind Account Dialog ─── */}
      <Dialog open={showBindDialog} onOpenChange={setShowBindDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEn ? "Bind Withdrawal Account" : "綁定提現帳戶"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <ApiPlaceholderNotice service={isEn ? "Bank Verification" : "銀行驗證"} />
            <div className="space-y-2">
              <Label>{isEn ? "Bank Name" : "銀行名稱"}</Label>
              <Input value={bindForm.bankName} onChange={(e) => setBindForm({ ...bindForm, bankName: e.target.value })} placeholder="e.g. HSBC" />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Account Name" : "帳戶名稱"}</Label>
              <Input value={bindForm.accountName} onChange={(e) => setBindForm({ ...bindForm, accountName: e.target.value })} placeholder={isEn ? "Company name" : "公司名稱"} />
            </div>
            <div className="space-y-2">
              <Label>{isEn ? "Account Number" : "帳戶號碼"}</Label>
              <Input value={bindForm.accountNumber} onChange={(e) => setBindForm({ ...bindForm, accountNumber: e.target.value })} placeholder="000-000000-000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBindDialog(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleBindAccount}>{isEn ? "Bind Account" : "綁定帳戶"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Withdraw Dialog ─── */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEn ? "Initiate Withdrawal" : "發起提現"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">{isEn ? "Available Balance" : "可提現餘額"}</p>
              <p className="text-lg font-bold text-primary">{fmt(Math.max(0, availableBalance))}</p>
            </div>
            {bankAccount && (
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">{isEn ? "Withdrawal Account" : "提現帳戶"}</p>
                <p className="text-sm font-medium text-foreground">{bankAccount.bankName} · {bankAccount.accountNumber}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>{isEn ? "Withdrawal Amount (HK$)" : "提現金額 (HK$)"}</Label>
              <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0" min={1} max={availableBalance} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleWithdraw}>{isEn ? "Submit" : "提交"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionFinancePage;
