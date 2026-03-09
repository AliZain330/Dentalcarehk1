import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, ArrowLeft } from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "email") {
      if (!value || !/\S+@\S+\.\S+/.test(value)) {
        setError(t.auth.emailInvalid);
        return;
      }
    } else {
      if (!value || !/^\d{8}$/.test(value)) {
        setError(t.auth.phoneInvalid);
        return;
      }
    }
    setError("");
    setSent(true);
    navigate("/verification", {
      state: { target: mode === "email" ? value : `+852 ${value}`, mode, flow: "reset" },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="p-6">
          <button
            onClick={() => navigate("/login")}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.auth.backToLogin}
          </button>

          <h1 className="mb-2 text-xl font-bold text-foreground">{t.auth.forgotPassword}</h1>

          <div className="mb-6 flex rounded-lg bg-muted p-1">
            <button
              onClick={() => { setMode("email"); setValue(""); setError(""); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              {t.auth.resetViaEmail}
            </button>
            <button
              onClick={() => { setMode("phone"); setValue(""); setError(""); }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "phone" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              {t.auth.resetViaPhone}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "email" ? (
              <Input
                type="email"
                placeholder={t.auth.email}
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <div className="flex gap-2">
                <span className="flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">+852</span>
                <Input
                  type="tel"
                  placeholder="9XXX XXXX"
                  value={value}
                  onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 8))}
                />
              </div>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" className="w-full">{t.auth.sendCode}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
