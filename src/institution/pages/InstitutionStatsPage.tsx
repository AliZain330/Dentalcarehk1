import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";
import {
  TrendingUp, TrendingDown, Users, DollarSign, Calendar, FileDown, BarChart3, LineChart,
  ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as ReLineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

type Period = "day" | "week" | "month";

const InstitutionStatsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [period, setPeriod] = useState<Period>("week");

  // Mock data based on period
  const statsData = useMemo(() => {
    const base = {
      day: { orders: 12, revenue: 15800, patients: 10, trend: { orders: 8, revenue: 5, patients: 12 } },
      week: { orders: 78, revenue: 98500, patients: 62, trend: { orders: 12, revenue: 15, patients: 8 } },
      month: { orders: 312, revenue: 425000, patients: 248, trend: { orders: -5, revenue: 3, patients: -2 } },
    };
    return base[period];
  }, [period]);

  // Chart data
  const orderChartData = useMemo(() => {
    if (period === "day") {
      return [
        { name: "9AM", inClinic: 2, consult: 1 },
        { name: "10AM", inClinic: 3, consult: 0 },
        { name: "11AM", inClinic: 1, consult: 2 },
        { name: "12PM", inClinic: 0, consult: 1 },
        { name: "2PM", inClinic: 2, consult: 0 },
        { name: "3PM", inClinic: 1, consult: 1 },
        { name: "4PM", inClinic: 1, consult: 0 },
        { name: "5PM", inClinic: 0, consult: 1 },
      ];
    }
    if (period === "week") {
      return [
        { name: isEn ? "Mon" : "週一", inClinic: 12, consult: 5 },
        { name: isEn ? "Tue" : "週二", inClinic: 15, consult: 8 },
        { name: isEn ? "Wed" : "週三", inClinic: 10, consult: 6 },
        { name: isEn ? "Thu" : "週四", inClinic: 14, consult: 4 },
        { name: isEn ? "Fri" : "週五", inClinic: 18, consult: 7 },
        { name: isEn ? "Sat" : "週六", inClinic: 8, consult: 3 },
        { name: isEn ? "Sun" : "週日", inClinic: 0, consult: 2 },
      ];
    }
    return [
      { name: isEn ? "Week 1" : "第1週", inClinic: 65, consult: 28 },
      { name: isEn ? "Week 2" : "第2週", inClinic: 72, consult: 32 },
      { name: isEn ? "Week 3" : "第3週", inClinic: 58, consult: 25 },
      { name: isEn ? "Week 4" : "第4週", inClinic: 80, consult: 35 },
    ];
  }, [period, isEn]);

  const revenueChartData = useMemo(() => {
    if (period === "day") {
      return [
        { name: "9AM", revenue: 2800 },
        { name: "10AM", revenue: 4500 },
        { name: "11AM", revenue: 1800 },
        { name: "12PM", revenue: 500 },
        { name: "2PM", revenue: 3200 },
        { name: "3PM", revenue: 1500 },
        { name: "4PM", revenue: 800 },
        { name: "5PM", revenue: 700 },
      ];
    }
    if (period === "week") {
      return [
        { name: isEn ? "Mon" : "週一", revenue: 12500 },
        { name: isEn ? "Tue" : "週二", revenue: 18200 },
        { name: isEn ? "Wed" : "週三", revenue: 14800 },
        { name: isEn ? "Thu" : "週四", revenue: 16500 },
        { name: isEn ? "Fri" : "週五", revenue: 22000 },
        { name: isEn ? "Sat" : "週六", revenue: 10500 },
        { name: isEn ? "Sun" : "週日", revenue: 4000 },
      ];
    }
    return [
      { name: isEn ? "Week 1" : "第1週", revenue: 95000 },
      { name: isEn ? "Week 2" : "第2週", revenue: 112000 },
      { name: isEn ? "Week 3" : "第3週", revenue: 88000 },
      { name: isEn ? "Week 4" : "第4週", revenue: 130000 },
    ];
  }, [period, isEn]);

  const serviceBreakdown = [
    { name: isEn ? "Teeth Cleaning" : "洗牙", value: 35, color: "hsl(var(--primary))" },
    { name: isEn ? "Check-up" : "檢查", value: 25, color: "hsl(var(--info))" },
    { name: isEn ? "Whitening" : "美白", value: 18, color: "hsl(var(--success))" },
    { name: isEn ? "Orthodontics" : "矯齒", value: 12, color: "hsl(var(--warning))" },
    { name: isEn ? "Others" : "其他", value: 10, color: "hsl(var(--muted-foreground))" },
  ];

  const doctorPerformance = [
    { name: isEn ? "Dr. James Wong" : "黃俊明醫生", orders: 45, revenue: 58000 },
    { name: isEn ? "Dr. Emily Chen" : "陳美玲醫生", orders: 38, revenue: 72000 },
    { name: isEn ? "Dr. Michael Lee" : "李偉明醫生", orders: 28, revenue: 85000 },
  ];

  const handleExport = (type: string) => {
    toast({
      title: isEn ? "API key not added yet" : "尚未添加API密鑰",
      description: isEn ? `${type} export requires backend integration` : `${type}導出需要後端整合`,
    });
  };

  const TrendIndicator = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-0.5 text-xs font-medium ${value >= 0 ? "text-success" : "text-destructive"}`}>
      {value >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value)}%
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Data Statistics" : "數據統計"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isEn ? "View performance metrics and trends" : "查看績效指標和趨勢"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={v => setPeriod(v as Period)}>
            <TabsList>
              <TabsTrigger value="day">{isEn ? "Day" : "日"}</TabsTrigger>
              <TabsTrigger value="week">{isEn ? "Week" : "週"}</TabsTrigger>
              <TabsTrigger value="month">{isEn ? "Month" : "月"}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-36">
              <Download className="h-4 w-4 mr-1" />
              <span>{isEn ? "Export" : "導出"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">{isEn ? "PDF Report" : "PDF報告"}</SelectItem>
              <SelectItem value="excel">{isEn ? "Excel Data" : "Excel數據"}</SelectItem>
              <SelectItem value="csv">{isEn ? "CSV Export" : "CSV導出"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isEn ? "Total Orders" : "總訂單數"}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{statsData.orders}</p>
                <TrendIndicator value={statsData.trend.orders} />
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {isEn ? `vs previous ${period}` : `對比上${period === "day" ? "日" : period === "week" ? "週" : "月"}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isEn ? "Revenue" : "營業額"}</p>
                <p className="text-3xl font-bold text-foreground mt-1">HK${statsData.revenue.toLocaleString()}</p>
                <TrendIndicator value={statsData.trend.revenue} />
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {isEn ? `vs previous ${period}` : `對比上${period === "day" ? "日" : period === "week" ? "週" : "月"}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{isEn ? "Patients Served" : "服務患者"}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{statsData.patients}</p>
                <TrendIndicator value={statsData.trend.patients} />
              </div>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-info" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {isEn ? `vs previous ${period}` : `對比上${period === "day" ? "日" : period === "week" ? "週" : "月"}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              {isEn ? "Order Volume" : "訂單量"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Bar dataKey="inClinic" name={isEn ? "In-Clinic" : "到診"} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="consult" name={isEn ? "Consultation" : "諮詢"} fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" />
              {isEn ? "Revenue Trend" : "營業額趨勢"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(value: number) => [`HK$${value.toLocaleString()}`, isEn ? "Revenue" : "營業額"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: "hsl(var(--success))" }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Service Breakdown" : "服務分佈"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {serviceBreakdown.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? "Doctor Performance" : "醫生績效"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorPerformance.map((doc, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {doc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{doc.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">{doc.orders} {isEn ? "orders" : "訂單"}</span>
                      <span className="text-xs font-medium text-success">HK${doc.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(doc.revenue / 85000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileDown className="h-4 w-4 text-muted-foreground" />
            {isEn ? "Export Reports" : "導出報告"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExport("Order Report")}>
              <Calendar className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">{isEn ? "Order Report" : "訂單報告"}</span>
              <span className="text-xs text-muted-foreground mt-1">{isEn ? "All orders with details" : "所有訂單詳情"}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExport("Financial Report")}>
              <DollarSign className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">{isEn ? "Financial Report" : "財務報告"}</span>
              <span className="text-xs text-muted-foreground mt-1">{isEn ? "Revenue breakdown" : "營收明細"}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => handleExport("Performance Report")}>
              <BarChart3 className="h-5 w-5 mb-2" />
              <span className="text-sm font-medium">{isEn ? "Performance Report" : "績效報告"}</span>
              <span className="text-xs text-muted-foreground mt-1">{isEn ? "Doctor & service metrics" : "醫生及服務指標"}</span>
            </Button>
          </div>
          <ApiPlaceholderNotice service={isEn ? "Report Export" : "報告導出"} variant="inline" />
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionStatsPage;
