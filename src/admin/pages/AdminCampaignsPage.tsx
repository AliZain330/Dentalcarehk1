import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import AdminMetricCard from "../components/AdminMetricCard";
import { Megaphone, Users, Eye, TrendingUp, Search, Plus, Pause, Play, Square, Pencil, ArrowLeft, Loader2, Save } from "lucide-react";
import { mockCampaigns, type AdminCampaign } from "../data/adminMarketingData";
import { useToast } from "@/hooks/use-toast";

const campaignTypeLabel = (t: AdminCampaign["type"], isEn: boolean) => {
  const map: Record<string, [string, string]> = {
    banner: ["Banner Ad", "橫幅廣告"],
    recommendation: ["Recommendation", "精選推薦"],
    referral: ["Referral", "推薦獎賞"],
    promotion: ["Promotion", "推廣活動"],
  };
  return isEn ? map[t][0] : map[t][1];
};

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; en: string; zh: string }> = {
  active: { variant: "default", en: "Active", zh: "進行中" },
  paused: { variant: "outline", en: "Paused", zh: "已暫停" },
  ended: { variant: "secondary", en: "Ended", zh: "已結束" },
  draft: { variant: "outline", en: "Draft", zh: "草稿" },
};

const AdminCampaignsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "", nameZh: "", type: "promotion" as AdminCampaign["type"],
    startDate: "", endDate: "", rules: "", rulesZh: "",
  });

  const filtered = campaigns.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.nameZh.includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const togglePause = (id: string) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "paused" ? "active" : "paused" as AdminCampaign["status"] } : c));
    toast({ title: isEn ? "Campaign Updated" : "活動已更新" });
  };

  const endCampaign = (id: string) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "ended" as AdminCampaign["status"] } : c));
    toast({ title: isEn ? "Campaign Ended" : "活動已結束" });
  };

  const handleCreate = () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      toast({ title: isEn ? "Fill required fields" : "請填寫必填項", variant: "destructive" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const created: AdminCampaign = {
        id: `CMP-${String(campaigns.length + 1).padStart(3, "0")}`,
        ...newCampaign,
        participatingInstitutions: 0, participatingUsers: 0, impressions: 0, conversions: 0,
        status: "draft",
      };
      setCampaigns((prev) => [created, ...prev]);
      setSaving(false);
      setCreateOpen(false);
      setNewCampaign({ name: "", nameZh: "", type: "promotion", startDate: "", endDate: "", rules: "", rulesZh: "" });
      toast({ title: isEn ? "Campaign Created" : "活動已創建" });
    }, 1000);
  };

  const totalActive = campaigns.filter((c) => c.status === "active").length;
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const statusTabs = [
    { val: "all", label: isEn ? "All" : "全部" },
    { val: "active", label: isEn ? "Active" : "進行中" },
    { val: "paused", label: isEn ? "Paused" : "已暫停" },
    { val: "ended", label: isEn ? "Ended" : "已結束" },
    { val: "draft", label: isEn ? "Draft" : "草稿" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/marketing")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Campaign Management" : "活動管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Create and manage platform campaigns" : "創建及管理平台活動"}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-1" />{isEn ? "New Campaign" : "新建活動"}</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <AdminMetricCard icon={Megaphone} label={isEn ? "Active Campaigns" : "進行中活動"} value={String(totalActive)} />
        <AdminMetricCard icon={Eye} label={isEn ? "Impressions" : "曝光次數"} value={totalImpressions.toLocaleString()} />
        <AdminMetricCard icon={TrendingUp} label={isEn ? "Conversions" : "轉化次數"} value={totalConversions.toLocaleString()} />
        <AdminMetricCard icon={Users} label={isEn ? "Conv. Rate" : "轉化率"} value={totalImpressions > 0 ? `${((totalConversions / totalImpressions) * 100).toFixed(1)}%` : "0%"} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={isEn ? "Search campaigns..." : "搜索活動..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {statusTabs.map((t) => (
            <Button key={t.val} variant={statusFilter === t.val ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(t.val)}>{t.label}</Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{isEn ? "Campaign" : "活動名稱"}</TableHead>
                <TableHead>{isEn ? "Type" : "類型"}</TableHead>
                <TableHead>{isEn ? "Period" : "期間"}</TableHead>
                <TableHead className="text-center">{isEn ? "Institutions" : "機構數"}</TableHead>
                <TableHead className="text-center">{isEn ? "Users" : "用戶數"}</TableHead>
                <TableHead className="text-center">{isEn ? "Impressions" : "曝光"}</TableHead>
                <TableHead className="text-center">{isEn ? "Conversions" : "轉化"}</TableHead>
                <TableHead className="text-center">{isEn ? "Status" : "狀態"}</TableHead>
                <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">{isEn ? "No campaigns found" : "未找到活動"}</TableCell></TableRow>
              ) : filtered.map((c) => {
                const sc = statusConfig[c.status];
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="font-medium">{isEn ? c.name : c.nameZh}</TableCell>
                    <TableCell><Badge variant="outline">{campaignTypeLabel(c.type, isEn)}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.startDate} ~ {c.endDate}</TableCell>
                    <TableCell className="text-center">{c.participatingInstitutions}</TableCell>
                    <TableCell className="text-center">{c.participatingUsers.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{c.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{c.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-center"><Badge variant={sc.variant}>{isEn ? sc.en : sc.zh}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title={isEn ? "Edit" : "編輯"}><Pencil className="h-4 w-4" /></Button>
                        {(c.status === "active" || c.status === "paused") && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePause(c.id)} title={c.status === "paused" ? (isEn ? "Resume" : "恢復") : (isEn ? "Pause" : "暫停")}>
                            {c.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                          </Button>
                        )}
                        {c.status !== "ended" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => endCampaign(c.id)} title={isEn ? "End" : "結束"}>
                            <Square className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEn ? "Create Campaign" : "創建活動"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (EN)" : "名稱（英）"} *</Label>
                <Input value={newCampaign.name} onChange={(e) => setNewCampaign((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (ZH)" : "名稱（中）"}</Label>
                <Input value={newCampaign.nameZh} onChange={(e) => setNewCampaign((p) => ({ ...p, nameZh: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Campaign Type" : "活動類型"}</Label>
              <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign((p) => ({ ...p, type: v as AdminCampaign["type"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">{isEn ? "Banner Ad" : "橫幅廣告"}</SelectItem>
                  <SelectItem value="recommendation">{isEn ? "Recommendation" : "精選推薦"}</SelectItem>
                  <SelectItem value="referral">{isEn ? "Referral" : "推薦獎賞"}</SelectItem>
                  <SelectItem value="promotion">{isEn ? "Promotion" : "推廣活動"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Start Date" : "開始日期"} *</Label>
                <Input type="date" value={newCampaign.startDate} onChange={(e) => setNewCampaign((p) => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "End Date" : "結束日期"} *</Label>
                <Input type="date" value={newCampaign.endDate} onChange={(e) => setNewCampaign((p) => ({ ...p, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Rules (EN)" : "規則（英）"}</Label>
              <Textarea value={newCampaign.rules} onChange={(e) => setNewCampaign((p) => ({ ...p, rules: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Rules (ZH)" : "規則（中）"}</Label>
              <Textarea value={newCampaign.rulesZh} onChange={(e) => setNewCampaign((p) => ({ ...p, rulesZh: e.target.value }))} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              {saving ? (isEn ? "Creating..." : "創建中...") : (isEn ? "Create" : "創建")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampaignsPage;
