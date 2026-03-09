import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const mockOrders = [
  { id: "ORD-20260309-001", user: "Chan Tai Man", institution: "Bright Smile Dental", type: "in_clinic", amount: 2000, date: "2026-03-09", status: "completed" },
  { id: "ORD-20260309-002", user: "Wong Siu Ming", institution: "Happy Teeth Clinic", type: "in_clinic", amount: 1500, date: "2026-03-09", status: "confirmed" },
  { id: "OC-20260309-001", user: "Lee Ka Yan", institution: "Online", type: "consultation", amount: 200, date: "2026-03-09", status: "in_consultation" },
  { id: "ORD-20260308-001", user: "Lam Mei Ling", institution: "Central Dental", type: "in_clinic", amount: 3500, date: "2026-03-08", status: "cancelled" },
  { id: "OC-20260308-002", user: "Ho Wing Kei", institution: "Online", type: "consultation", amount: 300, date: "2026-03-08", status: "completed" },
];

const AdminOrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? mockOrders : mockOrders.filter((o) => o.type === tab);

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      completed: { label: isEn ? "Completed" : "已完成", variant: "default" },
      confirmed: { label: isEn ? "Confirmed" : "已確認", variant: "secondary" },
      in_consultation: { label: isEn ? "In Progress" : "進行中", variant: "outline" },
      cancelled: { label: isEn ? "Cancelled" : "已取消", variant: "destructive" },
    };
    const cfg = map[s] || { label: s, variant: "secondary" as const };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Orders" : "訂單管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Manage all platform orders" : "管理所有平台訂單"}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search orders..." : "搜索訂單..."} className="pl-9" />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">{isEn ? "All" : "全部"}</TabsTrigger>
            <TabsTrigger value="in_clinic">{isEn ? "In-Clinic" : "到店"}</TabsTrigger>
            <TabsTrigger value="consultation">{isEn ? "Consultation" : "問診"}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Order ID" : "訂單號"}</TableHead>
                <TableHead>{isEn ? "User" : "用戶"}</TableHead>
                <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                <TableHead>{isEn ? "Date" : "日期"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell>{o.user}</TableCell>
                  <TableCell>{o.institution}</TableCell>
                  <TableCell className="text-right">HK${o.amount.toLocaleString()}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell className="text-center">{statusBadge(o.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
