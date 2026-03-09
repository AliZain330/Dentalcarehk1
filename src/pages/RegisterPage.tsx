import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Eye, EyeOff } from "lucide-react";

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = t.auth.nameRequired;
    if (mode === "email") {
      if (!form.email) errs.email = t.auth.emailRequired;
      else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t.auth.emailInvalid;
    } else {
      if (!form.phone) errs.phone = t.auth.phoneRequired;
      else if (!/^\d{8}$/.test(form.phone)) errs.phone = t.auth.phoneInvalid;
    }
    if (!form.password) errs.password = t.auth.passwordRequired;
    else if (form.password.length < 8) errs.password = t.auth.passwordMin;
    if (form.password !== form.confirmPassword) errs.confirmPassword = t.auth.passwordMismatch;
    if (!form.agreeTerms) errs.terms = t.auth.termsRequired;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      navigate("/verification", { state: { target: mode === "email" ? form.email : `+852 ${form.phone}`, mode } });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t.auth.register}</h1>
      </div>

      <Card className="w-full max-w-sm border-0 shadow-md">
        <CardContent className="p-6">
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
            <div>
              <Input
                placeholder={t.auth.fullName}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

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
                  <span className="flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">+852</span>
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
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}

            <div>
              <Input
                type="password"
                placeholder={t.auth.confirmPassword}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="mt-0.5 rounded border-input"
              />
              {t.auth.agreeToTerms}
            </label>
            {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

            <Button type="submit" className="w-full">{t.auth.signUp}</Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <button onClick={() => navigate("/login")} className="font-medium text-primary hover:underline">
              {t.auth.signIn}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
