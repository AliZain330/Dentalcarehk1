import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2 } from "lucide-react";
import { mockSettlements } from "../data/adminFinancialData";
import AdminStatusBadge from "@/admin/components/AdminStatusBadge";

const AdminSettlementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === "en";

  const settlement = mockSettlements.find((s) => s.id === id);

  if (!settlement) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Building2 className="h-10 w-10 mb-3" />
        <p>{isEn ? "Settlement not found" : "未找到結算記錄"}</p>
        <Button variant="link" onClick={() => navigate("/admin/financials")}>{isEn ? "Back" : "返回"}</Button>
      </div>
    );
  }

  const Row = ({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) => (
    <div className="flex justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm ${highlight ? "font-bold text-foreground" : "font-medium text-foreground"}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/financials")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Settlement Statement" : "結算對帳單"}</h1>
          <p className="text-sm text-muted-foreground">{settlement.id}</p>
        </div>
        <AdminStatusBadge status={settlement.status} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Settlement Summary" : "結算摘要"}</CardTitle></CardHeader>
        <CardContent>
          <Row
            label={isEn ? "Institution" : "機構"}
            value={
              <button className="text-primary hover:underline" onClick={() => navigate(`/admin/institutions/${settlement.institutionId}`)}>
                {settlement.institutionName}
              </button>
            }
          />
          <Row label={isEn ? "Settlement Cycle" : "結算週期"} value={settlement.cycle} />
          <Row label={isEn ? "Total Orders" : "訂單總數"} value={settlement.orderCount} />
          <Row label={isEn ? "Gross Amount" : "訂單總額"} value={`HK$${settlement.grossAmount.toLocaleString()}`} />
          <Row label={isEn ? "Service Fee Rate" : "服務費率"} value={`${(settlement.serviceFeeRate * 100).toFixed(0)}%`} />
          <Row label={isEn ? "Total Service Fee" : "服務費總額"} value={<span className="text-destructive">-HK${settlement.totalServiceFee.toLocaleString()}</span>} />
          <Row label={isEn ? "Net Settlement Amount" : "淨結算金額"} value={`HK$${settlement.netSettlement.toLocaleString()}`} highlight />
          <Row label={isEn ? "Generated" : "生成時間"} value={settlement.generatedAt} />
          {settlement.settledAt && <Row label={isEn ? "Settled" : "結算時間"} value={settlement.settledAt} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Order Breakdown" : "訂單明細"}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Order ID" : "訂單號"}</TableHead>
                <TableHead>{isEn ? "Date" : "日期"}</TableHead>
                <TableHead className="text-right">{isEn ? "Amount" : "金額"}</TableHead>
                <TableHead className="text-right">{isEn ? "Fee" : "服務費"}</TableHead>
                <TableHead className="text-right">{isEn ? "Net" : "淨額"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlement.orders.map((o) => (
                <TableRow key={o.orderId}>
                  <TableCell className="font-mono text-xs">
                    <button className="hover:text-primary hover:underline" onClick={() => navigate(`/admin/orders/${o.orderId}`)}>
                      {o.orderId}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm">{o.date}</TableCell>
                  <TableCell className="text-right">HK${o.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-destructive">-HK${o.fee.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">HK${o.net.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={2} className="font-semibold text-sm">{isEn ? "Showing sample orders" : "顯示部分訂單"}</TableCell>
                <TableCell className="text-right font-semibold">HK${settlement.orders.reduce((s, o) => s + o.amount, 0).toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold text-destructive">-HK${settlement.orders.reduce((s, o) => s + o.fee, 0).toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">HK${settlement.orders.reduce((s, o) => s + o.net, 0).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettlementDetailPage;
