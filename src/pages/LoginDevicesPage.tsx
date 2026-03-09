import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Device {
  id: string;
  name: string;
  type: "desktop" | "mobile" | "tablet";
  lastLogin: string;
  isCurrent: boolean;
}

const mockDevices: Device[] = [
  { id: "dev1", name: "iPhone 15 Pro", type: "mobile", lastLogin: "2026-03-09 10:30", isCurrent: true },
  { id: "dev2", name: "MacBook Pro", type: "desktop", lastLogin: "2026-03-08 18:45", isCurrent: false },
  { id: "dev3", name: "iPad Air", type: "tablet", lastLogin: "2026-03-05 09:00", isCurrent: false },
];

const iconMap = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const LoginDevicesPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const s = t.accountSecurity;
  const [devices, setDevices] = useState(mockDevices);

  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    toast({ title: s.deviceRemoved });
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.loginDevices}</h1>
      </div>
      <div className="space-y-2">
        {devices.map((device) => {
          const Icon = iconMap[device.type];
          return (
            <Card key={device.id} className="border-0 shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <Icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{device.name}</span>
                    {device.isCurrent && <Badge variant="secondary" className="text-[10px]">{s.currentDevice}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.lastLogin}: {device.lastLogin}</p>
                </div>
                {!device.isCurrent && (
                  <button onClick={() => removeDevice(device.id)} className="rounded-full p-1.5 hover:bg-muted">
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LoginDevicesPage;
