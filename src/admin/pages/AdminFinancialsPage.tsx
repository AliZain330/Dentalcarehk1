import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import AdminMetricCard from "../components/AdminMetricCard";
import { Wallet, TrendingUp, Percent } from "lucide-react";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const mockSettlements = [
  { id: "STL-001", institution: "Bright Smile Dental", period: "2026-02", gross: 840000, fee: 84000, net: 756000, status: "settled" },
  { id: "STL-002", institution: "Happy Teeth Clinic", period: "2026-02", gross: 760000, fee: 76000, net: 684000, status: "settled" },
  { id: "STL-003", institution: "Central Dental Hospital", period: "2026-02", gross: 930000, fee: 93000, net: 837000, status: "pending" },
  { id: "STL-004", institution: "Tsim Sha Tsui Dental", period: "2026-03", gross: 580000, fee: 58000, net: 522000, status: "pending" },
];

const AdminFinancialsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Financials" : "財務管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Revenue and settlements" : "收入及結算"}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => toast.info(isEn ? "Export API key not added yet" : "導出 API 金鑰尚未添加")}>
          <Download className="h-4 w-4" />{isEn ? "Export" : "導出"}
        </Button>
      </div>

      <ApiPlaceholderNotice service={isEn ? "Financial Export" : "財務導出"} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminMetricCard icon={Wallet} label={isEn ? "Month Revenue" : "本月收入"} value="HK$7.2M" trend={{ value: "+15.2%", positive: true }} />
        <AdminMetricCard icon={Percent} label={isEn ? "Platform Fees" : "平台服務費"} value="HK$720K" subLabel={isEn ? "10% service fee" : "10% 服務費"} />
        <AdminMetricCard icon={TrendingUp} label={isEn ? "Settled" : "已結算"} value="HK$1.44M" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Settlement Records" : "結算記錄"}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "ID" : "編號"}</TableHead>
                <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                <TableHead>{isEn ? "Period" : "週期"}</TableHead>
                <TableHead className="text-right">{isEn ? "Gross" : "總額"}</TableHead>
                <TableHead className="text-right">{isEn ? "Fee" : "服務費"}</TableHead>
                <TableHead className="text-right">{isEn ? "Net" : "淨額"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSettlements.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell>{s.institution}</TableCell>
                  <TableCell>{s.period}</TableCell>
                  <TableCell className="text-right">HK${s.gross.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive">-HK${s.fee.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">HK${s.net.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${s.status === "settled" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {s.status === "settled" ? (isEn ? "Settled" : "已結算") : (isEn ? "Pending" : "待結算")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinancialsPage;
