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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Building2, MoreHorizontal, Eye, Pencil, Ban, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { adminInstitutions, type AdminInstitution } from "../data/adminInstitutionData";
import AdminMetricCard from "../components/AdminMetricCard";
import { toast } from "sonner";

type StatusFilter = "all" | "approved" | "pending" | "rejected" | "disabled";

const AdminInstitutionsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [institutions, setInstitutions] = useState<AdminInstitution[]>(adminInstitutions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminInstitution | null>(null);

  const regions = useMemo(() => [...new Set(institutions.map((i) => i.region))], [institutions]);

  const filtered = useMemo(() => {
    return institutions.filter((inst) => {
      if (statusFilter !== "all" && inst.status !== statusFilter) return false;
      if (regionFilter !== "all" && inst.region !== regionFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return inst.name.toLowerCase().includes(q) || inst.id.toLowerCase().includes(q) || inst.nameZh.includes(q);
      }
      return true;
    });
  }, [institutions, statusFilter, regionFilter, search]);

  const pendingCount = institutions.filter((i) => i.status === "pending").length;

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      approved: { label: isEn ? "Approved" : "已批准", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", variant: "destructive" },
      disabled: { label: isEn ? "Disabled" : "已停用", variant: "outline" },
    };
    const cfg = map[s] || map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  const credBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      approved: { label: isEn ? "Verified" : "已驗證", variant: "default" },
      pending: { label: isEn ? "Under Review" : "審核中", variant: "secondary" },
      rejected: { label: isEn ? "Failed" : "未通過", variant: "destructive" },
      not_submitted: { label: isEn ? "Not Submitted" : "未提交", variant: "outline" },
    };
    const cfg = map[s] || map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  const handleToggleStatus = (inst: AdminInstitution) => {
    const newStatus = inst.status === "disabled" ? "approved" : "disabled";
    setInstitutions((prev) => prev.map((i) => (i.id === inst.id ? { ...i, status: newStatus } : i)));
    toast.success(isEn
      ? `${inst.name} has been ${newStatus === "disabled" ? "disabled" : "enabled"}`
      : `${inst.nameZh} 已${newStatus === "disabled" ? "停用" : "啟用"}`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.orders > 0) {
      toast.error(isEn
        ? `Cannot delete "${deleteTarget.name}" — it has ${deleteTarget.orders} orders`
        : `無法刪除「${deleteTarget.nameZh}」— 已有 ${deleteTarget.orders} 個訂單`);
      setDeleteTarget(null);
      return;
    }
    setInstitutions((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    toast.success(isEn ? "Institution deleted" : "機構已刪除");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Institution Management" : "機構管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Manage all platform institutions" : "管理所有平台機構"}</p>
        </div>
        {pendingCount > 0 && (
          <Button onClick={() => navigate("/admin/institutions/reviews")} className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            {isEn ? `${pendingCount} Pending Review` : `${pendingCount} 個待審核`}
          </Button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={Building2} label={isEn ? "Total" : "總數"} value={institutions.length} />
        <AdminMetricCard icon={CheckCircle} label={isEn ? "Active" : "活躍"} value={institutions.filter((i) => i.status === "approved").length} />
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Pending" : "待審核"} value={pendingCount} />
        <AdminMetricCard icon={Ban} label={isEn ? "Disabled" : "已停用"} value={institutions.filter((i) => i.status === "disabled").length} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search by name or ID..." : "按名稱或 ID 搜索..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">{isEn ? "All" : "全部"}</TabsTrigger>
            <TabsTrigger value="approved">{isEn ? "Approved" : "已批准"}</TabsTrigger>
            <TabsTrigger value="pending">{isEn ? "Pending" : "待審核"}</TabsTrigger>
            <TabsTrigger value="rejected">{isEn ? "Rejected" : "已拒絕"}</TabsTrigger>
            <TabsTrigger value="disabled">{isEn ? "Disabled" : "已停用"}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder={isEn ? "Region" : "地區"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Regions" : "全部地區"}</SelectItem>
            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{isEn ? "No institutions found" : "未找到機構"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{isEn ? "ID" : "編號"}</TableHead>
                  <TableHead>{isEn ? "Institution" : "機構名稱"}</TableHead>
                  <TableHead>{isEn ? "Credentials" : "資質狀態"}</TableHead>
                  <TableHead>{isEn ? "Onboarded" : "入駐日期"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Orders" : "訂單"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Revenue" : "交易額"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inst) => (
                  <TableRow key={inst.id} className="cursor-pointer" onClick={() => navigate(`/admin/institutions/${inst.id}`)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{inst.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{isEn ? inst.name : inst.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{inst.region}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{credBadge(inst.credentialStatus)}</TableCell>
                    <TableCell className="text-sm">{inst.onboardingDate}</TableCell>
                    <TableCell className="text-center">{inst.orders.toLocaleString()}</TableCell>
                    <TableCell className="text-right">HK${inst.transactionAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{statusBadge(inst.status)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/institutions/${inst.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />{isEn ? "View Details" : "查看詳情"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/institutions/${inst.id}`)}>
                            <Pencil className="h-4 w-4 mr-2" />{isEn ? "Edit" : "編輯"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {inst.status !== "pending" && (
                            <DropdownMenuItem onClick={() => handleToggleStatus(inst)}>
                              {inst.status === "disabled" ? (
                                <><CheckCircle className="h-4 w-4 mr-2" />{isEn ? "Enable" : "啟用"}</>
                              ) : (
                                <><Ban className="h-4 w-4 mr-2" />{isEn ? "Disable" : "停用"}</>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(inst)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />{isEn ? "Delete" : "刪除"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget && deleteTarget.orders > 0
                ? (isEn ? "Deletion Blocked" : "無法刪除")
                : (isEn ? "Delete Institution" : "刪除機構")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && deleteTarget.orders > 0 ? (
                <span className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <span>
                    {isEn
                      ? `"${deleteTarget.name}" has ${deleteTarget.orders} orders and HK$${deleteTarget.transactionAmount.toLocaleString()} in transactions. Institutions with existing orders cannot be deleted. You can disable the account instead.`
                      : `「${deleteTarget.nameZh}」已有 ${deleteTarget.orders} 個訂單及 HK$${deleteTarget.transactionAmount.toLocaleString()} 交易額。有訂單的機構無法刪除，您可以改為停用帳戶。`}
                  </span>
                </span>
              ) : (
                isEn
                  ? `Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`
                  : `確定要永久刪除「${deleteTarget?.nameZh}」嗎？此操作無法撤銷。`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isEn ? "Cancel" : "取消"}</AlertDialogCancel>
            {deleteTarget && deleteTarget.orders > 0 ? (
              <AlertDialogAction onClick={() => { handleToggleStatus(deleteTarget); setDeleteTarget(null); }}>
                {isEn ? "Disable Instead" : "改為停用"}
              </AlertDialogAction>
            ) : (
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isEn ? "Delete" : "刪除"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminInstitutionsPage;
