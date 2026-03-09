import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Eye, Ban, CheckCircle, Users, Wallet, ClipboardList } from "lucide-react";
import { adminUsers, type AdminUser } from "../data/adminUserData";
import AdminMetricCard from "../components/AdminMetricCard";
import { toast } from "sonner";

type StatusFilter = "all" | "active" | "disabled";

const AdminUsersPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q) || u.nameZh.includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [users, statusFilter, search]);

  const handleToggle = (user: AdminUser) => {
    const ns = user.status === "disabled" ? "active" : "disabled";
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: ns as AdminUser["status"] } : u));
    toast.success(isEn ? `${user.name} ${ns === "disabled" ? "disabled" : "enabled"}` : `${user.nameZh} 已${ns === "disabled" ? "停用" : "啟用"}`);
  };

  const totalSpent = users.reduce((s, u) => s + u.totalSpent, 0);
  const totalOrders = users.reduce((s, u) => s + u.totalOrders, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "User Management" : "用戶管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Manage all platform users" : "管理所有平台用戶"}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={Users} label={isEn ? "Total Users" : "總用戶"} value={users.length} />
        <AdminMetricCard icon={CheckCircle} label={isEn ? "Active" : "活躍"} value={users.filter((u) => u.status === "active").length} />
        <AdminMetricCard icon={ClipboardList} label={isEn ? "Total Orders" : "總訂單"} value={totalOrders.toLocaleString()} />
        <AdminMetricCard icon={Wallet} label={isEn ? "Total Spent" : "總消費"} value={`HK$${totalSpent.toLocaleString()}`} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search by name, phone, email..." : "按姓名、電話、電郵搜索..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">{isEn ? "All" : "全部"}</TabsTrigger>
            <TabsTrigger value="active">{isEn ? "Active" : "活躍"}</TabsTrigger>
            <TabsTrigger value="disabled">{isEn ? "Disabled" : "已停用"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{isEn ? "No users found" : "未找到用戶"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{isEn ? "ID" : "編號"}</TableHead>
                  <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                  <TableHead>{isEn ? "Phone" : "電話"}</TableHead>
                  <TableHead>{isEn ? "Email" : "電郵"}</TableHead>
                  <TableHead>{isEn ? "Registered" : "註冊日期"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Orders" : "訂單"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Spent" : "消費"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer" onClick={() => navigate(`/admin/users/${user.id}`)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{user.avatar}</AvatarFallback></Avatar>
                        <span className="font-medium text-sm">{isEn ? user.name : user.nameZh}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell className="text-sm">{user.registeredAt}</TableCell>
                    <TableCell className="text-center">{user.totalOrders}</TableCell>
                    <TableCell className="text-right">HK${user.totalSpent.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={user.status === "active" ? "default" : "outline"}>
                        {user.status === "active" ? (isEn ? "Active" : "活躍") : (isEn ? "Disabled" : "已停用")}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}><Eye className="h-4 w-4 mr-2" />{isEn ? "View Details" : "查看詳情"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggle(user)}>
                            {user.status === "disabled" ? <><CheckCircle className="h-4 w-4 mr-2" />{isEn ? "Enable" : "啟用"}</> : <><Ban className="h-4 w-4 mr-2" />{isEn ? "Disable" : "停用"}</>}
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
    </div>
  );
};

export default AdminUsersPage;
