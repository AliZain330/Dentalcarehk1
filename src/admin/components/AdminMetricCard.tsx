import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AdminMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: { value: string; positive: boolean };
}

const AdminMetricCard: React.FC<AdminMetricCardProps> = ({ icon: Icon, label, value, subLabel, trend }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subLabel && <p className="text-[11px] text-muted-foreground">{subLabel}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AdminMetricCard;
