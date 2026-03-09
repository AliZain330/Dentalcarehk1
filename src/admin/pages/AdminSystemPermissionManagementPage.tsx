import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import PermissionMatrix from "@/admin/components/settings/PermissionMatrix";
import SystemSettingsNav from "@/admin/components/settings/SystemSettingsNav";
import {
  permissionModules as defaultPermissionModules,
  type AdminRoleKey,
  type PermissionAction,
  type PermissionModule,
} from "@/admin/data/adminSystemSettingsData";
import { toast } from "sonner";

const AdminSystemPermissionManagementPage: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [modules, setModules] = useState<PermissionModule[]>(defaultPermissionModules);
  const [isSaving, setIsSaving] = useState(false);

  const onTogglePermission = (
    moduleId: string,
    action: PermissionAction,
    role: AdminRoleKey,
    checked: boolean,
  ) => {
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              permissions: {
                ...module.permissions,
                [action]: {
                  ...module.permissions[action],
                  [role]: checked,
                },
              },
            }
          : module,
      ),
    );
  };

  const savePermissions = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(isEn ? "Permissions updated" : "權限已更新");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{isEn ? "System Settings" : "系統設定"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEn ? "Create roles and control operation permissions" : "建立角色並配置操作權限"}
        </p>
      </div>

      <SystemSettingsNav />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEn ? "Permission Management" : "權限管理"}</CardTitle>
          <Button onClick={savePermissions} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? (isEn ? "Saving..." : "儲存中...") : (isEn ? "Save Permission Matrix" : "儲存權限矩陣")}
          </Button>
        </CardHeader>
        <CardContent>
          <PermissionMatrix modules={modules} onToggle={onTogglePermission} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemPermissionManagementPage;
