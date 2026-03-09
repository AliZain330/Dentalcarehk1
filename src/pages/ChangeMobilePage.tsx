import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const ChangeMobilePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const s = t.accountSecurity;
  const [newMobile, setNewMobile] = useState("");
  const [code, setCode] = useState("");

  const handleSave = () => {
    if (!newMobile || newMobile.length !== 8) {
      toast({ title: t.auth.phoneInvalid, variant: "destructive" });
      return;
    }
    // TODO: Integrate real SMS verification API
    toast({ title: s.mobileChanged });
    navigate(-1);
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.changeMobile}</h1>
      </div>
      <ApiPlaceholderNotice service="SMS Verification" className="mb-4" />
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.currentMobile}</label>
            <Input value="+852 9123 4567" disabled />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.newMobile}</label>
            <Input value={newMobile} onChange={(e) => setNewMobile(e.target.value)} placeholder="+852" maxLength={8} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.verificationCode}</label>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} className="flex-1" maxLength={6} />
              <Button variant="outline" size="sm" onClick={() => toast({ title: "SMS Verification API key not added yet" })}>{s.sendCode}</Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>{s.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeMobilePage;
