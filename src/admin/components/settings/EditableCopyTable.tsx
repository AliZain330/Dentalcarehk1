import React, { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Languages, PencilLine } from "lucide-react";
import type { LanguageCopyItem } from "@/admin/data/adminSystemSettingsData";
import { toast } from "sonner";

interface EditableCopyTableProps {
  items: LanguageCopyItem[];
  onSaveItem: (id: string, valueEn: string, valueZh: string) => void;
}

const EditableCopyTable: React.FC<EditableCopyTableProps> = ({ items, onSaveItem }) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftEn, setDraftEn] = useState("");
  const [draftZh, setDraftZh] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      item.key.toLowerCase().includes(q) ||
      item.module.toLowerCase().includes(q) ||
      item.moduleZh.includes(q) ||
      item.valueEn.toLowerCase().includes(q) ||
      item.valueZh.includes(q),
    );
  }, [items, search]);

  const onEdit = (item: LanguageCopyItem) => {
    setEditingId(item.id);
    setDraftEn(item.valueEn);
    setDraftZh(item.valueZh);
  };

  const currentEditing = items.find((item) => item.id === editingId) || null;

  const onSubmit = () => {
    if (!editingId) return;
    if (!draftEn.trim() || !draftZh.trim()) {
      toast.error(isEn ? "Both English and Chinese copy are required" : "中英文文案均為必填");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSaveItem(editingId, draftEn.trim(), draftZh.trim());
      setIsSaving(false);
      setEditingId(null);
      toast.success(isEn ? "Copy updated successfully" : "文案更新成功");
    }, 450);
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={isEn ? "Search key or content..." : "按 key 或內容搜索..."}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Languages className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                {isEn ? "No copy entries found" : "未找到文案"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "Module" : "模組"}</TableHead>
                  <TableHead>{isEn ? "Key" : "Key"}</TableHead>
                  <TableHead>{isEn ? "English Copy" : "英文文案"}</TableHead>
                  <TableHead>{isEn ? "Chinese Copy" : "中文文案"}</TableHead>
                  <TableHead>{isEn ? "Updated At" : "更新時間"}</TableHead>
                  <TableHead className="w-20">{isEn ? "Action" : "操作"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{isEn ? item.module : item.moduleZh}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.key}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.valueEn}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.valueZh}</TableCell>
                    <TableCell>{item.updatedAt}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="gap-1">
                        <PencilLine className="h-3.5 w-3.5" />
                        {isEn ? "Edit" : "編輯"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(currentEditing)} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEn ? "Edit Copy" : "編輯文案"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              {currentEditing?.key}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "English Copy" : "英文文案"}</label>
              <Textarea value={draftEn} onChange={(event) => setDraftEn(event.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEn ? "Traditional Chinese Copy" : "繁體中文文案"}</label>
              <Textarea value={draftZh} onChange={(event) => setDraftZh(event.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              {isEn ? "Cancel" : "取消"}
            </Button>
            <Button onClick={onSubmit} disabled={isSaving}>
              {isSaving ? (isEn ? "Updating..." : "更新中...") : (isEn ? "Update" : "更新")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableCopyTable;
