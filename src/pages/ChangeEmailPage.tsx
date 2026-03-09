import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const ChangeEmailPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const s = t.accountSecurity;
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");

  const handleSave = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({ title: t.auth.emailInvalid, variant: "destructive" });
      return;
    }
    // TODO: Integrate real email verification API
    toast({ title: s.emailChanged });
    navigate(-1);
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.changeEmail}</h1>
      </div>
      <ApiPlaceholderNotice service="Email Verification" className="mb-4" />
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.currentEmail}</label>
            <Input value="user@example.com" disabled />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.newEmail}</label>
            <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.verificationCode}</label>
            <div className="flex gap-2">
              <Input value={code} onChange={(e) => setCode(e.target.value)} className="flex-1" maxLength={6} />
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Email Verification API key not added yet" })}>{s.sendCode}</Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>{s.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeEmailPage;
