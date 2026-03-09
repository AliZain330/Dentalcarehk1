import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditableCopyTable from "@/admin/components/settings/EditableCopyTable";
import SystemSettingsNav from "@/admin/components/settings/SystemSettingsNav";
import {
  languageCopyItems as initialLanguageCopyItems,
  type LanguageCopyItem,
} from "@/admin/data/adminSystemSettingsData";

const AdminSystemLanguageSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [copyItems, setCopyItems] = useState<LanguageCopyItem[]>(initialLanguageCopyItems);

  const onSaveItem = (id: string, valueEn: string, valueZh: string) => {
    const now = new Date().toLocaleString("en-GB", { hour12: false });
    setCopyItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              valueEn,
              valueZh,
              updatedAt: now,
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "System Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEn ? "Manage platform copywriting in English and Traditional Chinese" : "管理英文及繁體中文的平台文案"}
        </p>
      </div>

      <SystemSettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>{isEn ? "Language Settings" : "語言設定"}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditableCopyTable items={copyItems} onSaveItem={onSaveItem} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemLanguageSettingsPage;
