import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mockDoctors = [
  { id: "1", name: "Dr. Sarah Chen", institution: "Bright Smile Dental", specialty: "Orthodontics", rating: 4.8, orders: 142, status: "active" },
  { id: "2", name: "Dr. Michael Wong", institution: "Happy Teeth Clinic", specialty: "Implants", rating: 4.9, orders: 98, status: "active" },
  { id: "3", name: "Dr. Emily Lau", institution: "Central Dental Hospital", specialty: "General", rating: 4.7, orders: 210, status: "active" },
  { id: "4", name: "Dr. James Lee", institution: "N/A", specialty: "Cosmetic", rating: 0, orders: 0, status: "pending" },
  { id: "5", name: "Dr. Alice Yip", institution: "Pearl Dental Care", specialty: "Pediatric", rating: 4.5, orders: 67, status: "suspended" },
];

const AdminDoctorsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      active: { label: isEn ? "Active" : "活躍", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
      suspended: { label: isEn ? "Suspended" : "已暫停", variant: "destructive" },
    };
    const cfg = map[s] || map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Doctors" : "醫生管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Manage platform doctors" : "管理平台醫生"}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={isEn ? "Search doctors..." : "搜索醫生..."} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                <TableHead>{isEn ? "Institution" : "所屬機構"}</TableHead>
                <TableHead>{isEn ? "Specialty" : "專科"}</TableHead>
                <TableHead className="text-center">{isEn ? "Rating" : "評分"}</TableHead>
                <TableHead className="text-center">{isEn ? "Orders" : "訂單"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDoctors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">{d.name.split(" ").pop()?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{d.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{d.institution}</TableCell>
                  <TableCell>{d.specialty}</TableCell>
                  <TableCell className="text-center">{d.rating > 0 ? `⭐ ${d.rating}` : "—"}</TableCell>
                  <TableCell className="text-center">{d.orders}</TableCell>
                  <TableCell className="text-center">{statusBadge(d.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctorsPage;
