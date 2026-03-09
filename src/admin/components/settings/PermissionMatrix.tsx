import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  AdminRoleKey,
  PermissionAction,
  PermissionModule,
} from "@/admin/data/adminSystemSettingsData";
import { adminRoles, permissionActions } from "@/admin/data/adminSystemSettingsData";

interface PermissionMatrixProps {
  modules: PermissionModule[];
  onToggle: (
    moduleId: string,
    action: PermissionAction,
    role: AdminRoleKey,
    checked: boolean,
  ) => void;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ modules, onToggle }) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{isEn ? module.name : module.nameZh}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isEn ? "Operation" : "操作權限"}</TableHead>
                  {adminRoles.map((role) => (
                    <TableHead key={role.key} className="text-center">
                      {isEn ? role.label : role.labelZh}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionActions.map((action) => (
                  <TableRow key={action.key}>
                    <TableCell>{isEn ? action.label : action.labelZh}</TableCell>
                    {adminRoles.map((role) => (
                      <TableCell key={`${module.id}-${action.key}-${role.key}`} className="text-center">
                        <Checkbox
                          checked={module.permissions[action.key][role.key]}
                          onCheckedChange={(checked) =>
                            onToggle(module.id, action.key, role.key, checked === true)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PermissionMatrix;
