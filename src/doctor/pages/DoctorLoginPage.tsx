import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Stethoscope, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const DoctorLoginPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!mobile.trim()) { toast({ title: isEn ? "Please enter mobile number" : "請輸入手機號碼", variant: "destructive" }); return; }
    if (!password) { toast({ title: isEn ? "Please enter password" : "請輸入密碼", variant: "destructive" }); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/doctor/orders");
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{isEn ? "Dentist Login" : "牙醫登入"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isEn ? "Sign in to manage your appointments" : "登入以管理您的預約"}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Mobile Number" : "手機號碼"}</label>
            <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={isEn ? "+852 XXXX XXXX" : "+852 XXXX XXXX"} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Password" : "密碼"}</label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEn ? "Enter password" : "輸入密碼"} />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPw ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</button>
            </div>
          </div>
          <div className="text-right">
            <button onClick={() => toast({ title: isEn ? "API key not added yet — Password reset placeholder" : "尚未添加API密鑰 — 密碼重設佔位" })} className="text-sm text-primary hover:underline">{isEn ? "Forgot Password?" : "忘記密碼？"}</button>
          </div>
          <Button className="w-full" onClick={handleLogin} disabled={loading}>{loading ? (isEn ? "Signing in..." : "登入中...") : (isEn ? "Sign In" : "登入")}</Button>
          <div className="text-center">
            <button onClick={() => navigate("/doctor/activation")} className="text-sm text-primary hover:underline">{isEn ? "Need to activate account?" : "需要啟用帳戶？"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginPage;
