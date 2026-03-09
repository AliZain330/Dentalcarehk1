import React, { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, UserCog, PencilLine, Ban, CheckCircle2 } from "lucide-react";
import SystemSettingsNav from "@/admin/components/settings/SystemSettingsNav";
import SettingsStatusBadge from "@/admin/components/settings/SettingsStatusBadge";
import {
  adminAccounts as defaultAdminAccounts,
  adminRoles,
  type AdminAccount,
  type AdminRoleKey,
} from "@/admin/data/adminSystemSettingsData";
import { toast } from "sonner";

type AccountStatusFilter = "all" | "enabled" | "disabled";

const emptyForm = {
  name: "",
  nameZh: "",
  role: "operations" as AdminRoleKey,
  email: "",
};

const AdminSystemAdminAccountsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [accounts, setAccounts] = useState<AdminAccount[]>(defaultAdminAccounts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminRoleKey>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleLabel = (role: AdminRoleKey) => {
    const found = adminRoles.find((item) => item.key === role);
    return isEn ? found?.label : found?.labelZh;
  };

  const filtered = useMemo(() => {
    return accounts.filter((account) => {
      if (statusFilter !== "all" && account.status !== statusFilter) return false;
      if (roleFilter !== "all" && account.role !== roleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          account.name.toLowerCase().includes(q) ||
          account.nameZh.includes(q) ||
          account.id.toLowerCase().includes(q) ||
          account.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [accounts, roleFilter, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (account: AdminAccount) => {
    setEditingId(account.id);
    setForm({
      name: account.name,
      nameZh: account.nameZh,
      role: account.role,
      email: account.email,
    });
    setDialogOpen(true);
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.nameZh.trim()) {
      toast.error(isEn ? "English and Chinese names are required" : "中英文名稱均為必填");
      return false;
    }
    if (!form.email.includes("@")) {
      toast.error(isEn ? "Please enter a valid email" : "請輸入有效電郵");
      return false;
    }
    return true;
  };

  const saveAccount = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      if (editingId) {
        setAccounts((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)),
        );
        toast.success(isEn ? "Admin account updated" : "管理員帳號已更新");
      } else {
        const id = `ADM-${1000 + accounts.length + 1}`;
        setAccounts((prev) => [
          {
            id,
            ...form,
            status: "enabled",
            createdAt: new Date().toLocaleString("en-GB", { hour12: false }),
          },
          ...prev,
        ]);
        toast.success(isEn ? "Admin account created" : "管理員帳號已建立");
      }
      setDialogOpen(false);
      setIsSubmitting(false);
    }, 450);
  };

  const toggleStatus = (account: AdminAccount) => {
    setIsLoading(true);
    const nextStatus = account.status === "enabled" ? "disabled" : "enabled";
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((item) => (item.id === account.id ? { ...item, status: nextStatus } : item)),
      );
      toast.success(
        isEn
          ? `${account.name} ${nextStatus === "enabled" ? "enabled" : "disabled"}`
          : `${account.nameZh} 已${nextStatus === "enabled" ? "啟用" : "停用"}`,
      );
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "System Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEn ? "Manage platform administration accounts and roles" : "管理平台後台帳號及角色"}
        </p>
      </div>

      <SystemSettingsNav />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEn ? "Admin Account Management" : "管理員帳號管理"}</CardTitle>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {isEn ? "Create Admin" : "建立管理員"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
                placeholder={isEn ? "Search account..." : "搜索帳號..."}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AccountStatusFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Statuses" : "全部狀態"}</SelectItem>
                <SelectItem value="enabled">{isEn ? "Enabled" : "已啟用"}</SelectItem>
                <SelectItem value="disabled">{isEn ? "Disabled" : "已停用"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as "all" | AdminRoleKey)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Roles" : "全部角色"}</SelectItem>
                {adminRoles.map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    {isEn ? role.label : role.labelZh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  {isEn ? "Updating..." : "更新中..."}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <UserCog className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {isEn ? "No admin account found" : "未找到管理員帳號"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isEn ? "Admin Name" : "管理員姓名"}</TableHead>
                      <TableHead>{isEn ? "Role" : "角色"}</TableHead>
                      <TableHead>{isEn ? "Email" : "電郵"}</TableHead>
                      <TableHead>{isEn ? "Created Time" : "建立時間"}</TableHead>
                      <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                      <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{isEn ? account.name : account.nameZh}</p>
                            <p className="text-xs text-muted-foreground">{account.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{roleLabel(account.role)}</Badge>
                        </TableCell>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>{account.createdAt}</TableCell>
                        <TableCell>
                          <SettingsStatusBadge status={account.status} />
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          <Button variant="outline" size="sm" onClick={() => openEdit(account)} className="gap-1">
                            <PencilLine className="h-3.5 w-3.5" />
                            {isEn ? "Edit" : "編輯"}
                          </Button>
                          <Button
                            variant={account.status === "enabled" ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleStatus(account)}
                            className="gap-1"
                          >
                            {account.status === "enabled" ? (
                              <>
                                <Ban className="h-3.5 w-3.5" />
                                {isEn ? "Disable" : "停用"}
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {isEn ? "Enable" : "啟用"}
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? (isEn ? "Edit Admin Account" : "編輯管理員帳號") : (isEn ? "Create Admin Account" : "建立管理員帳號")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "Admin Name (EN)" : "管理員名稱（英文）"}</label>
              <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "Admin Name (ZH)" : "管理員名稱（中文）"}</label>
              <Input value={form.nameZh} onChange={(event) => setForm((prev) => ({ ...prev, nameZh: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "Role" : "角色"}</label>
              <Select value={form.role} onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as AdminRoleKey }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles.map((role) => (
                    <SelectItem key={role.key} value={role.key}>
                      {isEn ? role.label : role.labelZh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "Email" : "電郵"}</label>
              <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {isEn ? "Cancel" : "取消"}
            </Button>
            <Button onClick={saveAccount} disabled={isSubmitting}>
              {isSubmitting ? (isEn ? "Saving..." : "儲存中...") : (isEn ? "Save" : "儲存")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSystemAdminAccountsPage;
