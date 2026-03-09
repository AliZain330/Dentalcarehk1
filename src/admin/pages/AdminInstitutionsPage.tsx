import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building2 } from "lucide-react";

const mockInstitutions = [
  { id: "1", name: "Bright Smile Dental Centre", region: "Central", doctors: 12, status: "approved", orders: 420 },
  { id: "2", name: "Happy Teeth Clinic", region: "Tsim Sha Tsui", doctors: 8, status: "approved", orders: 380 },
  { id: "3", name: "Central Dental Hospital", region: "Wan Chai", doctors: 15, status: "approved", orders: 310 },
  { id: "4", name: "New Smile Dental", region: "Mong Kok", doctors: 5, status: "pending", orders: 0 },
  { id: "5", name: "Pearl Dental Care", region: "Sha Tin", doctors: 6, status: "rejected", orders: 0 },
];

const AdminInstitutionsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      approved: { label: isEn ? "Approved" : "已批准", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
      rejected: { label: isEn ? "Rejected" : "已拒絕", variant: "destructive" },
    };
    const cfg = map[s] || map.pending;
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Institutions" : "機構管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Manage platform institutions" : "管理平台機構"}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={isEn ? "Search institutions..." : "搜索機構..."} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Institution" : "機構名稱"}</TableHead>
                <TableHead>{isEn ? "Region" : "地區"}</TableHead>
                <TableHead className="text-center">{isEn ? "Doctors" : "醫生"}</TableHead>
                <TableHead className="text-center">{isEn ? "Orders" : "訂單"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInstitutions.map((inst) => (
                <TableRow key={inst.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{inst.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{inst.region}</TableCell>
                  <TableCell className="text-center">{inst.doctors}</TableCell>
                  <TableCell className="text-center">{inst.orders}</TableCell>
                  <TableCell className="text-center">{statusBadge(inst.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInstitutionsPage;
