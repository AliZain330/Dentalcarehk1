import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const ChangePasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const s = t.accountSecurity;
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!current) e.current = t.auth.passwordRequired;
    if (newPw.length < 8) e.newPw = t.auth.passwordMin;
    if (newPw !== confirm) e.confirm = t.auth.passwordMismatch;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // TODO: Integrate real password change API
    toast({ title: s.passwordChanged });
    navigate(-1);
  };

  return (
    <div className="animate-fade-in p-4 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-muted"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">{s.changePassword}</h1>
      </div>
      <ApiPlaceholderNotice service="Authentication" className="mb-4" />
      <Card className="border-0 shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.currentPassword}</label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            {errors.current && <p className="mt-1 text-xs text-destructive">{errors.current}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.newPassword}</label>
            <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            {errors.newPw && <p className="mt-1 text-xs text-destructive">{errors.newPw}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{s.confirmPassword}</label>
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm}</p>}
          </div>
          <Button className="w-full" onClick={handleSave}>{s.save}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
