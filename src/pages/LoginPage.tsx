import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "", password: "", remember: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (mode === "email") {
      if (!form.email) errs.email = t.auth.emailRequired;
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t.auth.emailInvalid;
    } else {
      if (!form.phone) errs.phone = t.auth.phoneRequired;
      else if (!/^\d{8}$/.test(form.phone)) errs.phone = t.auth.phoneInvalid;
    }
    if (!form.password) errs.password = t.auth.passwordRequired;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <span className="text-2xl font-bold text-primary-foreground">D+</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{t.auth.login}</h1>
      </div>

      {/* Language toggle */}
      <button
        onClick={() => setLanguage(language === "en" ? "zh-HK" : "en")}
        className="mb-6 text-sm text-primary underline-offset-2 hover:underline"
      >
        {language === "en" ? "繁體中文" : "English"}
      </button>

      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="p-6">
          {/* Mode tabs */}
          <div className="mb-6 flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setMode("email")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              {t.auth.email}
            </button>
            <button
              onClick={() => setMode("phone")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
                mode === "phone" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              {t.auth.phone}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "email" ? (
              <div>
                <Input
                  type="email"
                  placeholder={t.auth.email}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    +852
                  </span>
                  <Input
                    type="tel"
                    placeholder="9XXX XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
            )}

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.auth.password}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="rounded border-input"
                />
                {t.auth.rememberMe}
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-primary hover:underline"
              >
                {t.auth.forgotPasswordLink}
              </button>
            </div>

            <Button type="submit" className="w-full">
              {t.auth.signIn}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.noAccount}{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-primary hover:underline"
            >
              {t.auth.signUp}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
