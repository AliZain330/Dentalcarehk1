import React, { useState, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Eye, EyeOff, ArrowUp, ArrowDown, AlertTriangle, Trash2, ImagePlus } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  price: number;
  duration: number;
  population: string;
  populationZh: string;
  listed: boolean;
  bookingCount: number;
  images: number;
}

const initialServices: ServiceItem[] = [
  { id: "s1", name: "Teeth Cleaning", nameZh: "洗牙", description: "Professional dental cleaning to remove plaque and tartar", descriptionZh: "專業牙齒清潔，去除牙菌斑和牙石", price: 380, duration: 45, population: "Adults", populationZh: "成人", listed: true, bookingCount: 24, images: 2 },
  { id: "s2", name: "Teeth Whitening", nameZh: "牙齒美白", description: "Advanced whitening treatment for brighter smile", descriptionZh: "先進的美白治療，讓笑容更燦爛", price: 2800, duration: 60, population: "Adults 18+", populationZh: "18歲以上成人", listed: true, bookingCount: 12, images: 3 },
  { id: "s3", name: "Dental Check-up", nameZh: "牙齒檢查", description: "Comprehensive dental examination with X-ray", descriptionZh: "全面牙齒檢查及X光片", price: 280, duration: 30, population: "All ages", populationZh: "所有年齡", listed: true, bookingCount: 45, images: 1 },
  { id: "s4", name: "Orthodontics Consultation", nameZh: "矯齒諮詢", description: "Initial consultation for braces or aligners", descriptionZh: "箍牙或隱適美初步諮詢", price: 500, duration: 40, population: "Teens & Adults", populationZh: "青少年及成人", listed: false, bookingCount: 0, images: 0 },
  { id: "s5", name: "Root Canal Treatment", nameZh: "根管治療", description: "Endodontic treatment for infected tooth", descriptionZh: "感染牙齒的根管治療", price: 4500, duration: 90, population: "Adults", populationZh: "成人", listed: true, bookingCount: 8, images: 1 },
  { id: "s6", name: "Pediatric Dental Care", nameZh: "兒童牙科護理", description: "Gentle dental care designed for children", descriptionZh: "專為兒童設計的溫和牙科護理", price: 350, duration: 30, population: "Children 3-12", populationZh: "3-12歲兒童", listed: true, bookingCount: 15, images: 2 },
];

const InstitutionServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "listed" | "unlisted">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm: Omit<ServiceItem, "id" | "bookingCount"> = {
    name: "", nameZh: "", description: "", descriptionZh: "",
    price: 0, duration: 30, population: "", populationZh: "",
    listed: true, images: 0,
  };
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let list = services;
    if (filter === "listed") list = list.filter(s => s.listed);
    if (filter === "unlisted") list = list.filter(s => !s.listed);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.nameZh.includes(q));
    }
    return list;
  }, [services, search, filter]);

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    setEditingItem(item);
    setForm({ name: item.name, nameZh: item.nameZh, description: item.description, descriptionZh: item.descriptionZh, price: item.price, duration: item.duration, population: item.population, populationZh: item.populationZh, listed: item.listed, images: item.images });
    setFormErrors({});
    setDialogOpen(true);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isEn ? "Required" : "必填";
    if (!form.nameZh.trim()) e.nameZh = isEn ? "Required" : "必填";
    if (form.price <= 0) e.price = isEn ? "Must be > 0" : "必須大於0";
    if (form.duration <= 0) e.duration = isEn ? "Must be > 0" : "必須大於0";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    if (editingItem) {
      setServices(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...form } : s));
      toast({ title: isEn ? "Service updated" : "服務已更新" });
    } else {
      const newItem: ServiceItem = { ...form, id: `s${Date.now()}`, bookingCount: 0 };
      setServices(prev => [...prev, newItem]);
      toast({ title: isEn ? "Service added" : "服務已新增" });
    }
    setDialogOpen(false);
  };

  const toggleListed = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, listed: !s.listed } : s));
    toast({ title: isEn ? "Status updated" : "狀態已更新" });
  };

  const handleDelete = (id: string) => {
    const item = services.find(s => s.id === id);
    if (item && item.bookingCount > 0) {
      toast({ title: isEn ? "Cannot delete" : "無法刪除", description: isEn ? `This service has ${item.bookingCount} bookings. Please unlist it instead.` : `此服務有${item.bookingCount}個預約，請改為下架。`, variant: "destructive" });
      setDeleteConfirm(null);
      return;
    }
    setServices(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    toast({ title: isEn ? "Service deleted" : "服務已刪除" });
  };

  const moveService = (index: number, dir: "up" | "down") => {
    const arr = [...services];
    const swapIdx = dir === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[index], arr[swapIdx]] = [arr[swapIdx], arr[index]];
    setServices(arr);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEn ? "Service Management" : "服務管理"}</h1>
          <p className="text-sm text-muted-foreground mt-1">{isEn ? "Manage your institution's service items" : "管理您的機構服務項目"}</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> {isEn ? "Add Service" : "新增服務"}
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={isEn ? "Search services..." : "搜尋服務..."} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={v => setFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isEn ? "All Status" : "全部狀態"}</SelectItem>
              <SelectItem value="listed">{isEn ? "Listed" : "已上架"}</SelectItem>
              <SelectItem value="unlisted">{isEn ? "Unlisted" : "已下架"}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: isEn ? "Total Services" : "總服務數", value: services.length },
          { label: isEn ? "Listed" : "已上架", value: services.filter(s => s.listed).length },
          { label: isEn ? "Unlisted" : "已下架", value: services.filter(s => !s.listed).length },
        ].map((s, i) => (
          <Card key={i}><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {/* Service Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground font-medium">{isEn ? "No services found" : "找不到服務"}</p>
              <p className="text-sm text-muted-foreground mt-1">{isEn ? "Try adjusting your search or add a new service" : "請嘗試調整搜尋條件或新增服務"}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>{isEn ? "Service Name" : "服務名稱"}</TableHead>
                  <TableHead className="hidden md:table-cell">{isEn ? "Price (HKD)" : "價格 (HKD)"}</TableHead>
                  <TableHead className="hidden md:table-cell">{isEn ? "Duration" : "時長"}</TableHead>
                  <TableHead className="hidden lg:table-cell">{isEn ? "Bookings" : "預約數"}</TableHead>
                  <TableHead>{isEn ? "Status" : "狀態"}</TableHead>
                  <TableHead className="text-right">{isEn ? "Actions" : "操作"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item, idx) => {
                  const origIdx = services.findIndex(s => s.id === item.id);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveService(origIdx, "up")} disabled={origIdx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                          <button onClick={() => moveService(origIdx, "down")} disabled={origIdx === services.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{isEn ? item.name : item.nameZh}</p>
                        <p className="text-xs text-muted-foreground hidden sm:block">{isEn ? item.population : item.populationZh}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">HK${item.price.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.duration} {isEn ? "min" : "分鐘"}</TableCell>
                      <TableCell className="hidden lg:table-cell">{item.bookingCount}</TableCell>
                      <TableCell>
                        <Badge variant={item.listed ? "default" : "secondary"}>
                          {item.listed ? (isEn ? "Listed" : "已上架") : (isEn ? "Unlisted" : "已下架")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleListed(item.id)}>
                            {item.listed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          {deleteConfirm === item.id ? (
                            <div className="flex gap-1">
                              <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={() => handleDelete(item.id)}>{isEn ? "Confirm" : "確認"}</Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDeleteConfirm(null)}>{isEn ? "Cancel" : "取消"}</Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteConfirm(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? (isEn ? "Edit Service" : "編輯服務") : (isEn ? "Add New Service" : "新增服務")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (EN)" : "名稱（英文）"}</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={formErrors.name ? "border-destructive" : ""} />
                {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Name (ZH)" : "名稱（中文）"}</Label>
                <Input value={form.nameZh} onChange={e => setForm(p => ({ ...p, nameZh: e.target.value }))} className={formErrors.nameZh ? "border-destructive" : ""} />
                {formErrors.nameZh && <p className="text-xs text-destructive">{formErrors.nameZh}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Description (EN)" : "描述（英文）"}</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Description (ZH)" : "描述（中文）"}</Label>
              <Textarea value={form.descriptionZh} onChange={e => setForm(p => ({ ...p, descriptionZh: e.target.value }))} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Price (HKD)" : "價格 (HKD)"}</Label>
                <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className={formErrors.price ? "border-destructive" : ""} />
                {formErrors.price && <p className="text-xs text-destructive">{formErrors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Duration (min)" : "時長（分鐘）"}</Label>
                <Input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))} className={formErrors.duration ? "border-destructive" : ""} />
                {formErrors.duration && <p className="text-xs text-destructive">{formErrors.duration}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>{isEn ? "Population (EN)" : "適用人群（英文）"}</Label>
                <Input value={form.population} onChange={e => setForm(p => ({ ...p, population: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{isEn ? "Population (ZH)" : "適用人群（中文）"}</Label>
                <Input value={form.populationZh} onChange={e => setForm(p => ({ ...p, populationZh: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{isEn ? "Service Images" : "服務圖片"}</Label>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImagePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{isEn ? "API key not added yet" : "尚未添加API密鑰"}</p>
                  <p className="text-xs mt-1">{isEn ? "Image upload requires backend integration" : "圖片上傳需要後端整合"}</p>
                </div>
              </div>
            </div>
            {editingItem && editingItem.bookingCount > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-warning">{isEn ? "Active bookings exist" : "存在活躍預約"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{isEn ? `This service has ${editingItem.bookingCount} bookings. It cannot be deleted but can be unlisted.` : `此服務有${editingItem.bookingCount}個預約。無法刪除但可以下架。`}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{isEn ? "Cancel" : "取消"}</Button>
            <Button onClick={handleSave}>{editingItem ? (isEn ? "Save Changes" : "儲存更改") : (isEn ? "Add Service" : "新增服務")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionServicesPage;
