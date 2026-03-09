import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminMetricCard from "../components/AdminMetricCard";
import { Ticket, Gift, TrendingUp } from "lucide-react";

const mockCampaigns = [
  { id: "1", name: "Spring Cleaning Promo", type: "coupon", issued: 1200, used: 480, status: "active" },
  { id: "2", name: "New User Welcome", type: "coupon", issued: 3000, used: 1500, status: "active" },
  { id: "3", name: "CNY Special", type: "coupon", issued: 800, used: 320, status: "ended" },
  { id: "4", name: "Referral Bonus", type: "referral", issued: 420, used: 18, status: "active" },
];

const AdminMarketingPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Marketing" : "營銷管理"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Campaigns and promotions" : "活動及推廣"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminMetricCard icon={Ticket} label={isEn ? "Active Campaigns" : "進行中活動"} value="3" />
        <AdminMetricCard icon={Gift} label={isEn ? "Coupons Issued" : "已發優惠券"} value="5,420" />
        <AdminMetricCard icon={TrendingUp} label={isEn ? "Redemption Rate" : "使用率"} value="42.8%" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{isEn ? "Campaigns" : "活動列表"}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isEn ? "Campaign" : "活動名稱"}</TableHead>
                <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                <TableHead className="text-center">{isEn ? "Issued" : "已發"}</TableHead>
                <TableHead className="text-center">{isEn ? "Used" : "已用"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                  <TableCell className="text-center">{c.issued.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{c.used.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>
                      {c.status === "active" ? (isEn ? "Active" : "進行中") : (isEn ? "Ended" : "已結束")}
                    </Badge>
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

export default AdminMarketingPage;
