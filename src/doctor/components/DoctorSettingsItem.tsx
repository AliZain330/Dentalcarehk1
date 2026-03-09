import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  desc?: string;
  onClick: () => void;
  iconClassName?: string;
  rightContent?: React.ReactNode;
  destructive?: boolean;
}

const DoctorSettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, desc, onClick, iconClassName, rightContent, destructive }) => (
  <Card className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-3.5 flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${destructive ? "bg-destructive/10" : "bg-muted"}`}>
        <Icon className={`h-4 w-4 ${destructive ? "text-destructive" : iconClassName || "text-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${destructive ? "text-destructive" : "text-foreground"}`}>{label}</p>
        {desc && <p className="text-xs text-muted-foreground truncate">{desc}</p>}
      </div>
      {rightContent || <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
    </CardContent>
  </Card>
);

export default DoctorSettingsItem;
