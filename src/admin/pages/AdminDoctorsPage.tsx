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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreHorizontal, Eye, Ban, CheckCircle, Stethoscope, AlertTriangle, Star } from "lucide-react";
import { adminDoctors, type AdminDoctor } from "../data/adminDoctorData";
import AdminMetricCard from "../components/AdminMetricCard";
import { toast } from "sonner";

type StatusFilter = "all" | "active" | "pending" | "disabled";

const AdminDoctorsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";

  const [doctors, setDoctors] = useState<AdminDoctor[]>(adminDoctors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [credFilter, setCredFilter] = useState("all");

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (credFilter !== "all" && d.credentialStatus !== credFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.nameZh.includes(q) || d.institution.toLowerCase().includes(q);
      }
      return true;
    });
  }, [doctors, statusFilter, credFilter, search]);

  const pendingCount = doctors.filter((d) => d.credentialStatus === "pending").length;

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: isEn ? "Active" : "活躍", variant: "default" },
      pending: { label: isEn ? "Pending" : "待審核", variant: "secondary" },
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

  const handleToggle = (doc: AdminDoctor) => {
    const newStatus = doc.status === "disabled" ? "active" : "disabled";
    setDoctors((prev) => prev.map((d) => d.id === doc.id ? { ...d, status: newStatus as AdminDoctor["status"] } : d));
    toast.success(isEn ? `${doc.name} ${newStatus === "disabled" ? "disabled" : "enabled"}` : `${doc.nameZh} 已${newStatus === "disabled" ? "停用" : "啟用"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Doctor Management" : "醫生管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Manage all platform doctors" : "管理所有平台醫生"}</p>
        </div>
        {pendingCount > 0 && (
          <Button onClick={() => navigate("/admin/doctors/reviews")} className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            {isEn ? `${pendingCount} Pending Review` : `${pendingCount} 個待審核`}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricCard icon={Stethoscope} label={isEn ? "Total" : "總數"} value={doctors.length} />
        <AdminMetricCard icon={CheckCircle} label={isEn ? "Active" : "活躍"} value={doctors.filter((d) => d.status === "active").length} />
        <AdminMetricCard icon={AlertTriangle} label={isEn ? "Pending" : "待審核"} value={pendingCount} />
        <AdminMetricCard icon={Star} label={isEn ? "Avg Rating" : "平均評分"} value={(doctors.filter((d) => d.rating > 0).reduce((s, d) => s + d.rating, 0) / (doctors.filter((d) => d.rating > 0).length || 1)).toFixed(1)} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search by name, ID, or institution..." : "按名稱、ID 或機構搜索..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">{isEn ? "All" : "全部"}</TabsTrigger>
            <TabsTrigger value="active">{isEn ? "Active" : "活躍"}</TabsTrigger>
            <TabsTrigger value="pending">{isEn ? "Pending" : "待審核"}</TabsTrigger>
            <TabsTrigger value="disabled">{isEn ? "Disabled" : "已停用"}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={credFilter} onValueChange={setCredFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder={isEn ? "Credentials" : "資質"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Credentials" : "全部資質"}</SelectItem>
            <SelectItem value="approved">{isEn ? "Verified" : "已驗證"}</SelectItem>
            <SelectItem value="pending">{isEn ? "Under Review" : "審核中"}</SelectItem>
            <SelectItem value="rejected">{isEn ? "Failed" : "未通過"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Stethoscope className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">{isEn ? "No doctors found" : "未找到醫生"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{isEn ? "ID" : "編號"}</TableHead>
                  <TableHead>{isEn ? "Doctor" : "醫生"}</TableHead>
                  <TableHead>{isEn ? "Institution" : "所屬機構"}</TableHead>
                  <TableHead>{isEn ? "Credentials" : "資質"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Consults" : "問診"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Rating" : "評分"}</TableHead>
                  <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} className="cursor-pointer" onClick={() => navigate(`/admin/doctors/${doc.id}`)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{doc.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">{doc.name.split(" ").pop()?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{isEn ? doc.name : doc.nameZh}</p>
                          <p className="text-xs text-muted-foreground">{doc.specialties.join(", ")}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{isEn ? doc.institution : doc.institutionZh}</TableCell>
                    <TableCell>{credBadge(doc.credentialStatus)}</TableCell>
                    <TableCell className="text-center">{doc.consultations}</TableCell>
                    <TableCell className="text-center">{doc.rating > 0 ? <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{doc.rating}</span> : "—"}</TableCell>
                    <TableCell className="text-center">{statusBadge(doc.status)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/doctors/${doc.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />{isEn ? "View Details" : "查看詳情"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggle(doc)}>
                            {doc.status === "disabled"
                              ? <><CheckCircle className="h-4 w-4 mr-2" />{isEn ? "Enable" : "啟用"}</>
                              : <><Ban className="h-4 w-4 mr-2" />{isEn ? "Disable" : "停用"}</>}
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

export default AdminDoctorsPage;
