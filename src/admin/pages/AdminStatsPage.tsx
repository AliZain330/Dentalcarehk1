import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileDown } from "lucide-react";
import { regionData, serviceTypeData, topInstitutions, userGrowthData } from "../data/adminMockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "sonner";

const AdminStatsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [timeRange, setTimeRange] = useState("month");
  const [region, setRegion] = useState("all");

  const handleExport = () => {
    toast.info(isEn ? "Export API key not added yet" : "導出 API 金鑰尚未添加");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Data Statistics" : "數據統計"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Platform analytics and reports" : "平台分析及報告"}</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          {isEn ? "Export Report" : "導出報告"}
        </Button>
      </div>

      <ApiPlaceholderNotice service={isEn ? "Report Export" : "報告導出"} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="today">{isEn ? "Today" : "今天"}</SelectItem>
            <SelectItem value="week">{isEn ? "This Week" : "本周"}</SelectItem>
            <SelectItem value="month">{isEn ? "This Month" : "本月"}</SelectItem>
            <SelectItem value="quarter">{isEn ? "This Quarter" : "本季度"}</SelectItem>
            <SelectItem value="year">{isEn ? "This Year" : "今年"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isEn ? "All Regions" : "全部地區"}</SelectItem>
            <SelectItem value="hki">{isEn ? "Hong Kong Island" : "香港島"}</SelectItem>
            <SelectItem value="kln">{isEn ? "Kowloon" : "九龍"}</SelectItem>
            <SelectItem value="nt">{isEn ? "New Territories" : "新界"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="region">
        <TabsList>
          <TabsTrigger value="region">{isEn ? "By Region" : "按地區"}</TabsTrigger>
          <TabsTrigger value="service">{isEn ? "By Service" : "按服務"}</TabsTrigger>
          <TabsTrigger value="institution">{isEn ? "By Institution" : "按機構"}</TabsTrigger>
          <TabsTrigger value="growth">{isEn ? "Growth" : "增長"}</TabsTrigger>
        </TabsList>

        <TabsContent value="region" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Orders by Region" : "各地區訂單"}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs fill-muted-foreground" />
                    <YAxis type="category" dataKey="region" width={120} className="text-xs fill-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(174, 62%, 40%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isEn ? "Region" : "地區"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Orders" : "訂單"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Revenue" : "交易額"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionData.map((r) => (
                    <TableRow key={r.region}>
                      <TableCell className="font-medium">{r.region}</TableCell>
                      <TableCell className="text-right">{r.orders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">HK${r.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Orders by Service Type" : "各服務類型訂單"}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceTypeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="type" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="orders" fill="hsl(174, 62%, 40%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isEn ? "Service Type" : "服務類型"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Orders" : "訂單"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Revenue" : "交易額"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypeData.map((s) => (
                    <TableRow key={s.type}>
                      <TableCell className="font-medium">{s.type}</TableCell>
                      <TableCell className="text-right">{s.orders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">HK${s.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institution" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "Top Institutions" : "熱門機構"}</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>{isEn ? "Institution" : "機構"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Orders" : "訂單"}</TableHead>
                    <TableHead className="text-right">{isEn ? "Revenue" : "交易額"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topInstitutions.map((inst, i) => (
                    <TableRow key={inst.name}>
                      <TableCell className="font-bold text-primary">{i + 1}</TableCell>
                      <TableCell className="font-medium">{inst.name}</TableCell>
                      <TableCell className="text-right">{inst.orders.toLocaleString()}</TableCell>
                      <TableCell className="text-right">HK${inst.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">{isEn ? "User Growth Trend" : "用戶增長趨勢"}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="users" fill="hsl(174, 62%, 40%)" radius={[4, 4, 0, 0]} name={isEn ? "Users" : "用戶"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStatsPage;
