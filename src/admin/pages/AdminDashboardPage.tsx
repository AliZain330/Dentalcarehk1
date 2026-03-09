import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminMetricCard from "../components/AdminMetricCard";
import {
  Users, Building2, Stethoscope, ClipboardList, Wallet, Ticket,
  TrendingUp, Activity,
} from "lucide-react";
import {
  adminMetrics, orderTrendData, userGrowthData, couponUsageData, acceptanceRateData,
} from "../data/adminMockData";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, Legend,
} from "recharts";

const AdminDashboardPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const metrics = [
    { icon: Users, label: isEn ? "Total Users" : "總用戶", value: adminMetrics.totalUsers.toLocaleString(), trend: { value: "+8.3%", positive: true } },
    { icon: Building2, label: isEn ? "Institutions" : "機構數量", value: adminMetrics.totalInstitutions.toString(), trend: { value: "+7.5%", positive: true } },
    { icon: Stethoscope, label: isEn ? "Doctors" : "醫生數量", value: adminMetrics.totalDoctors.toString(), trend: { value: "+12.1%", positive: true } },
    { icon: ClipboardList, label: isEn ? "Today Orders" : "今日訂單", value: adminMetrics.todayOrders.toString(), subLabel: isEn ? `Week: ${adminMetrics.weekOrders} | Month: ${adminMetrics.monthOrders}` : `本周: ${adminMetrics.weekOrders} | 本月: ${adminMetrics.monthOrders}` },
    { icon: Wallet, label: isEn ? "Today Revenue" : "今日交易額", value: `HK$${(adminMetrics.todayTransaction / 1000).toFixed(0)}K`, subLabel: isEn ? `Month: HK$${(adminMetrics.monthTransaction / 1_000_000).toFixed(1)}M` : `本月: HK$${(adminMetrics.monthTransaction / 1_000_000).toFixed(1)}M` },
    { icon: Ticket, label: isEn ? "Coupons Used" : "優惠券使用", value: `${adminMetrics.couponUsed} / ${adminMetrics.couponIssued}`, subLabel: isEn ? `Usage rate: ${((adminMetrics.couponUsed / adminMetrics.couponIssued) * 100).toFixed(1)}%` : `使用率: ${((adminMetrics.couponUsed / adminMetrics.couponIssued) * 100).toFixed(1)}%` },
    { icon: Activity, label: isEn ? "Consult Accept Rate" : "問診接受率", value: `${adminMetrics.consultAcceptRate}%`, trend: { value: "+2.4%", positive: true } },
    { icon: TrendingUp, label: isEn ? "Month Orders" : "本月訂單", value: adminMetrics.monthOrders.toLocaleString(), trend: { value: "+15.2%", positive: true } },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "Dashboard" : "儀表板"}</h1>
        <p className="text-sm text-muted-foreground">{isEn ? "Platform overview and key metrics" : "平台概覽及關鍵指標"}</p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => <AdminMetricCard key={i} {...m} />)}
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Order Trends (7 Days)" : "訂單趨勢（7天）"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orderTrendData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="hsl(174, 62%, 40%)" fillOpacity={1} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Transaction Trends (7 Days)" : "交易趨勢（7天）"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip formatter={(v: number) => `HK$${v.toLocaleString()}`} />
                  <Bar dataKey="amount" fill="hsl(174, 62%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "User & Institution Growth" : "用戶及機構增長"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                  <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="hsl(174, 62%, 40%)" strokeWidth={2} name={isEn ? "Users" : "用戶"} />
                  <Line yAxisId="right" type="monotone" dataKey="institutions" stroke="hsl(38, 92%, 50%)" strokeWidth={2} name={isEn ? "Institutions" : "機構"} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Coupon Distribution" : "優惠券分佈"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={couponUsageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.name}: ${e.value}`}>
                    {couponUsageData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Consultation Acceptance Rate" : "問診接受率"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acceptanceRateData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis domain={[70, 100]} className="text-xs fill-muted-foreground" tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="rate" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 42%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
