import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Shield, Eye, EyeOff, CheckCircle2, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiPlaceholderNotice from "@/components/ApiPlaceholderNotice";
import { toast } from "@/hooks/use-toast";

const DoctorActivationPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isEn = language !== "zh-HK";

  const [step, setStep] = useState<"verify" | "password" | "success">("verify");
  const [mobile, setMobile] = useState("+852 9123 4567");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const handleSendCode = () => {
    setCodeSent(true);
    toast({ title: isEn ? "API key not added yet — SMS verification placeholder" : "尚未添加API密鑰 — 短訊驗證佔位" });
  };

  const handleVerify = () => {
    if (code.length < 4) { toast({ title: isEn ? "Please enter verification code" : "請輸入驗證碼", variant: "destructive" }); return; }
    setStep("password");
  };

  const handleActivate = () => {
    if (password.length < 8) { toast({ title: isEn ? "Password must be at least 8 characters" : "密碼最少8個字元", variant: "destructive" }); return; }
    if (password !== confirmPassword) { toast({ title: isEn ? "Passwords do not match" : "密碼不一致", variant: "destructive" }); return; }
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <CheckCircle2 className="h-20 w-20 text-success" />
        <h1 className="mt-4 text-xl font-bold text-foreground">{isEn ? "Account Activated!" : "帳戶已啟用！"}</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">{isEn ? "Your dentist account is now active. Please complete your profile to start accepting patients." : "您的牙醫帳戶已啟用。請完善個人資料以開始接診。"}</p>
        <Button className="mt-6 w-full max-w-xs" onClick={() => navigate("/doctor/profile-completion")}>{isEn ? "Complete Profile" : "完善資料"}</Button>
        <Button variant="ghost" className="mt-2" onClick={() => navigate("/doctor/login")}>{isEn ? "Go to Login" : "前往登入"}</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{isEn ? "Activate Dentist Account" : "啟用牙醫帳戶"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{isEn ? "Your institution has registered your account. Verify your mobile and set a password to activate." : "您的機構已為您註冊帳戶。驗證手機號碼並設定密碼以啟用。"}</p>
        </div>

        {step === "verify" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Registered Mobile" : "已註冊手機號碼"}</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{mobile}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{isEn ? "This number was registered by your institution" : "此號碼由您的機構登記"}</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Verification Code" : "驗證碼"}</label>
              <div className="flex gap-2">
                <Input type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} placeholder={isEn ? "Enter code" : "輸入驗證碼"} className="flex-1" />
                <Button variant="outline" onClick={handleSendCode} disabled={codeSent} className="shrink-0">{codeSent ? (isEn ? "Sent" : "已發送") : (isEn ? "Send Code" : "發送驗證碼")}</Button>
              </div>
            </div>
            <ApiPlaceholderNotice service={isEn ? "SMS Verification" : "短訊驗證"} variant="inline" />
            <Button className="w-full" onClick={handleVerify}>{isEn ? "Verify & Continue" : "驗證並繼續"}</Button>
            <div className="text-center">
              <button onClick={() => navigate("/doctor/login")} className="text-sm text-primary hover:underline">{isEn ? "Already activated? Login" : "已啟用？登入"}</button>
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-4">
            <Card className="border-success/30 bg-success/5"><CardContent className="p-3 flex gap-2 items-center"><CheckCircle2 className="h-4 w-4 text-success" /><p className="text-sm text-foreground">{isEn ? "Mobile verified successfully" : "手機號碼驗證成功"}</p></CardContent></Card>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Set Password" : "設定密碼"}</label>
              <div className="relative">
                <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEn ? "At least 8 characters" : "至少8個字元"} />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPw ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{isEn ? "Confirm Password" : "確認密碼"}</label>
              <div className="relative">
                <Input type={showCpw ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={isEn ? "Re-enter password" : "重新輸入密碼"} />
                <button onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showCpw ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}</button>
              </div>
              {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-destructive">{isEn ? "Passwords do not match" : "密碼不一致"}</p>}
            </div>
            <Button className="w-full" onClick={handleActivate} disabled={!password || !confirmPassword}>{isEn ? "Activate Account" : "啟用帳戶"}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorActivationPage;
