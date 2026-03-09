import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminMetricCard from "../components/AdminMetricCard";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { Image, Eye, MousePointer, ArrowLeft, ArrowUp, ArrowDown, Pencil, Ban, Plus, Loader2, Save } from "lucide-react";
import { mockBanners, type AdminBanner } from "../data/adminMarketingData";
import { useAdminNotify } from "@/admin/hooks/useAdminNotify";

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; en: string; zh: string }> = {
  active: { variant: "default", en: "Active", zh: "啟用" },
  scheduled: { variant: "outline", en: "Scheduled", zh: "排期中" },
  disabled: { variant: "secondary", en: "Disabled", zh: "已停用" },
};

const AdminBannersPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language === "en";
  const notify = useAdminNotify();

  const [banners, setBanners] = useState(mockBanners);
  const [editOpen, setEditOpen] = useState(false);
  const [editBanner, setEditBanner] = useState<AdminBanner | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleStatus = (id: string) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, status: b.status === "disabled" ? "active" : "disabled" as AdminBanner["status"] } : b));
    notify.success("Banner updated", "橫幅已更新");
  };

  const moveOrder = (id: string, dir: -1 | 1) => {
    setBanners((prev) => {
      const sorted = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
      const idx = sorted.findIndex((b) => b.id === id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === sorted.length - 1)) return prev;
      const swapIdx = idx + dir;
      const temp = sorted[idx].sortOrder;
      sorted[idx] = { ...sorted[idx], sortOrder: sorted[swapIdx].sortOrder };
      sorted[swapIdx] = { ...sorted[swapIdx], sortOrder: temp };
      return sorted;
    });
  };

  const openEdit = (b: AdminBanner) => { setEditBanner({ ...b }); setEditOpen(true); };

  const handleSaveEdit = () => {
    if (!editBanner) return;
    setSaving(true);
    setTimeout(() => {
      setBanners((prev) => prev.map((b) => b.id === editBanner.id ? editBanner : b));
      setSaving(false);
      setEditOpen(false);
      notify.success("Banner saved", "橫幅已保存");
    }, 800);
  };

  const totalClicks = banners.reduce((s, b) => s + b.clicks, 0);
  const totalImpressions = banners.reduce((s, b) => s + b.impressions, 0);
  const activeBanners = banners.filter((b) => b.status === "active").length;

  const sorted = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/marketing")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Banner Management" : "橫幅管理"}</h1>
          <p className="text-sm text-muted-foreground">{isEn ? "Manage homepage carousel banners" : "管理首頁輪播橫幅"}</p>
        </div>
      </div>

      <ApiPlaceholderNotice service={isEn ? "Image Upload" : "圖片上傳"} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminMetricCard icon={Image} label={isEn ? "Active Banners" : "啟用橫幅"} value={String(activeBanners)} />
        <AdminMetricCard icon={Eye} label={isEn ? "Impressions" : "曝光次數"} value={totalImpressions.toLocaleString()} />
        <AdminMetricCard icon={MousePointer} label={isEn ? "Total Clicks" : "總點擊"} value={totalClicks.toLocaleString()} />
      </div>

      <div className="grid gap-4">
        {sorted.map((b) => {
          const sc = statusConfig[b.status];
          const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : "0";
          return (
            <Card key={b.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image placeholder */}
                  <div className="w-48 h-24 rounded-lg bg-muted border border-dashed border-border flex items-center justify-center shrink-0">
                    <div className="text-center">
                      <Image className="h-6 w-6 mx-auto text-muted-foreground" />
                      <p className="text-[10px] text-muted-foreground mt-1">{isEn ? "Banner Image" : "橫幅圖片"}</p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{isEn ? b.title : b.titleZh}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{b.id} · {isEn ? "Order" : "排序"}: {b.sortOrder}</p>
                      </div>
                      <Badge variant={sc.variant}>{isEn ? sc.en : sc.zh}</Badge>
                    </div>
                    <div className="flex gap-6 mt-2 text-xs text-muted-foreground">
                      <span>{isEn ? "Link" : "連結"}: <span className="text-foreground font-mono">{b.linkUrl}</span></span>
                      <span>{isEn ? "Period" : "期間"}: {b.displayFrom} ~ {b.displayTo}</span>
                    </div>
                    <div className="flex gap-6 mt-1 text-xs text-muted-foreground">
                      <span>{isEn ? "Impressions" : "曝光"}: {b.impressions.toLocaleString()}</span>
                      <span>{isEn ? "Clicks" : "點擊"}: {b.clicks.toLocaleString()}</span>
                      <span>CTR: {ctr}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveOrder(b.id, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveOrder(b.id, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(b.id)}><Ban className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Banner Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEn ? "Edit Banner" : "編輯橫幅"}</DialogTitle>
          </DialogHeader>
          {editBanner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{isEn ? "Title (EN)" : "標題（英）"}</Label>
                  <Input value={editBanner.title} onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isEn ? "Title (ZH)" : "標題（中）"}</Label>
                  <Input value={editBanner.titleZh} onChange={(e) => setEditBanner({ ...editBanner, titleZh: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Jump Link" : "跳轉連結"}</Label>
                <Input value={editBanner.linkUrl} onChange={(e) => setEditBanner({ ...editBanner, linkUrl: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Image Upload" : "圖片上傳"}</Label>
                <div className="border border-dashed border-border rounded-lg p-6 text-center">
                  <ApiPlaceholderNotice service={isEn ? "Image Upload" : "圖片上傳"} variant="block" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>{isEn ? "Display From" : "顯示開始"}</Label>
                  <Input type="date" value={editBanner.displayFrom} onChange={(e) => setEditBanner({ ...editBanner, displayFrom: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{isEn ? "Display To" : "顯示結束"}</Label>
                  <Input type="date" value={editBanner.displayTo} onChange={(e) => setEditBanner({ ...editBanner, displayTo: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Sort Order" : "排序"}</Label>
                <Input type="number" value={editBanner.sortOrder} onChange={(e) => setEditBanner({ ...editBanner, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Status" : "狀態"}</Label>
                <Select value={editBanner.status} onValueChange={(v) => setEditBanner({ ...editBanner, status: v as AdminBanner["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{isEn ? "Active" : "啟用"}</SelectItem>
                    <SelectItem value="scheduled">{isEn ? "Scheduled" : "排期中"}</SelectItem>
                    <SelectItem value="disabled">{isEn ? "Disabled" : "已停用"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              {saving ? (isEn ? "Saving..." : "保存中...") : (isEn ? "Save" : "保存")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannersPage;
