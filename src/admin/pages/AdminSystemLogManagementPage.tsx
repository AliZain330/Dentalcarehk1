import React, { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FileClock } from "lucide-react";
import SystemSettingsNav from "@/admin/components/settings/SystemSettingsNav";
import SettingsStatusBadge from "@/admin/components/settings/SettingsStatusBadge";
import { adminRoles, systemLogs } from "@/admin/data/adminSystemSettingsData";
import { toast } from "sonner";

const AdminSystemLogManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [logTypeFilter, setLogTypeFilter] = useState<"all" | "operation" | "login">("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [operationTypeFilter, setOperationTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const allAccounts = Array.from(new Set(systemLogs.map((log) => log.account)));
  const allOperationTypes = Array.from(new Set(systemLogs.map((log) => log.operationType)));

  const filteredLogs = useMemo(() => {
    return systemLogs.filter((log) => {
      if (logTypeFilter !== "all" && log.logType !== logTypeFilter) return false;
      if (accountFilter !== "all" && log.account !== accountFilter) return false;
      if (operationTypeFilter !== "all" && log.operationType !== operationTypeFilter) return false;
      if (keyword) {
        const q = keyword.toLowerCase();
        if (
          !log.account.toLowerCase().includes(q) &&
          !log.operationType.toLowerCase().includes(q) &&
          !log.target.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (timeFilter === "all") return true;
      const created = new Date(log.createdAt).getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (timeFilter === "today") return now - created <= oneDay;
      if (timeFilter === "3days") return now - created <= 3 * oneDay;
      if (timeFilter === "7days") return now - created <= 7 * oneDay;
      return true;
    });
  }, [accountFilter, keyword, logTypeFilter, operationTypeFilter, timeFilter]);

  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(isEn ? "Log filters updated" : "日誌篩選已更新");
    }, 300);
  };

  const roleText = (roleKey: string) => {
    const role = adminRoles.find((item) => item.key === roleKey);
    return isEn ? role?.label : role?.labelZh;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "System Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEn ? "Track operation logs and login records" : "查看系統操作及登入日誌"}
        </p>
      </div>

      <SystemSettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>{isEn ? "Log Management" : "日誌管理"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Time" : "全部時間"}</SelectItem>
                <SelectItem value="today">{isEn ? "Today" : "今天"}</SelectItem>
                <SelectItem value="3days">{isEn ? "Last 3 Days" : "最近3天"}</SelectItem>
                <SelectItem value="7days">{isEn ? "Last 7 Days" : "最近7天"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={isEn ? "Account" : "帳號"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Accounts" : "全部帳號"}</SelectItem>
                {allAccounts.map((account) => (
                  <SelectItem key={account} value={account}>
                    {account}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={operationTypeFilter} onValueChange={setOperationTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={isEn ? "Operation Type" : "操作類型"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Operation Types" : "全部操作類型"}</SelectItem>
                {allOperationTypes.map((operationType) => (
                  <SelectItem key={operationType} value={operationType}>
                    {operationType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={logTypeFilter} onValueChange={(value) => setLogTypeFilter(value as "all" | "operation" | "login")}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isEn ? "All Logs" : "全部日誌"}</SelectItem>
                <SelectItem value="operation">{isEn ? "Operation Logs" : "操作日誌"}</SelectItem>
                <SelectItem value="login">{isEn ? "Login Logs" : "登入日誌"}</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={isEn ? "Search target/account/type..." : "搜索目標/帳號/類型..."}
              />
            </div>
            <Button onClick={applyFilters}>{isEn ? "Apply" : "套用"}</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-14 text-center text-sm text-muted-foreground">
                  {isEn ? "Loading logs..." : "載入日誌中..."}
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileClock className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {isEn ? "No logs found" : "未找到日誌記錄"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{isEn ? "Time" : "時間"}</TableHead>
                      <TableHead>{isEn ? "Account" : "帳號"}</TableHead>
                      <TableHead>{isEn ? "Role" : "角色"}</TableHead>
                      <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                      <TableHead>{isEn ? "Operation" : "操作"}</TableHead>
                      <TableHead>{isEn ? "Target" : "目標"}</TableHead>
                      <TableHead>{isEn ? "IP" : "IP"}</TableHead>
                      <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.createdAt}</TableCell>
                        <TableCell>{log.account}</TableCell>
                        <TableCell>{roleText(log.role)}</TableCell>
                        <TableCell>{log.logType === "login" ? (isEn ? "Login" : "登入") : (isEn ? "Operation" : "操作")}</TableCell>
                        <TableCell>{isEn ? log.operationType : log.operationTypeZh}</TableCell>
                        <TableCell>{isEn ? log.target : log.targetZh}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                        <TableCell>
                          <SettingsStatusBadge status={log.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemLogManagementPage;
