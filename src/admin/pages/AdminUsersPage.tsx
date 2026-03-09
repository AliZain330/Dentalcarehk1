import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Chan Tai Man", phone: "+852 9123 4567", orders: 12, spent: 24000, joined: "2025-08-15", status: "active" },
  { id: "2", name: "Wong Siu Ming", phone: "+852 9234 5678", orders: 8, spent: 16000, joined: "2025-10-02", status: "active" },
  { id: "3", name: "Lee Ka Yan", phone: "+852 9345 6789", orders: 3, spent: 6000, joined: "2026-01-12", status: "active" },
  { id: "4", name: "Lam Mei Ling", phone: "+852 9456 7890", orders: 0, spent: 0, joined: "2026-03-01", status: "inactive" },
  { id: "5", name: "Ho Wing Kei", phone: "+852 9567 8901", orders: 5, spent: 10000, joined: "2025-12-20", status: "suspended" },
];

const AdminUsersPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      active: { label: isEn ? "Active" : "活躍", variant: "default" },
      inactive: { label: isEn ? "Inactive" : "不活躍", variant: "secondary" },
      suspended: { label: isEn ? "Suspended" : "已暫停", variant: "destructive" },
    };
    const cfg = map[s] || map.inactive;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Users" : "用戶管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Manage platform users" : "管理平台用戶"}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={isEn ? "Search users..." : "搜索用戶..."} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Name" : "姓名"}</TableHead>
                <TableHead>{isEn ? "Phone" : "電話"}</TableHead>
                <TableHead className="text-center">{isEn ? "Orders" : "訂單"}</TableHead>
                <TableHead className="text-right">{isEn ? "Total Spent" : "總消費"}</TableHead>
                <TableHead>{isEn ? "Joined" : "註冊日期"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell className="text-center">{u.orders}</TableCell>
                  <TableCell className="text-right">HK${u.spent.toLocaleString()}</TableCell>
                  <TableCell>{u.joined}</TableCell>
                  <TableCell className="text-center">{statusBadge(u.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
